(function (global) {
  function handleDoneKey (event) {
    if (event.key !== 'Enter') return

    event.preventDefault()

    const target = event.target
    if (target && typeof target.blur === 'function') {
      target.blur()
    }
  }

  function attachDoneKey (selectors) {
    if (!Array.isArray(selectors)) return

    selectors
      .map((selector) => (typeof selector === 'string' ? document.querySelector(selector) : selector))
      .filter((element) => element && typeof element.addEventListener === 'function')
      .forEach((element) => {
        element.addEventListener('keydown', handleDoneKey)
      })
  }

  global.keyboardUtils = {
    handleDoneKey,
    attachDoneKey,
  }
})(window)
