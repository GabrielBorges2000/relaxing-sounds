import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, AppState, Image } from "react-native"
import { useRouter } from "expo-router"
import { Audio } from "expo-av"
import { Slider } from "@/components/slider"
import { useTheme } from "@/components/theme-provider"
import { ListIcon, UploadIcon, UserIcon } from "@/components/icons"

import { useAuth } from "@/components/auth-provider"

interface HeaderProps {
  handleUploadMix: () => void
  navigateToSavedMixes: () => void
}

export function Header({
  handleUploadMix,
  navigateToSavedMixes
}: HeaderProps) {
  const { theme } = useTheme()
  const { user } = useAuth()

  return (
    <View style={[styles.userHeader, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={styles.userInfo}>
        {user?.user.photo ? (
          <Image source={{ uri: user?.user.photo }} style={styles.userAvatar} />
        ) : (
          <View style={[styles.userAvatarPlaceholder, { backgroundColor: theme.colors.primary }]}>
            <UserIcon color={theme.colors.buttonText} size={20} />
          </View>
        )}
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.textMuted }]}>Olá,</Text>
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.user.name || "Usuário"}</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={navigateToSavedMixes}
        >
          <ListIcon color={theme.colors.text} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
          onPress={handleUploadMix}
        >
          <UploadIcon color={theme.colors.text} size={20} />
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
    flexDirection: "row",
    alignItems: "center",
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