import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native"
import { useTheme } from "@/components/theme-provider"
import { ListIcon, UploadIcon, UserIcon } from "@/components/icons"
import { useAuth } from "@/components/auth-provider"
import { LogOutIcon } from "lucide-react-native"
import { useRouter } from "expo-router"

interface HeaderProps {
  handleUploadMix: () => void
  navigateToSavedMixes: () => void
}

export function Header({
  handleUploadMix,
  navigateToSavedMixes
}: HeaderProps) {
  const { theme } = useTheme()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair da sua conta?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await signOut()
          router.replace("/auth/login")
        },
      },
    ])
  }

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
          style={[styles.headerButton, { backgroundColor: theme.colors.error, borderColor: theme.colors.error }]}
          onPress={handleLogout}
        >
          <LogOutIcon color={theme.colors.buttonText} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default React.memo(Header)

const styles = StyleSheet.create({
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: 20,
    marginRight: 12,
  },
  userAvatarPlaceholder: {
    width: 40, height: 40, borderRadius: 20,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 12, fontFamily: "Inter_400Regular",
  },
  userName: {
    fontSize: 16, fontFamily: "Inter_500Medium",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    marginLeft: 12, borderWidth: 1,
  },
})