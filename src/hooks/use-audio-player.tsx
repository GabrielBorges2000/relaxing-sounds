import type React from "react"
import { useState, useEffect, useRef, createContext, useContext } from "react"
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"
import { AppState } from "react-native"
import * as Notifications from "expo-notifications"
import { useSoundLibrary } from "./use-sound-library"
import type { SoundMix } from "@/types"

// Configurar notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

interface AudioPlayerContextType {
  currentMix: SoundMix | null
  isPlaying: boolean
  isLoading: boolean
  timeRemaining: number
  timerActive: boolean
  isLoopEnabled: boolean
  playMix: (mix: SoundMix) => Promise<void>
  pauseMix: () => Promise<void>
  resumeMix: () => Promise<void>
  stopMix: () => Promise<void>
  toggleLoop: () => Promise<void>
  setTimer: (minutes: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  currentMix: null,
  isPlaying: false,
  isLoading: false,
  timeRemaining: 0,
  timerActive: false,
  isLoopEnabled: true,
  playMix: async () => { },
  pauseMix: async () => { },
  resumeMix: async () => { },
  stopMix: async () => { },
  toggleLoop: async () => { },
  setTimer: () => { },
})

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const { sounds } = useSoundLibrary()
  const [currentMix, setCurrentMix] = useState<SoundMix | null>(null)
  const [activeSounds, setActiveSounds] = useState<Record<string, Audio.Sound | null>>({})
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoopEnabled, setIsLoopEnabled] = useState(true)
  const [timerMinutes, setTimerMinutes] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  const appState = useRef(AppState.currentState)
  const timerInterval = useRef<NodeJS.Timeout | null>(null)
  const notificationId = useRef<string | null>(null)

  // Monitorar estado do app para manter o áudio funcionando em background
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current === "active" && nextAppState.match(/inactive|background/)) {
        // App está indo para background
        if (isPlaying && currentMix) {
          createPlayerNotification()
        }
      } else if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        // App está voltando para foreground
        if (notificationId.current) {
          Notifications.dismissNotificationAsync(notificationId.current)
          notificationId.current = null
        }
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
      if (notificationId.current) {
        Notifications.dismissNotificationAsync(notificationId.current)
      }
    }
  }, [isPlaying, currentMix])

  // Timer effect
  useEffect(() => {
    if (timerActive && timerMinutes > 0) {
      setTimeRemaining(timerMinutes * 60)

      timerInterval.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            stopMix()
            setTimerActive(false)
            if (timerInterval.current) {
              clearInterval(timerInterval.current)
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }

    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }, [timerActive, timerMinutes])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Unload all sounds when component unmounts
      Object.values(activeSounds).forEach((sound) => {
        if (sound) {
          sound.unloadAsync()
        }
      })

      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }

      if (notificationId.current) {
        Notifications.dismissNotificationAsync(notificationId.current)
      }
    }
  }, [])

  const createPlayerNotification = async () => {
    if (!currentMix) return

    try {
      // Cancelar notificação anterior se existir
      if (notificationId.current) {
        await Notifications.dismissNotificationAsync(notificationId.current)
      }

      // Criar nova notificação
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Relaxing Sounds",
          body: `Reproduzindo: ${currentMix.name}`,
          data: { mixId: currentMix.id },
          autoDismiss: false,
          sticky: true,
        },
        trigger: null,
      })

      notificationId.current = id
    } catch (error) {
      console.error("Erro ao criar notificação:", error)
    }
  }

  const playMix = async (mix: SoundMix) => {
    if (isLoading) return

    try {
      setIsLoading(true)

      // Parar qualquer mix que esteja tocando
      if (currentMix) {
        await stopCurrentSounds()
      }

      setCurrentMix(mix)

      // Configure audio session
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
        playThroughEarpieceAndroid: false,
        interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      })

      const newActiveSounds: Record<string, Audio.Sound | null> = {}

      // Load each sound in the mix
      for (const soundItem of mix.sounds) {
        const soundData = sounds.find((s) => s.id === soundItem.id)
        if (soundData) {
          try {
            const { sound } = await Audio.Sound.createAsync(soundData.source, {
              isLooping: isLoopEnabled,
              volume: soundItem.volume,
              shouldPlay: false,
              progressUpdateIntervalMillis: 100,
            })

            newActiveSounds[soundItem.id] = sound
          } catch (error) {
            console.error(`Error loading sound ${soundItem.id}:`, error)
          }
        }
      }

      setActiveSounds(newActiveSounds)

      // Play all sounds
      for (const soundId in newActiveSounds) {
        const sound = newActiveSounds[soundId]
        if (sound) {
          try {
            await sound.playAsync()
          } catch (error) {
            console.error(`Error playing sound ${soundId}:`, error)
          }
        }
      }

      setIsPlaying(true)

      // Criar notificação se o app estiver em background
      if (appState.current !== "active") {
        createPlayerNotification()
      }
    } catch (error) {
      console.error("Error playing mix:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const pauseMix = async () => {
    try {
      for (const soundId in activeSounds) {
        const sound = activeSounds[soundId]
        if (sound) {
          await sound.pauseAsync()
        }
      }
      setIsPlaying(false)

      // Remover notificação quando pausado
      if (notificationId.current) {
        await Notifications.dismissNotificationAsync(notificationId.current)
        notificationId.current = null
      }
    } catch (error) {
      console.error("Error pausing mix:", error)
    }
  }

  const resumeMix = async () => {
    try {
      for (const soundId in activeSounds) {
        const sound = activeSounds[soundId]
        if (sound) {
          await sound.playAsync()
        }
      }
      setIsPlaying(true)

      // Criar notificação se o app estiver em background
      if (appState.current !== "active") {
        createPlayerNotification()
      }
    } catch (error) {
      console.error("Error resuming mix:", error)
    }
  }

  const stopCurrentSounds = async () => {
    try {
      for (const soundId in activeSounds) {
        const sound = activeSounds[soundId]
        if (sound) {
          await sound.stopAsync()
          await sound.unloadAsync()
        }
      }
      setActiveSounds({})
    } catch (error) {
      console.error("Error stopping current sounds:", error)
    }
  }

  const stopMix = async () => {
    try {
      await stopCurrentSounds()
      setIsPlaying(false)
      setCurrentMix(null)

      // Remover notificação quando parado
      if (notificationId.current) {
        await Notifications.dismissNotificationAsync(notificationId.current)
        notificationId.current = null
      }

      // Desativar timer
      if (timerActive) {
        setTimerActive(false)
        setTimerMinutes(0)
        if (timerInterval.current) {
          clearInterval(timerInterval.current)
          timerInterval.current = null
        }
      }
    } catch (error) {
      console.error("Error stopping mix:", error)
    }
  }

  const toggleLoop = async () => {
    const newLoopState = !isLoopEnabled
    setIsLoopEnabled(newLoopState)

    // Atualizar configuração de loop para todos os sons ativos
    for (const soundId in activeSounds) {
      const sound = activeSounds[soundId]
      if (sound) {
        await sound.setIsLoopingAsync(newLoopState)
      }
    }
  }

  const setTimer = (minutes: number) => {
    if (minutes === 0) {
      // Desativar timer
      setTimerActive(false)
      setTimerMinutes(0)
      setTimeRemaining(0)
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
        timerInterval.current = null
      }
    } else {
      setTimerMinutes(minutes)
      setTimerActive(true)
    }
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentMix,
        isPlaying,
        isLoading,
        timeRemaining,
        timerActive,
        isLoopEnabled,
        playMix,
        pauseMix,
        resumeMix,
        stopMix,
        toggleLoop,
        setTimer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  )
}

export function useAudioPlayer() {
  return useContext(AudioPlayerContext)
}
