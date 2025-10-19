import { defineNuxtPlugin } from '#app'
import { syncSurfaceColor } from '~/utils/syncSurfaceColor'

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) {
    return
  }

  const scheduleSync = () => {
    window.requestAnimationFrame(() => {
      syncSurfaceColor()
    })
  }

  const initialiseTelegram = () => {
    const webApp = window.Telegram?.WebApp

    if (!webApp) {
      return false
    }

    webApp.ready()
    webApp.expand?.()
    webApp.disableVerticalSwipes?.()

    scheduleSync()

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

  nuxtApp.hook('page:finish', scheduleSync)
  scheduleSync()
})
