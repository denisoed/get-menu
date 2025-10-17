import { computed } from 'vue'

interface OpenLinkOptions {
  try_instant_view?: boolean
}

export function useTelegram () {
  const isTelegram = computed(() => {
    if (!process.client) {
      return false
    }

    return Boolean(window.Telegram?.WebApp)
  })

  const openLink = (url: string, options?: OpenLinkOptions) => {
    if (!process.client) {
      return false
    }

    const webApp = window.Telegram?.WebApp

    if (!webApp) {
      return false
    }

    try {
      if (webApp.openLink) {
        webApp.openLink(url, options)
        return true
      }

      if (webApp.openTelegramLink) {
        webApp.openTelegramLink(url)
        return true
      }
    } catch (error) {
      console.warn('[telegram]', 'Failed to open link', error)
    }

    return false
  }

  return {
    isTelegram,
    openLink
  }
}
