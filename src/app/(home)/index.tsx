import React, { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, AppState } from "react-native"
import { useRouter } from "expo-router"
import { Audio } from "expo-av"
import { Slider } from "@/components/slider"
import { useTheme } from "@/components/theme-provider"
import { useSoundLibrary } from "@/hooks/use-sound-library"
import { useMixStorage } from "@/hooks/use-mix-storage"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import type { SoundMix } from "@/types"
import { Button } from "@/components/button"
import { PlayIcon, SaveIcon } from "@/components/icons"
import { TimerModal } from "@/components/timer-modal"
import { AnimatedBackground } from "@/components/animated-background"
import { MiniPlayer } from "@/components/mini-player"
import { MotiView } from "moti"
import { Header } from "@/components/header"
import { HeaderControl } from "@/components/header-control"
import { PauseIcon, Volume, Volume1, Volume2 } from 'lucide-react-native'

export default function MixCreator() {
  const { sounds, isLoading } = useSoundLibrary()
  const { saveMix } = useMixStorage()
  const { currentMix, isPlaying, playMix, pauseMix, stopMix, timerMinutes, setTimerMinutes, setTimerActive, timerActive } = useAudioPlayer()
  const router = useRouter()
  const { theme } = useTheme()
  const [activeSounds, setActiveSounds] = useState<Record<string, Audio.Sound | null>>({})
  const [volumes, setVolumes] = useState<Record<string, number>>({})
  const [mixName, setMixName] = useState("Meu Mix Relaxante")
  const [timerModalVisible, setTimerModalVisible] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [soundStatus, setSoundStatus] = useState<Record<string, boolean>>({})


  const appState = useRef(AppState.currentState)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize volumes
  useEffect(() => {
    if (sounds.length > 0) {
      const initialVolumes: Record<string, number> = {}
      sounds.forEach((sound) => {
        initialVolumes[sound.id] = 0
      })
      setVolumes(initialVolumes)
    }
  }, [sounds])

  // Load sounds
  useEffect(() => {
    return () => {
      // Unload all sounds when component unmounts
      Object.values(activeSounds).forEach((sound) => {
        if (sound) {
          sound.unloadAsync()
        }
      })
    }
  }, [activeSounds])

  // Timer effect
  useEffect(() => {
    if (timerActive && timerMinutes > 0) {
      timerRef.current = setTimeout(
        () => {
          stopAllSounds()
          setTimerActive(false)
          setPreviewMode(false)
        },
        timerMinutes * 60 * 1000,
      )
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timerActive, timerMinutes])

  // Monitor app state for background playback
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/active/) && nextAppState.match(/inactive|background/) && previewMode) {
        // App is going to background, keep playing
        console.log("App going to background, keeping audio playing")
      }

      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [previewMode])

  const loadSound = async (soundId: string) => {
    try {
      const sound = sounds.find((s) => s.id === soundId)
      if (!sound) return

      const { sound: audioSound } = await Audio.Sound.createAsync(sound.source, {
        isLooping: true,
        volume: volumes[soundId],
      })

      setActiveSounds((prev) => ({
        ...prev,
        [soundId]: audioSound,
      }))

      return audioSound
    } catch (error) {
      console.error("Error loading sound:", error)
      return null
    }
  }

  const toggleSound = async (soundId: string) => {
    try {
      // Parar o mixer atual se estiver tocando
      if (currentMix && isPlaying) {
        stopMix()
      }

      let sound = activeSounds[soundId]
      if (!sound) {
        const newSound = await loadSound(soundId)
        if (!newSound) return
        sound = newSound
      }

      const status = await sound.getStatusAsync()

      if (status.isLoaded) {
        if (status.isPlaying) {
          await sound.pauseAsync()
          setSoundStatus((prev) => ({ ...prev, [soundId]: false }))
          const allPaused = await checkAllSoundsPaused()
          if (allPaused) setPreviewMode(false)
        } else {
          await sound.playAsync()
          setSoundStatus((prev) => ({ ...prev, [soundId]: true }))
          setPreviewMode(true)
        }
      }

    } catch (error) {
      console.error("Error toggling sound:", error)
    }
  }

  const checkAllSoundsPaused = async () => {
    for (const soundId in activeSounds) {
      const sound = activeSounds[soundId]
      if (sound) {
        const status = await sound.getStatusAsync()
        if (status.isLoaded && status.isPlaying) {
          return false
        }
      }
    }
    return true
  }

  const updateVolume = async (soundId: string, value: number) => {
    setVolumes((prev) => ({
      ...prev,
      [soundId]: value,
    }))

    try {
      const sound = activeSounds[soundId]

      if (sound) {
        await sound.setVolumeAsync(value)

        // If volume is set to 0, pause the sound
        if (value === 0) {
          await sound.pauseAsync()

          // Se todos os sons estiverem pausados, sair do modo de preview
          const allPaused = await checkAllSoundsPaused()
          if (allPaused) {
            setPreviewMode(false)
          }
        } else {
          // If sound was not playing and volume is increased, start playing
          const status = await sound.getStatusAsync()
          if (status.isLoaded && !status.isPlaying) {
            await sound.playAsync()
            setPreviewMode(true)
          }
        }
      }
    } catch (error) {
      console.error("Error updating volume:", error)
    }
  }

  const stopAllSounds = async () => {
    try {
      for (const soundId in activeSounds) {
        const sound = activeSounds[soundId]
        if (sound) {
          await sound.stopAsync()
        }
      }
      setPreviewMode(false)
    } catch (error) {
      console.error("Error stopping sounds:", error)
    }
  }

  const handleSaveMix = async () => {
    const activeSoundIds = Object.entries(volumes)
      .filter(([_, volume]) => volume > 0)
      .map(([id, volume]) => ({ id, volume }))

    if (activeSoundIds.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos um som ao seu mix")
      return
    }

    const mix: SoundMix = {
      id: Date.now().toString(),
      name: mixName,
      sounds: activeSoundIds,
      createdAt: new Date().toISOString(),
    }

    await saveMix(mix)
    Alert.alert("Sucesso", "Mix salvo com sucesso!")
  }

  const handlePlayMix = () => {
    if (currentMix && isPlaying) {
      stopMix();
    }

    stopAllSounds();

    const activeSoundIds = Object.entries(volumes)
      .filter(([_, volume]) => volume > 0)
      .map(([id, volume]) => ({ id, volume }));

    if (activeSoundIds.length === 0) {
      Alert.alert("Erro", "Adicione pelo menos um som ao seu mix");
      return;
    }

    const mix: SoundMix = { id: "temp", name: mixName, sounds: activeSoundIds, createdAt: new Date().toISOString() };

    router.push({ pathname: "/mix/player", params: { mix: JSON.stringify(mix) } });
  };


  const handleUploadMix = () => {
    setUploadModalVisible(true)
  }

  const startTimer = (minutes: number) => {
    if (minutes === 0) {
      // Desativar timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setTimerActive(false)
      setTimerMinutes(0)
    } else {
      setTimerMinutes(minutes)
      setTimerActive(true)
    }
    setTimerModalVisible(false)
  }

  const navigateToSavedMixes = () => {
    // Parar todos os sons em preview antes de navegar
    stopAllSounds()
    router.push("/mix/saved")
  }

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando...</Text>
      </View>
    )
  }

  const VolumeIcon = ({ volume }: { volume: number }) => {
    const level = volume * 10

    if (level === 0) {
      return <Volume color={theme.colors.text} />
    }

    if (level <= 3) {
      return <Volume1 color={theme.colors.text} />
    }

    return <Volume2 color={theme.colors.text} />
  }

  console.log({ currentMix })

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedBackground />

      {/* Header com informações do usuário */}
      <Header handleUploadMix={handleUploadMix} navigateToSavedMixes={navigateToSavedMixes} />

      <HeaderControl
        mixName={mixName}
        setMixName={setMixName}
        setTimerModalVisible={setTimerModalVisible}
        timerActive={timerActive}
        timerMinutes={timerMinutes}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.soundsList}
        showsVerticalScrollIndicator={true}
      >
        {sounds.map((sound) => (
          <MotiView
            key={sound.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500, delay: sounds.indexOf(sound) * 100 }}
            style={[styles.soundCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          >
            <View style={styles.soundHeader} >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity onPress={() => toggleSound(sound.id)}>
                  {soundStatus[sound.id] ? (
                    <PauseIcon color={theme.colors.primary} size={24} />
                  ) : (
                    <PlayIcon color={theme.colors.primary} size={24} />
                  )}
                </TouchableOpacity>
                <Text style={[styles.soundName, { color: theme.colors.text }]}>{sound.name}</Text>
              </View>
              <View
                style={[
                  styles.soundIndicator,
                  {
                    backgroundColor: volumes[sound.id] > 0 ? theme.colors.primary : theme.colors.textMuted,
                  },
                ]}
              />
            </View>

            <View style={{ flexDirection: 'row', alignItems: "center", width: "95%" }}>
              <VolumeIcon volume={volumes[sound.id] || 0} />

              <Slider
                value={volumes[sound.id] || 0}
                onValueChange={(value) => updateVolume(sound.id, value)}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.border}
                thumbTintColor={theme.colors.primary}
              />
            </View>
          </MotiView>
        ))}

        {/* Espaço extra no final para evitar que o último item seja coberto pelo banner */}
        <View style={{ height: currentMix ? 140 : 70 }} />
      </ScrollView>



      <View style={styles.footer}>
        <Button
          onPress={handleSaveMix}
          style={[styles.button, { backgroundColor: theme.colors.secondary }]}
          icon={<SaveIcon color={theme.colors.buttonText} />}
        >
          Salvar Mix
        </Button>

        <Button
          onPress={handlePlayMix}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          icon={<PlayIcon color={theme.colors.buttonText} />}
        >
          Reproduzir Mix
        </Button>
      </View>

      {/* Mini Player quando um mix estiver tocando */}
      {currentMix && (
        <MiniPlayer
          mix={currentMix}
          isPlaying={isPlaying}
          isLoading
          onPlay={() => playMix(currentMix)}
          onPause={pauseMix}
          onStop={stopMix}
          onPress={() =>
            router.push({
              pathname: "/mix/player",
              params: { mix: JSON.stringify(currentMix) },
            })
          }
        />
      )}

      <TimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onSelectTimer={startTimer}
        customMinutes={true}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    zIndex: 2,
  },
  mixNameInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  headerButtons: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  timerIndicator: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1
  },
  soundsList: {
    padding: 16,
    paddingBottom: 80, // Espaço para o banner de anúncios
  },
  soundCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  soundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  soundName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  soundIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    zIndex: 2,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    height: 50,
    borderRadius: 25,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    fontFamily: " Inter_400Regular",
  },
})
