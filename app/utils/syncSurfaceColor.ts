import { normaliseColor } from '~/utils/color'

export function syncSurfaceColor () {
  if (!process.client) {
    return
  }

  const footer = document.getElementById('footer')
  const backgroundSource = footer ?? document.body ?? document.documentElement

  if (!backgroundSource) {
    return
  }

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
      const headerBackground = topbar
        ? normaliseColor(window.getComputedStyle(topbar).backgroundColor)
        : telegramColor

      if (headerBackground) {
        webApp.setHeaderColor?.(headerBackground)
      }
    } catch (error) {
      console.warn('[telegram]', 'Unable to synchronise theme colors', error)
    }
  }
}
