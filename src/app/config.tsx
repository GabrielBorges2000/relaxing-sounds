

import { useState } from "react"
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/button"
import { MoonIcon, SunIcon, LogOutIcon, UserIcon, InfoIcon, BellIcon, StarIcon } from "@/components/icons"
import { MotiView } from "moti"

export default function ConfigScreen() {
  const { theme, setTheme, isDark } = useTheme()
  const { user, signOut } = useAuth()
  const router = useRouter()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [autoThemeEnabled, setAutoThemeEnabled] = useState(true)

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut()
            router.replace("/auth/login")
          } catch (error) {
            console.error("Error signing out:", error)
            Alert.alert("Error", "Failed to sign out")
          }
        },
      },
    ])
  }

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  const handleToggleAutoTheme = () => {
    setAutoThemeEnabled(!autoThemeEnabled)
    // In a real app, this would save the preference and update the theme provider
  }

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled)
    // In a real app, this would register/unregister for push notifications
  }

  const handleUpgradeToPremium = () => {
    Alert.alert("Upgrade to Premium", "Remove ads, unlock all sounds, and enable cloud sync for $4.99/month.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Upgrade",
        onPress: () => {
          // In a real app, this would initiate the in-app purchase flow
          Alert.alert("Success", "Thank you for upgrading to Premium!")
          // removeBannerAds()
        },
      },
    ])
  }

  const handleAbout = () => {
    Alert.alert(
      "About Relaxing Sounds",
      "Version 1.0.0\n\nCreated with ❤️ using Expo and React Native.\n\n© 2023 Relaxing Sounds App",
      [{ text: "OK" }],
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>

      {user && (
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          style={[styles.userCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
        >
          <View style={styles.userIcon}>
            <UserIcon size={24} color={theme.colors.primary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>{user.displayName || "User"}</Text>
            <Text style={[styles.userEmail, { color: theme.colors.textMuted }]}>{user.email || "No email"}</Text>
          </View>
        </MotiView>
      )}

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Appearance</Text>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 100 }}
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
        >
          <View style={styles.settingInfo}>
            <SunIcon color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 150 }}
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
        >
          <View style={styles.settingInfo}>
            <MoonIcon color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Use System Theme</Text>
          </View>
          <Switch
            value={autoThemeEnabled}
            onValueChange={handleToggleAutoTheme}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />
        </MotiView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Notifications</Text>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 200 }}
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
        >
          <View style={styles.settingInfo}>
            <BellIcon color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>Enable Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: "#767577", true: theme.colors.primary }}
            thumbColor="#f4f3f4"
          />
        </MotiView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Premium</Text>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 250 }}
        >
          <TouchableOpacity
            style={[styles.premiumButton, { backgroundColor: theme.colors.card }]}
            onPress={handleUpgradeToPremium}
          >
            <StarIcon color={theme.colors.warning} />
            <Text style={[styles.premiumText, { color: theme.colors.text }]}>Upgrade to Premium</Text>
          </TouchableOpacity>
          <Text style={[styles.premiumDescription, { color: theme.colors.textMuted }]}>
            Remove ads, unlock all sounds, and enable cloud sync
          </Text>
        </MotiView>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>About</Text>

        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500, delay: 300 }}
          style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
        >
          <TouchableOpacity style={styles.settingInfo} onPress={handleAbout}>
            <InfoIcon color={theme.colors.text} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>About Relaxing Sounds</Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500, delay: 350 }}
        style={styles.logoutContainer}
      >
        <Button
          onPress={handleSignOut}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          icon={<LogOutIcon color={theme.colors.buttonText} />}
        >
          Sign Out
        </Button>
      </MotiView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: " Inter_700Bold",
    marginBottom: 20,
    marginTop: 10,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  userIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: " Inter_400Regular",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
    marginLeft: 12,
  },
  premiumButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  premiumText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
    marginLeft: 12,
  },
  premiumDescription: {
    fontSize: 14,
    fontFamily: " Inter_400Regular",
    marginLeft: 4,
  },
  logoutContainer: {
    marginTop: 20,
  },
  logoutButton: {
    height: 50,
    borderRadius: 25,
  },
})
