import type { MenuThemeConfig, ResolvedMenuTheme } from '~/types/theme'

const HEX_COLOR_REGEX = /^#?([0-9a-fA-F]{6})$/

export interface ThemeValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

function normaliseHex (hex: string) {
  const match = HEX_COLOR_REGEX.exec(hex.trim())
  if (!match) return null
  return `#${match[1].toLowerCase()}`
}

export function isValidHexColor (hex: string) {
  return normaliseHex(hex) !== null
}

export function hexToRgb (hex: string) {
  const normalised = normaliseHex(hex)
  if (!normalised) {
    throw new Error(`Invalid HEX color received: ${hex}`)
  }

  const value = normalised.slice(1)
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  return { r, g, b }
}

export function hexToRgba (hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function luminance (hex: string) {
  const { r, g, b } = hexToRgb(hex)
  const transform = (channel: number) => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }

  const rLinear = transform(r)
  const gLinear = transform(g)
  const bLinear = transform(b)

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

export function contrastRatio (foreground: string, background: string) {
  const l1 = luminance(foreground)
  const l2 = luminance(background)
  const brightest = Math.max(l1, l2)
  const darkest = Math.min(l1, l2)
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2))
}

function pickContrastingColor (background: string) {
  const contrastWithWhite = contrastRatio('#ffffff', background)
  const contrastWithBlack = contrastRatio('#000000', background)
  return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#000000'
}

export function resolveMenuTheme (config: MenuThemeConfig): ResolvedMenuTheme {
  const palette = {
    ...config.palette,
    primary: normaliseHex(config.palette.primary) ?? '#f97316',
    accent: normaliseHex(config.palette.accent) ?? '#fb923c',
    background: normaliseHex(config.palette.background) ?? '#f8fafc',
    surface: normaliseHex(config.palette.surface) ?? '#ffffff',
    subtle: normaliseHex(config.palette.subtle) ?? '#fff7ed',
    text: normaliseHex(config.palette.text) ?? '#0f172a',
    muted: normaliseHex(config.palette.muted) ?? '#475569',
    border: normaliseHex(config.palette.border) ?? '#e2e8f0',
  }

  const fonts = {
    heading: config.fonts.heading,
    body: config.fonts.body,
  }

  const background = {
    type: config.background.type,
    color: normaliseHex(config.background.color) ?? palette.background,
    image: config.background.image,
    overlayOpacity: typeof config.background.overlayOpacity === 'number'
      ? Math.min(Math.max(config.background.overlayOpacity, 0), 1)
      : 0.35,
  }

  return {
    palette: {
      ...palette,
      primaryContent: pickContrastingColor(palette.primary),
    },
    fonts,
    background,
  }
}

export function buildThemeCssVariables (theme: ResolvedMenuTheme) {
  return {
    '--menu-theme-color-primary': theme.palette.primary,
    '--menu-theme-color-primary-content': theme.palette.primaryContent,
    '--menu-theme-color-accent': theme.palette.accent,
    '--menu-theme-color-background': theme.palette.background,
    '--menu-theme-color-surface': theme.palette.surface,
    '--menu-theme-color-subtle': theme.palette.subtle,
    '--menu-theme-color-text': theme.palette.text,
    '--menu-theme-color-muted': theme.palette.muted,
    '--menu-theme-color-border': theme.palette.border,
    '--menu-theme-font-heading': theme.fonts.heading,
    '--menu-theme-font-body': theme.fonts.body,
    '--menu-theme-background-color': theme.background.color,
    '--menu-theme-background-image': theme.background.image ? `url(${theme.background.image})` : 'none',
    '--menu-theme-background-overlay': `${theme.background.overlayOpacity}`,
  } as Record<string, string>
}

export function validateMenuTheme (config: MenuThemeConfig): ThemeValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  const paletteEntries = Object.entries(config.palette)
  paletteEntries.forEach(([key, value]) => {
    if (!isValidHexColor(value)) {
      errors.push(`Цвет «${key}» должен быть в формате HEX.`)
    }
  })

  if (!isValidHexColor(config.background.color)) {
    errors.push('Цвет фона должен быть в формате HEX.')
  }

  const resolved = resolveMenuTheme(config)

  const surfaceContrast = contrastRatio(resolved.palette.text, resolved.palette.surface)
  if (surfaceContrast < 4.5) {
    errors.push('Контраст текста и карточек ниже 4.5:1. Выберите более контрастные цвета.')
  } else if (surfaceContrast < 7) {
    warnings.push('Контраст текста и карточек ниже рекомендуемого уровня AAA (7:1).')
  }

  const backgroundContrast = contrastRatio(resolved.palette.text, resolved.palette.background)
  if (backgroundContrast < 4.5) {
    errors.push('Контраст текста и фона ниже 4.5:1. Измените фон или основной текстовый цвет.')
  }

  const primaryContrast = contrastRatio(resolved.palette.primaryContent, resolved.palette.primary)
  if (primaryContrast < 4.5) {
    errors.push('Основная кнопка недостаточно контрастна. Измените основной цвет или используйте более тёмный/светлый оттенок.')
  }

  if (resolved.background.overlayOpacity < 0.2) {
    warnings.push('Прозрачность оверлея баннера ниже 0.2 — текст может быть плохо читаем.')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}
