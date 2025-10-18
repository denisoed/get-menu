import { computed, onMounted, readonly, ref } from 'vue'
import { loadFavorites, saveFavorites } from '~/utils/favorites'

const favoriteIds = ref<string[]>([])
let hasHydrated = false

function persistFavorites (ids: string[]) {
  favoriteIds.value = ids
  saveFavorites(ids)
}

function addFavorite (id: string) {
  if (favoriteIds.value.includes(id)) return

  persistFavorites([...favoriteIds.value, id])
}

function removeFavorite (id: string) {
  if (!favoriteIds.value.includes(id)) return

  persistFavorites(favoriteIds.value.filter(itemId => itemId !== id))
}

export function useFavorites () {
  onMounted(() => {
    if (hasHydrated) return
    favoriteIds.value = loadFavorites()
    hasHydrated = true
  })

  const favoritesSet = computed(() => new Set(favoriteIds.value))

  function isFavorite (id: string) {
    return favoritesSet.value.has(id)
  }

  function toggleFavorite (id: string) {
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  return {
    favoriteIds: readonly(favoriteIds),
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
  }
}
