export interface MenuThemePalette {
  primary: string
  accent: string
  background: string
  surface: string
  subtle: string
  text: string
  muted: string
  border: string
}

export interface MenuThemeFonts {
  heading: string
  body: string
}

export interface MenuThemeBackground {
  type: 'color' | 'image'
  color: string
  image: string | null
  overlayOpacity: number
}

export interface MenuThemeConfig {
  presetId: string
  palette: MenuThemePalette
  fonts: MenuThemeFonts
  background: MenuThemeBackground
}

export interface ResolvedMenuTheme {
  palette: MenuThemePalette & {
    primaryContent: string
  }
  fonts: MenuThemeFonts
  background: MenuThemeBackground
}
