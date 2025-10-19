const DONE_KEY_SELECTOR = '[enterkeyhint]'

const appliedElements = new WeakSet<HTMLElement>()

function isHTMLElement (node: EventTarget | null): node is HTMLElement {
  return node instanceof HTMLElement
}

function isSelectableNode (node: Node): node is HTMLElement | DocumentFragment {
  return node instanceof HTMLElement || node instanceof DocumentFragment
}

function applyDoneKeyToElement (element: Element | null) {
  if (!element || !(element instanceof HTMLElement)) return
  if (!element.hasAttribute('enterkeyhint')) return
  if (appliedElements.has(element)) return

  element.addEventListener('keydown', handleDoneKey)
  appliedElements.add(element)
}

function applyWithin (root: ParentNode) {
  if (root instanceof HTMLElement) {
    applyDoneKeyToElement(root)
  }

  if ('querySelectorAll' in root) {
    const elements = root.querySelectorAll<HTMLElement>(DONE_KEY_SELECTOR)
    elements.forEach(applyDoneKeyToElement)
  }
}

export function handleDoneKey (event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  event.preventDefault()

  const target = event.target as EventTarget | null
  if (isHTMLElement(target) && typeof target.blur === 'function') {
    target.blur()
  }
}

export function initDoneKeyListeners (root: ParentNode = document.body) {
  if (!root) return () => {}

  applyWithin(root)

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (!isSelectableNode(node)) return
          applyWithin(node)
        })
      }

      if (mutation.type === 'attributes') {
        applyDoneKeyToElement(mutation.target as Element)
      }
    }
  })

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['enterkeyhint'],
  })

  return () => observer.disconnect()
}
