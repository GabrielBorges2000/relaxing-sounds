

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import type { SoundMix } from "@/types"
import axios from "axios"

// This would be your API base URL in a real app
const API_BASE_URL = "https://api.example.com"

export function useSyncMixes() {
  const { token, isAuthenticated } = useAuth()
  const [syncedMixes, setSyncedMixes] = useState<SoundMix[]>([])
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  // Fetch synced mixes when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchSyncedMixes()
    } else {
      setSyncedMixes([])
    }
  }, [isAuthenticated, token])

  // Fetch synced mixes from API
  const fetchSyncedMixes = async () => {
    if (!isAuthenticated) return

    setIsSyncing(true)
    setError(null)

    try {
      // In a real app, this would be an actual API call
      // For this demo, we'll simulate a response
      // const response = await api.get('/sync/mixes');
      // setSyncedMixes(response.data);

      // Simulated response
      setTimeout(() => {
        setSyncedMixes([
          {
            id: "cloud-1",
            name: "Rainy Day",
            sounds: [
              { id: "rain", volume: 0.8 },
              { id: "thunder", volume: 0.4 },
            ],
            createdAt: new Date().toISOString(),
          },
          {
            id: "cloud-2",
            name: "Forest Night",
            sounds: [
              { id: "forest", volume: 0.7 },
              { id: "wind", volume: 0.3 },
              { id: "birds", volume: 0.2 },
            ],
            createdAt: new Date().toISOString(),
          },
        ])
        setIsSyncing(false)
      }, 1000)
    } catch (err) {
      console.error("Error fetching synced mixes:", err)
      setError("Failed to fetch synced mixes")
      setIsSyncing(false)
    }
  }

  // Sync a mix to the cloud
  const syncMix = async (mix: SoundMix) => {
    if (!isAuthenticated) return

    setIsSyncing(true)
    setError(null)

    try {
      // In a real app, this would be an actual API call
      // await api.post('/sync/mixes', mix);

      // Simulated response
      setTimeout(() => {
        setSyncedMixes((prev) => [...prev, mix])
        setIsSyncing(false)
      }, 1000)
    } catch (err) {
      console.error("Error syncing mix:", err)
      setError("Failed to sync mix")
      setIsSyncing(false)
      throw err
    }
  }

  // Delete a synced mix
  const deleteSyncedMix = async (mixId: string) => {
    if (!isAuthenticated) return

    setIsSyncing(true)
    setError(null)

    try {
      // In a real app, this would be an actual API call
      // await api.delete(`/sync/mixes/${mixId}`);

      // Simulated response
      setTimeout(() => {
        setSyncedMixes((prev) => prev.filter((mix) => mix.id !== mixId))
        setIsSyncing(false)
      }, 1000)
    } catch (err) {
      console.error("Error deleting synced mix:", err)
      setError("Failed to delete synced mix")
      setIsSyncing(false)
      throw err
    }
  }

  return {
    syncedMixes,
    isSyncing,
    error,
    fetchSyncedMixes,
    syncMix,
    deleteSyncedMix,
  }
}
