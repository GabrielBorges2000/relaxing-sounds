import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "./text-input";
import { TimerIcon } from "./icons";
import { useTheme } from "./theme-provider";
import type { Dispatch, SetStateAction } from "react";

export interface HeaderControlProps {
  mixName: string,
  timerActive: boolean,
  timerMinutes: number,
  setMixName: Dispatch<SetStateAction<string>>
  setTimerModalVisible: (value: boolean) => void,
}

export function HeaderControl({
  mixName,
  setMixName,
  timerActive,
  setTimerModalVisible,
  timerMinutes
}: HeaderControlProps) {
  const { theme } = useTheme()

  return (
    <View style={styles.header}>
      <TextInput
        value={mixName}
        onChangeText={setMixName}
        style={[styles.mixNameInput, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Nome do mix"
        placeholderTextColor={theme.colors.textMuted}
        maxLength={30}
      />

      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[styles.timerButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setTimerModalVisible(true)}
        >
          <TimerIcon color={theme.colors.buttonText} />
          {timerActive && (
            <View style={styles.timerIndicator}>
              <Text style={styles.timerText}>{timerMinutes}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(HeaderControl);

const styles = StyleSheet.create({
  header: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  mixNameInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  headerButtons: {
    flexDirection: "row",
    marginLeft: 10,
  },
  timerButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
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
})
