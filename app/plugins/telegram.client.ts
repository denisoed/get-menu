import { defineNuxtPlugin } from '#app'
import { normaliseColor } from '~/utils/color'

export default defineNuxtPlugin(() => {
  if (!process.client) {
    return
  }

  const initialiseTelegram = () => {
    const webApp = window.Telegram?.WebApp

    if (!webApp) {
      return false
    }

    webApp.ready()
    webApp.expand?.()
    webApp.disableVerticalSwipes?.()

    const bodyStyles = document.body ? window.getComputedStyle(document.body) : null
    const bodyColor = bodyStyles ? normaliseColor(bodyStyles.backgroundColor) : undefined
    if (bodyColor) {
      try {
        webApp.setBackgroundColor?.(bodyColor)
        const topbar = document.getElementById('topbar')
        const headerStyles = topbar ? window.getComputedStyle(topbar) : null
        const headerColor = headerStyles ? normaliseColor(headerStyles.backgroundColor) : bodyColor
        if (headerColor) {
          webApp.setHeaderColor?.(headerColor)
        }
      } catch (error) {
        console.warn('[telegram]', 'Failed to apply colors', error)
      }
    }

    return true
  }

  if (!initialiseTelegram()) {
    let polling: ReturnType<typeof window.setInterval> | undefined

    const tryInitialise = () => {
      if (initialiseTelegram()) {
        window.removeEventListener('load', tryInitialise)
        if (polling !== undefined) {
          window.clearInterval(polling)
          polling = undefined
        }
      }
    }

    window.addEventListener('load', tryInitialise, { once: true })

    polling = window.setInterval(() => {
      if (initialiseTelegram()) {
        if (polling !== undefined) {
          window.clearInterval(polling)
          polling = undefined
        }
      }
    }, 250)
  }
})
