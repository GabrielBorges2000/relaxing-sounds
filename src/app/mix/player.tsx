import { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as FileSystem from "expo-file-system"
import * as MediaLibrary from "expo-media-library"
import * as Sharing from "expo-sharing"
import { useTheme } from "@/components/theme-provider"
import { useSoundLibrary } from "@/hooks/use-sound-library"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import type { SoundMix } from "@/types"
import { PauseIcon, PlayIcon, TimerIcon, BackIcon, LoopIcon, DownloadIcon } from "@/components/icons"
import { TimerModal } from "@/components/timer-modal"
import { AnimatedWaveform } from "@/components/animated-waveform"

export default function MixPlayerScreen() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const {
    playMix,
    pauseMix,
    resumeMix,
    stopMix,
    toggleLoop,
    setTimer,
    isPlaying,
    isLoopEnabled,
    timeRemaining,
    timerActive,
  } = useAudioPlayer()

  const [mix, setMix] = useState<SoundMix | null>(null)
  const [timerModalVisible, setTimerModalVisible] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isDownloading, setIsDownloading] = useState(false)

  const rotationAnim = useRef(new Animated.Value(0)).current
  const isMounted = useRef(false)

  // Parse mix from params
  useEffect(() => {
    if (params.mix) {
      try {
        const parsedMix = JSON.parse(params.mix as string) as SoundMix
        setMix(parsedMix)

        // Iniciar a pré-visualização do mix automaticamente

      } catch (error) {
        console.error("Error parsing mix:", error)
        router.back()
      }
    }

    return () => {
      // Para a reproducao quando sair da tela
      stopMix()
    }
  }, [params.mix])

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    } else if (mix && isPlaying) {
      // Se o componente já foi montado e o play foi clicado, toca o mix completo
      playMix(mix)
    }
  }, [isPlaying, mix])

  // Animation for playing state
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
      ).start(() => {
        rotationAnim.setValue(0)
      })
    } else if (mix) {
      rotationAnim.stopAnimation()
    }
  }, [isPlaying])
  useEffect(() => {
    if (mix) {
      playMix(mix)
    }
  }, [mix])
  const handleTogglePlayPause = async () => {
    if (isPlaying) {
      await pauseMix()
    } else {
      await resumeMix()
    }
  }

  const handleToggleLoop = async () => {

    await toggleLoop()
  }

  const handleStartTimer = (minutes: number) => {
    setTimer(minutes)
    setTimerModalVisible(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    const formattedHours = hours > 0 ? `${hours}:` : ""
    const formattedMinutes = `${minutes.toString().padStart(2, "0")}:`
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0")

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`
  }

  const downloadMix = async () => {
    if (!mix) return
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      // Em uma implementação real, aqui você faria a exportação do áudio
      // Isso é apenas uma simulação
      for (let i = 0; i <= 100; i += 10) {
        setDownloadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      if (status === "granted") {
        setIsDownloading(true)
        const fileUri = FileSystem.documentDirectory + `${mix.name.replace(/\s+/g, "_")}.mp3`

        // Em uma implementação real, você criaria um arquivo de áudio real
        const asset = await MediaLibrary.createAssetAsync(fileUri)
        await MediaLibrary.createAlbumAsync("Relaxing Sounds", asset, false)
        setIsDownloading(false)
        setDownloadProgress(0)
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri)
        }
        Alert.alert("Sucesso", `Mixer "${mix.name}" salvo com sucesso!`)
      } else
        Alert.alert("Erro", "Precisamos de permissão para salvar o mixer no seu dispositivo")
    } catch (error) {
      console.error("Erro ao baixar mixer:", error)
      setIsDownloading(false)
      Alert.alert("Erro", "Erro ao salvar o mixer. Tente novamente.")
    }
  }

  const spin = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  if (!mix) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Carregando mix...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <BackIcon color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Reproduzindo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.playerContainer}>
        <Animated.View
          style={[
            styles.albumArt,
            {
              backgroundColor: isPlaying ? theme.colors.card : theme.colors.card,
              borderColor: theme.colors.primary,
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <Text style={styles.albumText}>{mix.name.substring(0, 2).toUpperCase()}</Text>
        </Animated.View>

        <Text style={[styles.mixName, { color: theme.colors.text }]}>{mix.name}</Text>

        <Text style={[styles.mixDetails, { color: theme.colors.textMuted }]}>
          {mix.sounds.length} som{mix.sounds.length !== 1 ? "s" : ""}
        </Text>

        <AnimatedWaveform isPlaying={isPlaying} />

        {timerActive && (
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: theme.colors.primary }]}>
              Tempo restante: {formatTime(timeRemaining)}
            </Text>
          </View>
        )}

        {isDownloading && (
          <View style={styles.downloadProgressContainer}>
            <View
              style={[
                styles.downloadProgressBar,
                {
                  backgroundColor: theme.colors.primary,
                  width: `${downloadProgress}%`,
                },
              ]}
            />
            <Text style={[styles.downloadProgressText, { color: theme.colors.text }]}>
              Baixando: {downloadProgress}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: theme.colors.card }]}
          onPress={() => setTimerModalVisible(true)}
        >
          <TimerIcon color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleTogglePlayPause}
        >
          {isPlaying ? (
            <PauseIcon color={theme.colors.buttonText} size={32} />
          ) : (
            <PlayIcon color={theme.colors.buttonText} size={32} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            {
              backgroundColor: isLoopEnabled ? theme.colors.primary : theme.colors.card,
            },
          ]}
          onPress={handleToggleLoop}
        >
          <LoopIcon color={isLoopEnabled ? theme.colors.buttonText : theme.colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.downloadButton, { backgroundColor: theme.colors.secondary }]}
        onPress={downloadMix}
        disabled={isDownloading}
      >
        <DownloadIcon color={theme.colors.buttonText} />
        <Text style={[styles.downloadButtonText, { color: theme.colors.buttonText }]}>
          {isDownloading ? "Baixando..." : "Baixar Mixer"}
        </Text>
      </TouchableOpacity>

      <TimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onSelectTimer={handleStartTimer}
        customMinutes={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
  },
  placeholder: {
    width: 40,
  },
  playerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 4,
  },
  albumText: {
    fontSize: 60,
    fontFamily: " Inter_700Bold",
    color: "white",
  },
  mixName: {
    fontSize: 24,
    fontFamily: " Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  mixDetails: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
    textAlign: "center",
    marginBottom: 30,
  },
  timerContainer: {
    marginTop: 20,
  },
  timerText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    fontFamily: " Inter_400Regular",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    display: "none"
  },
  downloadButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  downloadProgressContainer: {
    width: "80%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },
  downloadProgressBar: {
    height: "100%",
    borderRadius: 10,
  },
  downloadProgressText: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    lineHeight: 20,
  },
})
