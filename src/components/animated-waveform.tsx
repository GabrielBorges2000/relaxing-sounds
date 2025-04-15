
import { View, StyleSheet } from "react-native"
import { MotiView } from "moti"
import { useTheme } from "./theme-provider"

interface AnimatedWaveformProps {
  isPlaying: boolean
}

export function AnimatedWaveform({ isPlaying }: AnimatedWaveformProps) {
  const { theme } = useTheme()

  // Generate random heights for bars
  const generateBars = () => {
    return Array.from({ length: 20 }, () => Math.random() * 0.7 + 0.3)
  }

  const bars = generateBars()

  return (
    <View style={styles.container}>
      {bars.map((height, index) => (
        <MotiView
          key={index}
          animate={{
            height: isPlaying ? [height * 40, height * 20, height * 40] : 10,
          }}
          transition={{
            type: "timing",
            duration: isPlaying ? 1000 + (index % 5) * 300 : 500,
            loop: isPlaying,
          }}
          style={[styles.bar, { backgroundColor: theme.colors.primary }]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "80%",
    marginVertical: 20,
  },
  bar: {
    width: 4,
    marginHorizontal: 2,
    borderRadius: 2,
  },
})
