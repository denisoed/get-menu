import { onMounted } from 'vue'
import { useState } from '#app'

const STORAGE_KEY = 'menu_dark'

export function useTheme () {
  const isDark = useState<boolean>('theme-dark', () => false)

  function applyTheme (value = isDark.value) {
    if (!process.client) return
    const classList = document.documentElement.classList
    const bodyClassList = document.body.classList

    if (value) {
      classList.add('dark')
      bodyClassList.add('bg-slate-900', 'text-slate-100')
      localStorage.setItem(STORAGE_KEY, '1')
    } else {
      classList.remove('dark')
      bodyClassList.remove('bg-slate-900', 'text-slate-100')
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  function toggleTheme () {
    isDark.value = !isDark.value
    applyTheme()
  }

  onMounted(() => {
    if (!process.client) return
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      isDark.value = true
    }
    applyTheme()
  })

  return {
    isDark,
    toggleTheme,
    applyTheme,
  }
}

export type UseThemeReturn = ReturnType<typeof useTheme>
