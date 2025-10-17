import { onBeforeUnmount, watch, type MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'

let lockCount = 0
let previousOverflow: string | null = null

function lockBody () {
  if (!import.meta.client) return

  if (lockCount === 0) {
    previousOverflow = document.body?.style?.overflow ?? null
    if (document.body) {
      document.body.style.overflow = 'hidden'
    }
  }

  lockCount += 1
}

function unlockBody () {
  if (!import.meta.client) return
  if (lockCount === 0) return

  lockCount -= 1

  if (lockCount === 0 && document.body && previousOverflow !== null) {
    document.body.style.overflow = previousOverflow
    previousOverflow = null
  }
}

export function useBodyScrollLock (source: MaybeRefOrGetter<boolean>) {
  if (!import.meta.client) return

  let lastValue = false

  const stop = watch(
    () => Boolean(toValue(source)),
    (shouldLock) => {
      if (shouldLock === lastValue) return

      lastValue = shouldLock

      if (shouldLock) {
        lockBody()
      } else {
        unlockBody()
      }
    },
    { immediate: true },
  )

  onBeforeUnmount(() => {
    stop()

    if (lastValue) {
      unlockBody()
    }
  })
}

export function forceUnlockBodyScroll () {
  while (lockCount > 0) {
    unlockBody()
  }
}
