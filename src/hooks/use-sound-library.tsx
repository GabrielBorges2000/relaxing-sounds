"use client"

import { useState, useEffect } from "react"
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av"
import { soundsLibary } from "@/constants/sounds"

export interface Sound {
  id: string
  name: string
  source: any
  category: string
}

export function useSoundLibrary() {
  const [sounds, setSounds] = useState<Sound[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Configure audio session for background playback
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: false,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
        })
      } catch (error) {
        console.error("Error configuring audio:", error)
      }
    }

    // Load sounds
    const loadSounds = async () => {
      setIsLoading(true)

      try {
        await configureAudio()

        setSounds(soundsLibary)
      } catch (error) {
        console.error("Error loading sounds:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSounds()

    return () => {
      // Clean up if needed
    }
  }, [])

  return { sounds, isLoading }
}
