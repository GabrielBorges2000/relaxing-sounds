"use client"

import { useState } from "react"
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from "react-native"
import { useTheme } from "./theme-provider"
import { ClockIcon, XIcon } from "./icons"
import { MotiView } from "moti"

interface TimerModalProps {
  visible: boolean
  onClose: () => void
  onSelectTimer: (minutes: number) => void
  customMinutes?: boolean
}

export function TimerModal({ visible, onClose, onSelectTimer, customMinutes = false }: TimerModalProps) {
  const { theme } = useTheme()
  const [customTime, setCustomTime] = useState("")

  const timerOptions = [
    { label: "1 min", value: 1 },
    { label: "5 min", value: 5 },
    { label: "15 min", value: 15 },
    { label: "30 min", value: 30 },
    { label: "45 min", value: 45 },
    { label: "1 hora", value: 60 },
  ]

  const handleCustomTimeSubmit = () => {
    const minutes = Number.parseInt(customTime)
    if (!isNaN(minutes) && minutes > 0 && minutes <= 180) {
      onSelectTimer(minutes)
      setCustomTime("")
      Keyboard.dismiss()
    } else {
      alert("Por favor, insira um tempo válido entre 1 e 180 minutos.")
    }
  }

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} style={{flex: 1}}>
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={() => {
          Keyboard.dismiss()
          onClose()
        }}
      >
        <View style={styles.overlay}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={[styles.modalContent, { backgroundColor: theme.colors.card }]}
          >
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <ClockIcon color={theme.colors.primary} />
                <Text style={[styles.title, { color: theme.colors.text }]}>Definir Temporizador</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <XIcon color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              {timerOptions.map((option, index) => (
                <MotiView
                  key={option.value}
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 50 }}
                >
                  <TouchableOpacity
                    style={[styles.optionButton, { borderColor: theme.colors.border }]}
                    onPress={() => onSelectTimer(option.value)}
                  >
                    <Text style={[styles.optionText, { color: theme.colors.text }]}>{option.label}</Text>
                  </TouchableOpacity>
                </MotiView>
              ))}

              {customMinutes && (
                <MotiView
                  from={{ opacity: 0, translateY: 10 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: timerOptions.length * 50 }}
                  style={styles.customTimeContainer}
                >
                  <TextInput
                    style={[
                      styles.customTimeInput,
                      {
                        color: theme.colors.text,
                        borderColor: theme.colors.border,
                        backgroundColor: theme.colors.background,
                      },
                    ]}
                    placeholder="Tempo personalizado (min)"
                    placeholderTextColor={theme.colors.textMuted}
                    keyboardType="number-pad"
                    value={customTime}
                    onChangeText={setCustomTime}
                    maxLength={3}
                    returnKeyType="done"
                    onSubmitEditing={handleCustomTimeSubmit}
                  />
                  <TouchableOpacity
                    style={[styles.customTimeButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleCustomTimeSubmit}
                  >
                    <Text style={[styles.customTimeButtonText, { color: theme.colors.buttonText }]}>Definir</Text>
                  </TouchableOpacity>
                </MotiView>
              )}

              <MotiView
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: (timerOptions.length + 1) * 50 }}
              >
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: theme.colors.error,
                    },
                  ]}
                  onPress={() => onSelectTimer(0)}
                >
                  <Text style={[styles.optionText, { color: theme.colors.buttonText }]}>Desativar Timer</Text>
                </TouchableOpacity>
              </MotiView>
            </View>
          </MotiView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  modalContent: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginLeft: 8,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    gap: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
  },
  customTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  customTimeInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  customTimeButton: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  customTimeButtonText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
})
