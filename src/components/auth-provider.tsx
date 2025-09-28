"use client"

import React, { memo } from "react"
import { createContext, useContext, useState, useEffect } from "react"
import * as WebBrowser from "expo-web-browser"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { GoogleSignin, User, isSuccessResponse } from "@react-native-google-signin/google-signin"

// Registrar o redirecionamento para autenticação
WebBrowser.maybeCompleteAuthSession()

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signInWithGoogle: async () => { },
  signOut: async () => { },
})

// Auth provider props
interface AuthProviderProps {
  children: React.ReactNode
}

const USER_KEY = "auth_user"

GoogleSignin.configure({
  profileImageSize: 150,
  iosClientId: "270862681278-llaf9e7glifn876tu0fj2tk0rtgou372.apps.googleusercontent.com",
})

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load stored auth on startup
  useEffect(() => {
    loadStoredAuth()
  }, [])

  // Load stored authentication
  const loadStoredAuth = async () => {
    try {
      setIsLoading(true)
      const storedUser = await AsyncStorage.getItem(USER_KEY)

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading stored auth:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const response = await GoogleSignin.signIn()

      if (isSuccessResponse(response)) {
        setUser(response.data);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data))

      }

    } catch (error) {
      console.log("Error signing in with Google:", error)
      throw error
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      setIsLoading(true)
      await AsyncStorage.removeItem(USER_KEY)
      setUser(null)
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext)
}

export default memo(AuthProvider);
