

import React, { type ReactNode } from "react"
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  type StyleProp,
  type ViewStyle,
  type TextStyle,
  View,
} from "react-native"
import { useTheme } from "./theme-provider"

interface ButtonProps {
  children: ReactNode
  onPress: () => void
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  icon?: ReactNode
  loading?: boolean
  disabled?: boolean
}

const _Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  style,
  textStyle,
  icon,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.colors.primary }, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? <ActivityIndicator color={theme.colors.buttonText} size="small" /> : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, { color: theme.colors.buttonText }, textStyle]}>
            {children}
          </Text>
        </>)
      }
    </TouchableOpacity>
  );
};

export const Button = React.memo(_Button)

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  icon: { marginRight: 8, 
  },
})
