import { initDoneKeyListeners } from '~/utils/keyboard'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  const stop = initDoneKeyListeners(document.body)

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      stop()
    })
  }
})
