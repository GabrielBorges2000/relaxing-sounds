import { View, StyleSheet } from "react-native"
import * as RNSlider from "@react-native-community/slider"
import { useTheme } from "./theme-provider"

interface SliderProps {
  value: number
  onValueChange: (value: number) => void
  minimumValue?: number
  maximumValue?: number
  step?: number
  minimumTrackTintColor?: string
  maximumTrackTintColor?: string
  thumbTintColor?: string
}

export function Slider({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 1,
  step = 0.01,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
}: SliderProps) {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <RNSlider.default
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={minimumTrackTintColor || theme.colors.primary}
        maximumTrackTintColor={maximumTrackTintColor || theme.colors.border}
        thumbTintColor={thumbTintColor || theme.colors.primary}
        style={styles.slider}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  slider: {
    width: "100%",
    height: 40,
  },
})
