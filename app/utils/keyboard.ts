export function handleDoneKey (event: KeyboardEvent) {
  if (event.key !== 'Enter') return

  event.preventDefault()

  const target = event.target as HTMLElement | null
  if (typeof target?.blur === 'function') {
    target.blur()
  }
}
