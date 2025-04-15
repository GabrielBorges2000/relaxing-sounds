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
          style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    borderWidth: 1,
  },
  header: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    zIndex: 2,
  },
  mixNameInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  headerButtons: {
    flexDirection: "row",
    marginLeft: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
  scrollView: {
    flex: 1,
  },
  soundsList: {
    padding: 16,
    paddingBottom: 80, // Espaço para o banner de anúncios
  },
  soundCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  soundHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  soundName: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
  soundIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 60, // Aumentado para dar espaço ao banner
    zIndex: 2,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    height: 50,
    borderRadius: 25,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 100,
    fontFamily: " Inter_400Regular",
  },
})
