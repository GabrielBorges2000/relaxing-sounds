

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"

// Define theme colors
interface ThemeColors {
  primary: string
  secondary: string
  background: string
  card: string
  text: string
  textMuted: string
  border: string
  buttonText: string
  error: string
  success: string
  warning: string
}

// Define theme interface
interface Theme {
  colors: ThemeColors
  isDark: boolean
}

// Define theme context type
interface ThemeContextType {
  theme: Theme
  isDark: boolean
  setTheme: (theme: "dark" | "light") => void
}

// Create light and dark themes
const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: "#6366f1",
    secondary: "#a855f7",
    background: "#f8fafc",
    card: "#ffffff",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
    buttonText: "#ffffff",
    error: "#ef4444",
    success: "#10b981",
    warning: "#f59e0b",
  },
}

const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: "#818cf8",
    secondary: "#c084fc",
    background: "#0f172a",
    card: "#1e293b",
    text: "#f8fafc",
    textMuted: "#94a3b8",
    border: "#334155",
    buttonText: "#ffffff",
    error: "#f87171",
    success: "#34d399",
    warning: "#fbbf24",
  },
}

// Create context
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  setTheme: () => { },
})

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme()
  const [theme, setThemeState] = useState<Theme>(colorScheme === "dark" ? darkTheme : lightTheme)

  // Update theme when system theme changes
  useEffect(() => {
    setThemeState(colorScheme === "dark" ? darkTheme : lightTheme)
  }, [colorScheme])

  // Set theme function
  const setTheme = (themeType: "dark" | "light") => {
    setThemeState(themeType === "dark" ? darkTheme : lightTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme.isDark,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to use theme context
export function useTheme() {
  return useContext(ThemeContext)
}
