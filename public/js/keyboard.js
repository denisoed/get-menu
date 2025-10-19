(function (global) {
  const DONE_KEY_SELECTOR = '[enterkeyhint]'
  const appliedElements = new WeakSet()

  function handleDoneKey (event) {
    if (event.key !== 'Enter') return

    event.preventDefault()

    const target = event.target
    if (target && typeof target.blur === 'function') {
      target.blur()
    }
  }

  function applyDoneKeyToElement (element) {
    if (!element || !(element instanceof HTMLElement)) return
    if (!element.hasAttribute('enterkeyhint')) return
    if (appliedElements.has(element)) return

    element.addEventListener('keydown', handleDoneKey)
    appliedElements.add(element)
  }

  function applyWithin (root) {
    if (!root) return

    if (root instanceof HTMLElement) {
      applyDoneKeyToElement(root)
    }

    if (typeof root.querySelectorAll === 'function') {
      root.querySelectorAll(DONE_KEY_SELECTOR).forEach(applyDoneKeyToElement)
    }
  }

  function attachDoneKey (target) {
    if (Array.isArray(target)) {
      target
        .map((selector) => (typeof selector === 'string' ? document.querySelector(selector) : selector))
        .forEach(applyDoneKeyToElement)
      return function detach () {}
    }

    const root = typeof target === 'string' ? document.querySelector(target) : target || document.body
    if (!root) return function detach () {}

    applyWithin(root)

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement || node instanceof DocumentFragment) {
              applyWithin(node)
            }
          })
        }

        if (mutation.type === 'attributes') {
          applyDoneKeyToElement(mutation.target)
        }
      })
    })

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['enterkeyhint'],
    })

    return function detach () {
      observer.disconnect()
    }
  }

  global.keyboardUtils = {
    handleDoneKey,
    attachDoneKey,
  }
})(window)
