
import { useCallback, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { SoundMix } from "@/types"

const MIXES_STORAGE_KEY = "relaxing_sounds_mixes"

export function useMixStorage() {
  const [isLoading, setIsLoading] = useState(false)

  const loadMixes = useCallback(async (): Promise<SoundMix[]> => {
    try {
      const mixesJson = await AsyncStorage.getItem(MIXES_STORAGE_KEY)
      if (mixesJson) {
        return JSON.parse(mixesJson)
      }
      return []
    } catch (error) {
      console.error("Error getting mixes from storage:", error)
      throw error
    }
  }, [])

  const saveMix = useCallback(async (mix: SoundMix): Promise<void> => {
    try {
      setIsLoading(true)

      // To prevent race conditions, ensure all reads and writes
      // happen in a single operation.
      // Get existing mixes within the same try block
      const mixes = await getMixes()

      // Check if mix with same ID already exists
      const existingMixIndex = mixes.findIndex((m) => m.id === mix.id)

      if (existingMixIndex !== -1) {
        // Update existing mix
        mixes[existingMixIndex] = mix
      } else {
        // Add new mix
        mixes.push(mix)
      }

      // Save to storage
      await AsyncStorage.setItem(MIXES_STORAGE_KEY, JSON.stringify(mixes))
    } catch (error) {
      console.error("Error saving mix to storage:", error)
      throw error
    } finally { setIsLoading(false) }
  }, [])

  const createMix = useCallback(async (mix: SoundMix): Promise<void> => {
    try {
      setIsLoading(true)
      const mixes = await loadMixes()
      // Add new mix
      mixes.push(mix)
      // Save to storage
      await AsyncStorage.setItem(MIXES_STORAGE_KEY, JSON.stringify(mixes))
    } catch (error) {
      console.error("Error saving mix to storage:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [loadMixes])


  const deleteMix = useCallback(async (mixId: string): Promise<void> => {
    try {
      setIsLoading(true)

      // Get existing mixes
      const mixes = await getMixes()

      // Filter out the mix to delete
      const updatedMixes = mixes.filter((mix) => mix.id !== mixId)

      // Save to storage
      await AsyncStorage.setItem(MIXES_STORAGE_KEY, JSON.stringify(updatedMixes))
    } catch (error) {
      console.error("Error deleting mix from storage:", error)
      throw error
    } finally { setIsLoading(false) }
  }, [])

  // Use getMixes internally to ensure consistency, but don't expose it directly
  const getMixes = loadMixes;

  return {
    loadMixes,
    saveMix,
    deleteMix,
    isLoading,
    createMix,
    getMixes
  }
}
