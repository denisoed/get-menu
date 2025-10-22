import { z } from 'zod'

const HexColorSchema = z.string().regex(/^#?[0-9a-fA-F]{6}$/, 'Цвет должен быть в формате HEX (например, #ff6600).')

export const MenuThemePaletteSchema = z.object({
  primary: HexColorSchema,
  accent: HexColorSchema,
  background: HexColorSchema,
  surface: HexColorSchema,
  subtle: HexColorSchema,
  text: HexColorSchema,
  muted: HexColorSchema,
  border: HexColorSchema,
})

export const MenuThemeFontsSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
})

export const MenuThemeBackgroundSchema = z.object({
  type: z.enum(['color', 'image']),
  color: HexColorSchema,
  image: z.string().url().nullable(),
  overlayOpacity: z.number().min(0).max(1),
})

export const MenuThemeConfigSchema = z.object({
  presetId: z.string().min(1),
  palette: MenuThemePaletteSchema,
  fonts: MenuThemeFontsSchema,
  background: MenuThemeBackgroundSchema,
})

export type MenuThemeConfigInput = z.infer<typeof MenuThemeConfigSchema>
