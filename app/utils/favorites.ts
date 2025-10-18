const STORAGE_KEY = 'get-menu:favorites'

function isClient () {
  return typeof window !== 'undefined'
}

function sanitizeFavorites (raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw.filter((value): value is string => typeof value === 'string')
}

export function loadFavorites (): string[] {
  if (!isClient()) return []

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const parsed = JSON.parse(stored)
    return sanitizeFavorites(parsed)
  } catch (error) {
    console.warn('[favorites] Failed to load favorites from storage', error)
    return []
  }
}

export function saveFavorites (ids: string[]): void {
  if (!isClient()) return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (error) {
    console.warn('[favorites] Failed to save favorites to storage', error)
  }
}
