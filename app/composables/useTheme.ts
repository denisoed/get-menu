import { onMounted } from 'vue'
import { useState } from '#app'

const STORAGE_KEY = 'menu_dark'

export function useTheme () {
  const isDark = useState<boolean>('theme-dark', () => false)

  function syncSurfaceColor () {
    if (!process.client) return
    const footer = document.getElementById('footer')
    if (!footer) return

    const backgroundColor = window.getComputedStyle(footer).backgroundColor
    let metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null

    if (!metaTheme) {
      metaTheme = document.createElement('meta')
      metaTheme.name = 'theme-color'
      document.head.appendChild(metaTheme)
    }

    metaTheme.setAttribute('content', backgroundColor)

    document.documentElement.style.backgroundColor = backgroundColor
    document.body.style.backgroundColor = backgroundColor
  }

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

    syncSurfaceColor()
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
    syncSurfaceColor,
  }
}

export type UseThemeReturn = ReturnType<typeof useTheme>
