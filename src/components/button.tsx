

import type React from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
} from "react-native"
import { useTheme } from "./theme-provider"

interface ButtonProps {
  children: React.ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: React.ReactNode
  loading?: boolean
  disabled?: boolean
}

export function Button({ children, onPress, style, textStyle, icon, loading = false, disabled = false }: ButtonProps) {
  const { theme } = useTheme()

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.primary }, disabled && { opacity: 0.6 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.buttonText} size="small" />
      ) : (
        <>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.text, { color: theme.colors.buttonText }, textStyle]}>{children}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  icon: {
    marginRight: 8,
  },
})
