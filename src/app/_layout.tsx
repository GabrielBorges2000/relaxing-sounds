import { useEffect } from "react"
import { Slot, useRouter, useSegments } from "expo-router"
import { Inter_400Regular, Inter_300Light, Inter_500Medium, Inter_700Bold } from "@expo-google-fonts/inter"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { AudioPlayerProvider } from "@/hooks/use-audio-player"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { AdBanner } from "@/components/ad-banner"

SplashScreen.preventAutoHideAsync()

function LayoutWithProviders() {
  const { isLoading, user } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_300Light,
    Inter_500Medium,
    Inter_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      const inAuthGroup = segments[0] === "auth"

      if (user && inAuthGroup) {
        router.replace("/(home)")
      }
      if (!user && !inAuthGroup) {
        router.replace("/auth/login")
      }

      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, user, segments, isLoading, router])

  if (!fontsLoaded || isLoading) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AudioPlayerProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style="light" backgroundColor="#000000" />
            <Slot />
            {user && <AdBanner />}
          </SafeAreaView>
        </AudioPlayerProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <LayoutWithProviders />
    </AuthProvider>
  )
}

