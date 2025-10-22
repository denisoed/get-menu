import { describe, it, expect } from 'vitest'
import { contrastRatio, validateMenuTheme, buildThemeCssVariables, resolveMenuTheme } from '~/utils/theme'
import { DEFAULT_MENU_THEME } from '~/config/menuThemes'
import type { MenuThemeConfig } from '~/types/theme'

describe('theme utils', () => {
  it('calculates contrast ratio between colors', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBe(21)
    expect(contrastRatio('#ff0000', '#00ff00')).toBeCloseTo(2.91, 2)
  })

  it('builds CSS variables from resolved theme', () => {
    const resolved = resolveMenuTheme(DEFAULT_MENU_THEME)
    const vars = buildThemeCssVariables(resolved)

    expect(vars['--menu-theme-color-primary']).toBe(resolved.palette.primary)
    expect(vars['--menu-theme-font-heading']).toBe(resolved.fonts.heading)
    expect(vars['--menu-theme-background-overlay']).toBe(String(resolved.background.overlayOpacity))
  })

  it('returns validation errors for invalid palette and contrast', () => {
    const invalid: MenuThemeConfig = {
      ...DEFAULT_MENU_THEME,
      palette: {
        ...DEFAULT_MENU_THEME.palette,
        primary: 'zzzzzz',
        surface: '#ffffff',
        text: '#ffffff',
      },
    }

    const result = validateMenuTheme(invalid)

    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Цвет «primary» должен быть в формате HEX.')
    expect(result.errors).toContain('Контраст текста и карточек ниже 4.5:1. Выберите более контрастные цвета.')
  })

  it('reports warnings when overlay is too transparent', () => {
    const warnTheme: MenuThemeConfig = {
      ...DEFAULT_MENU_THEME,
      background: {
        ...DEFAULT_MENU_THEME.background,
        overlayOpacity: 0.1,
      },
    }

    const result = validateMenuTheme(warnTheme)

    expect(result.isValid).toBe(true)
    expect(result.warnings).toContain('Прозрачность оверлея баннера ниже 0.2 — текст может быть плохо читаем.')
  })
})
