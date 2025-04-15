import { useState } from "react"
import { View, Text, StyleSheet, Image } from "react-native"
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/button"
import { GoogleIcon } from "@/components/icons"
import { MotiView } from "moti"

export default function LoginScreen() {
  const { signInWithGoogle, isLoading } = useAuth()
  const { theme } = useTheme()
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      await signInWithGoogle()
    } catch (err) {
      setError("Falha ao entrar com Google. tente novamente.")
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 800 }}
        style={styles.logoContainer}
      >
        <Image source={require("@/assets/images/icon.png")} style={styles.logo} resizeMode="contain" />
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800, delay: 300 }}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Relaxing Sounds</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>Crie sua mistura perfeita de sons ambientes</Text>
      </MotiView>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800, delay: 600 }}
        style={styles.buttonContainer}
      >
        <Button
          onPress={handleGoogleLogin}
          style={[styles.googleButton, { backgroundColor: theme.colors.card }]}
          textStyle={{ color: theme.colors.text }}
          icon={<GoogleIcon />}
          loading={isLoading}
        >
          {isLoading ? "Carregando" : "Entrar com Google"}
        </Button>

        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 800, delay: 900 }}
        style={styles.footer}
      >
        <Text style={[styles.footerText, { color: theme.colors.textMuted }]}>
          Ao fazer login, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </Text>
      </MotiView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    fontFamily: " Inter_700Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
    textAlign: "center",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  googleButton: {
    height: 54,
    borderRadius: 27,
  },
  errorText: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: " Inter_400Regular",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: " Inter_400Regular",
  },
})
