export function normaliseColor (value: string | null | undefined) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim()
  if (trimmed.startsWith('#')) {
    return trimmed
  }

  const rgbMatch = trimmed.match(/^rgba?\(([^)]+)\)$/i)
  if (!rgbMatch) {
    return trimmed
  }

  const parts = rgbMatch[1].split(',').map(part => Number.parseFloat(part.trim()))
  if (parts.length < 3 || parts.slice(0, 3).some(part => Number.isNaN(part))) {
    return trimmed
  }

  const [r, g, b] = parts
  const toHex = (component: number) => Math.max(0, Math.min(255, Math.round(component))).toString(16).padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
