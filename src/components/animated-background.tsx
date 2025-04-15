
import React from 'react'
import { StyleSheet, View } from "react-native"
import { MotiView } from "moti"
import { useTheme } from "./theme-provider"


const _AnimatedBackground = () => {
  const { theme } = useTheme()

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Animated circles */}
      <MotiView
        from={{
          opacity: 0.5,
          scale: 0.9,
        }}
        animate={{
          opacity: 0.2,
          scale: 1.1,
        }}
        transition={{
          type: "timing",
          duration: 8000,
          loop: true,
        }}
        style={[styles.circle, styles.circle1, { backgroundColor: theme.colors.primary }]}
      />

      <MotiView
        from={{
          opacity: 0.3,
          scale: 1,
        }}
        animate={{
          opacity: 0.1,
          scale: 1.2,
        }}
        transition={{
          type: "timing",
          duration: 10000,
          loop: true,
          delay: 1000,
        }}
        style={[styles.circle, styles.circle2, { backgroundColor: theme.colors.secondary }]}
      />

      <MotiView
        from={{
          opacity: 0.2,
          scale: 1.1,
        }}
        animate={{
          opacity: 0.05,
          scale: 1.3,
        }}
        transition={{
          type: "timing",
          duration: 12000,
          loop: true,
          delay: 2000,
        }}
        style={[styles.circle, styles.circle3, { backgroundColor: theme.colors.primary }]}
      />
    </View>
  )
}

export const AnimatedBackground = React.memo(_AnimatedBackground)

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  circle: {
    position: "absolute",
    borderRadius: 500,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 400,
    height: 400,
    bottom: -100,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    top: "40%",
    left: "50%",
    marginLeft: -100,
  },
})
