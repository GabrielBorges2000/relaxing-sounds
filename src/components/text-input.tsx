
import { TextInput as RNTextInput, StyleSheet, type TextInputProps, View, Text } from "react-native";
import { useTheme } from "./theme-provider";
import React from "react";

interface CustomTextInputProps extends TextInputProps {
  label?: string
  error?: string
}

export function TextInput({ label, error, style, ...props }: CustomTextInputProps) {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>}
      <RNTextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.card,
            borderColor: error ? theme.colors.error : theme.colors.border,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
      {error && <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create<{ [key: string]: any }>({
  container: {
    minHeight: 50
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginBottom: 6,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: " Inter_400Regular",
  },
  error: {
    fontSize: 12,
    fontFamily: " Inter_400Regular",
    marginTop: 4,
  },
});

export default React.memo(TextInput);
