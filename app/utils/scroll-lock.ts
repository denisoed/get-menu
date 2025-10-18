let lockCount = 0
let previousOverflow: string | null = null
let previousPaddingRight: string | null = null

function isClient() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function getScrollbarWidth() {
  if (!isClient()) return 0
  return window.innerWidth - document.documentElement.clientWidth
}

export function lock() {
  if (!isClient()) return

  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow || null
    previousPaddingRight = document.body.style.paddingRight || null

    const scrollbarWidth = getScrollbarWidth()
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    document.body.style.overflow = 'hidden'
  }

  lockCount += 1
}

export function unlock() {
  if (!isClient()) return

  if (lockCount > 0) {
    lockCount -= 1
  }

  if (lockCount === 0) {
    if (previousOverflow !== null) {
      document.body.style.overflow = previousOverflow
    } else {
      document.body.style.removeProperty('overflow')
    }

    if (previousPaddingRight !== null) {
      document.body.style.paddingRight = previousPaddingRight
    } else {
      document.body.style.removeProperty('padding-right')
    }

    previousOverflow = null
    previousPaddingRight = null
  }
}
