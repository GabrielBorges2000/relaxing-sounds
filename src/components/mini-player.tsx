import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "./theme-provider"
import { PlayIcon, PauseIcon, XIcon } from "./icons"
import { MotiView } from "moti"
import type { SoundMix } from "@/types"
import { isLoading } from "expo-font"

interface MiniPlayerProps {
  mix: SoundMix
  isPlaying: boolean
  isLoading: boolean
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onPress: () => void
}


export function MiniPlayer({ mix, isPlaying, onPlay, onPause, onStop, onPress, isLoading }: MiniPlayerProps) {
  const { theme } = useTheme()

  return (
    <MotiView
      style={[
        {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      ]}
    >
      <TouchableOpacity style={styles.infoContainer} onPress={onPress}>
        <View style={styles.infoContent}>
          <Text style={{ color: theme.colors.text }} numberOfLines={1}>
            {mix.name}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        {isLoading ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <TouchableOpacity style={styles.controlButton} onPress={isPlaying ? onPause : onPlay}>

            {isPlaying ? (
              <PauseIcon color={theme.colors.primary} size={24} />
            ) : (
              <PlayIcon color={theme.colors.primary} size={24} />
            )}
          </TouchableOpacity>

        )}
        <TouchableOpacity style={styles.controlButton} onPress={onStop}>
          <XIcon color={theme.colors.error} size={24} />
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 50,
    borderTopWidth: 1,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  mixName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  controlButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
})
