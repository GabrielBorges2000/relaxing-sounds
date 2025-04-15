import { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useAuth } from "@/components/auth-provider"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/button"
import { GoogleIcon } from "@/components/icons"
import { MotiView } from "moti"

export default function LoginScreen() {
  const { signInWithGoogle, isLoading } = useAuth()
  const { theme } = useTheme()
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
        <View style={styles.termsContainer}>
          <TouchableOpacity onPress={() => setAgreedToTerms(!agreedToTerms)} style={styles.checkboxContainer}>
            <View style={[styles.checkbox, { backgroundColor: agreedToTerms ? theme.colors.primary : theme.colors.card }]}>
              {agreedToTerms && <View style={styles.checkboxIndicator} />}
            </View>
            <Text style={[styles.termsText, { color: theme.colors.textMuted }]}>
              Eu concordo com os Termos de Serviço e Política de Privacidade
            </Text>
          </TouchableOpacity>
        </View>
          <Button
            onPress={handleGoogleLogin}
            style={[
              styles.googleButton,
              { 
                backgroundColor: agreedToTerms ? theme.colors.primary : theme.colors.card,
                opacity: agreedToTerms ? 1 : 0.5,
              },
            ]}
            textStyle={{ color: agreedToTerms ? theme.colors.card : theme.colors.text }}
            icon={<GoogleIcon />}
            loading={isLoading}
            disabled={!agreedToTerms || isLoading}
          >
            {isLoading ? "Carregando" : "Entrar com Google"}
          </Button>

        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}
      </MotiView>

          {/*
      // TODO: adicionar uma checkbox para confirmar que o usuário concorda com os termos e condições
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
            */}
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
    termsContainer: {
      marginBottom: 20,
    },
    checkboxContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: "#ccc",
      marginRight: 10,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxIndicator: {
      width: 12,
      height: 12,
      borderRadius: 2,
      backgroundColor: "#fff",
    },
    termsText: {
      fontSize: 14,
      fontFamily: " Inter_400Regular",
      flex: 1,
      color: "#ccc",
    },
});
