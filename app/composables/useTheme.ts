import { onMounted } from 'vue'
import { useState } from '#app'
import { normaliseColor } from '~/utils/color'

const STORAGE_KEY = 'menu_dark'

export function useTheme () {
  const isDark = useState<boolean>('theme-dark', () => false)

  function syncSurfaceColor () {
    if (!process.client) return
    const footer = document.getElementById('footer')
    const backgroundSource = footer ?? document.body ?? document.documentElement
    if (!backgroundSource) return

    const styles = window.getComputedStyle(backgroundSource)
    const backgroundColor = styles.backgroundColor
    let metaTheme = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null

    if (!metaTheme) {
      metaTheme = document.createElement('meta')
      metaTheme.name = 'theme-color'
      document.head.appendChild(metaTheme)
    }

    metaTheme.setAttribute('content', backgroundColor)

    document.documentElement.style.backgroundColor = backgroundColor
    document.body.style.backgroundColor = backgroundColor

    const telegramColor = normaliseColor(backgroundColor)
    const webApp = window.Telegram?.WebApp

    if (webApp && telegramColor) {
      try {
        webApp.setBackgroundColor?.(telegramColor)

        const topbar = document.getElementById('topbar')
        const headerBackground = topbar ? normaliseColor(window.getComputedStyle(topbar).backgroundColor) : telegramColor
        if (headerBackground) {
          webApp.setHeaderColor?.(headerBackground)
        }
      } catch (error) {
        console.warn('[telegram]', 'Unable to synchronise theme colors', error)
      }
    }
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
