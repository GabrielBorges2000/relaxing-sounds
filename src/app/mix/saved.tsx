"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Share } from "react-native"
import { useRouter } from "expo-router"
import { useTheme } from "@/components/theme-provider"
import { useMixStorage } from "@/hooks/use-mix-storage"
import type { SoundMix } from "@/types"
import { PlayIcon, DeleteIcon, CloudIcon, CloudOffIcon, ShareIcon } from "@/components/icons"
import { MotiView } from "moti"
import { formatDate } from "@/utils/date"
import { useSyncMixes } from "@/hooks/use-sync-mixes"

export default function SavedMixesScreen() {
  const { theme } = useTheme()
  const router = useRouter()
  const { getMixes, deleteMix } = useMixStorage()
  const { syncedMixes, syncMix, deleteSyncedMix, isSyncing } = useSyncMixes()
  const [localMixes, setLocalMixes] = useState<SoundMix[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadMixes()
  }, [])

  const loadMixes = async () => {
    setIsLoading(true)
    try {
      const mixes = await getMixes()
      setLocalMixes(mixes)
    } catch (error) {
      console.error("Error loading mixes:", error)
      Alert.alert("Erro", "Falha ao carregar seus mixers salvos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMixes()
    setRefreshing(false)
  }

  const handlePlayMix = (mix: SoundMix) => {
    router.push({
      pathname: "/mix/player",
      params: { mix: JSON.stringify(mix) },
    })
  }

  const handleDeleteMix = async (mix: SoundMix) => {
    Alert.alert("Excluir Mix", `Tem certeza que deseja excluir "${mix.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMix(mix.id)
            setLocalMixes(localMixes.filter((m) => m.id !== mix.id))
          } catch (error) {
            console.error("Error deleting mix:", error)
            Alert.alert("Erro", "Falha ao excluir mix")
          }
        },
      },
    ])
  }

  const handleSyncMix = async (mix: SoundMix) => {
    try {
      await syncMix(mix)
      Alert.alert("Sucesso", "Mix sincronizado com a nuvem")
    } catch (error) {
      console.error("Error syncing mix:", error)
      Alert.alert("Erro", "Falha ao sincronizar mix com a nuvem")
    }
  }

  const handleDeleteSyncedMix = async (mixId: string) => {
    try {
      await deleteSyncedMix(mixId)
      Alert.alert("Sucesso", "Mix removido da nuvem")
    } catch (error) {
      console.error("Error deleting synced mix:", error)
      Alert.alert("Erro", "Falha ao remover mix da nuvem")
    }
  }

  const handleShareMix = async (mix: SoundMix) => {
    try {
      const message = `Confira meu mix de sons relaxantes "${mix.name}" criado no app Relaxing Sounds!`
      await Share.share({
        message,
        title: "Compartilhar Mix",
      })
    } catch (error) {
      console.error("Error sharing mix:", error)
      Alert.alert("Erro", "Falha ao compartilhar mix")
    }
  }

  const isMixSynced = (mixId: string) => {
    return syncedMixes.some((m) => m.id === mixId)
  }

  const renderMixItem = ({ item }: { item: SoundMix }) => {
    const synced = isMixSynced(item.id)

    return (
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: "timing", duration: 500 }}
        style={[styles.mixCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      >
        <View style={styles.mixInfo}>
          <Text style={[styles.mixName, { color: theme.colors.text }]}>{item.name}</Text>
          <Text style={[styles.mixDate, { color: theme.colors.textMuted }]}>{formatDate(item.createdAt)}</Text>
          <Text style={[styles.mixDetails, { color: theme.colors.textMuted }]}>
            {item.sounds.length} som{item.sounds.length !== 1 ? "s" : ""}
          </Text>
        </View>

        <View style={styles.mixActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.card }]}
            onPress={() => handleShareMix(item)}
          >
            <ShareIcon color={theme.colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: synced ? theme.colors.success : theme.colors.card }]}
            onPress={() => (synced ? handleDeleteSyncedMix(item.id) : handleSyncMix(item))}
          >
            {synced ? <CloudIcon color={theme.colors.buttonText} /> : <CloudOffIcon color={theme.colors.text} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleDeleteMix(item)}
          >
            <DeleteIcon color={theme.colors.buttonText} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handlePlayMix(item)}
          >
            <PlayIcon color={theme.colors.buttonText} />
          </TouchableOpacity>
        </View>
      </MotiView>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Seus Mixers Salvos</Text>
        {isSyncing && <Text style={[styles.syncingText, { color: theme.colors.primary }]}>Sincronizando...</Text>}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.textMuted }]}>Carregando seus mixers...</Text>
        </View>
      ) : localMixes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Você ainda não salvou nenhum mixer.</Text>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push("/")}
          >
            <Text style={[styles.createButtonText, { color: theme.colors.buttonText }]}>Criar um Mixer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={localMixes}
          renderItem={renderMixItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListFooterComponent={<View style={{ height: 70 }} />}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
    zIndex: 2,
  },
  title: {
    fontSize: 24,
    fontFamily: " Inter_700Bold",
  },
  syncingText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Espaço para o banner de anúncios
  },
  mixCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  mixInfo: {
    flex: 1,
  },
  mixName: {
    fontSize: 18,
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  mixDate: {
    fontSize: 12,
    fontFamily: " Inter_400Regular",
    marginBottom: 4,
  },
  mixDetails: {
    fontSize: 14,
    fontFamily: " Inter_400Regular",
  },
  mixActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: " Inter_400Regular",
    textAlign: "center",
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
})
