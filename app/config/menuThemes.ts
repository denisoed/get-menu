import type { MenuThemeConfig } from '~/types/theme'

export const MENU_THEME_FONTS = {
  inter: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  'playfair-display': "'Playfair Display', 'Times New Roman', serif",
  montserrat: "'Montserrat', 'Segoe UI', sans-serif",
  'pt-serif': "'PT Serif', Georgia, serif",
}

export type MenuThemeFontKey = keyof typeof MENU_THEME_FONTS

export interface MenuThemePreset {
  id: string
  name: string
  description: string
  config: MenuThemeConfig
}

const defaultPalette = {
  primary: '#f97316',
  accent: '#fb923c',
  background: '#f8fafc',
  surface: '#ffffff',
  subtle: '#fff7ed',
  text: '#0f172a',
  muted: '#475569',
  border: '#e2e8f0',
}

const defaultFonts = {
  heading: MENU_THEME_FONTS.inter,
  body: MENU_THEME_FONTS.inter,
}

export const DEFAULT_MENU_THEME: MenuThemeConfig = {
  presetId: 'sunrise-cafe',
  palette: defaultPalette,
  fonts: defaultFonts,
  background: {
    type: 'color',
    color: defaultPalette.background,
    image: null,
    overlayOpacity: 0.35,
  }
}

export const MENU_THEME_PRESETS: MenuThemePreset[] = [
  {
    id: 'sunrise-cafe',
    name: 'Рассветное кафе',
    description: 'Яркий брендовый акцент с тёплым фоном и чистыми карточками.',
    config: {
      presetId: DEFAULT_MENU_THEME.presetId,
      palette: { ...defaultPalette },
      fonts: { ...defaultFonts },
      background: { ...DEFAULT_MENU_THEME.background },
    },
  },
  {
    id: 'night-market',
    name: 'Ночной маркет',
    description: 'Контрастные карточки на тёмном фоне с неоновыми акцентами.',
    config: {
      presetId: 'night-market',
      palette: {
        primary: '#38bdf8',
        accent: '#22d3ee',
        background: '#020617',
        surface: '#0f172a',
        subtle: '#0f172a',
        text: '#e2e8f0',
        muted: '#94a3b8',
        border: '#1e293b',
      },
      fonts: {
        heading: MENU_THEME_FONTS['playfair-display'],
        body: MENU_THEME_FONTS.inter,
      },
      background: {
        type: 'image',
        color: '#020617',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop',
        overlayOpacity: 0.65,
      }
    }
  },
  {
    id: 'garden-party',
    name: 'Садовая вечеринка',
    description: 'Натуральные оттенки и мягкие шрифты для бранча или кейтеринга.',
    config: {
      presetId: 'garden-party',
      palette: {
        primary: '#65a30d',
        accent: '#a3e635',
        background: '#f4fce3',
        surface: '#ffffff',
        subtle: '#ecfccb',
        text: '#1b4332',
        muted: '#46796c',
        border: '#c7e8b4',
      },
      fonts: {
        heading: MENU_THEME_FONTS.montserrat,
        body: MENU_THEME_FONTS['pt-serif'],
      },
      background: {
        type: 'color',
        color: '#f4fce3',
        image: null,
        overlayOpacity: 0.3,
      }
    }
  },
  {
    id: 'cozy-bakery',
    name: 'Уютная пекарня',
    description: 'Тёплые сливочные тона и мягкие контрасты для домашней атмосферы.',
    config: {
      presetId: 'cozy-bakery',
      palette: {
        primary: '#d97706',
        accent: '#fbbf24',
        background: '#fff7ed',
        surface: '#ffffff',
        subtle: '#fde68a',
        text: '#78350f',
        muted: '#b45309',
        border: '#fcd34d',
      },
      fonts: {
        heading: MENU_THEME_FONTS['pt-serif'],
        body: MENU_THEME_FONTS.inter,
      },
      background: {
        type: 'color',
        color: '#fff7ed',
        image: null,
        overlayOpacity: 0.2,
      }
    }
  },
  {
    id: 'ocean-breeze',
    name: 'Морской бриз',
    description: 'Свежая голубая палитра с лёгкими акцентами для морских концепций.',
    config: {
      presetId: 'ocean-breeze',
      palette: {
        primary: '#0ea5e9',
        accent: '#38bdf8',
        background: '#ecfeff',
        surface: '#ffffff',
        subtle: '#cffafe',
        text: '#0f172a',
        muted: '#155e75',
        border: '#bae6fd',
      },
      fonts: {
        heading: MENU_THEME_FONTS.montserrat,
        body: MENU_THEME_FONTS.inter,
      },
      background: {
        type: 'image',
        color: '#ecfeff',
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1600&auto=format&fit=crop',
        overlayOpacity: 0.55,
      }
    }
  },
  {
    id: 'velvet-lounge',
    name: 'Бархатный лаундж',
    description: 'Глубокие тёмные оттенки и яркие акценты для вечерних проектов.',
    config: {
      presetId: 'velvet-lounge',
      palette: {
        primary: '#c026d3',
        accent: '#f472b6',
        background: '#111827',
        surface: '#1f2937',
        subtle: '#312e81',
        text: '#fdf4ff',
        muted: '#c4b5fd',
        border: '#4c1d95',
      },
      fonts: {
        heading: MENU_THEME_FONTS['playfair-display'],
        body: MENU_THEME_FONTS.inter,
      },
      background: {
        type: 'image',
        color: '#111827',
        image: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?q=80&w=1600&auto=format&fit=crop',
        overlayOpacity: 0.7,
      }
    }
  }
]

export const MENU_THEME_FONT_OPTIONS = [
  { id: 'inter', label: 'Inter (современный)', value: MENU_THEME_FONTS.inter },
  { id: 'montserrat', label: 'Montserrat (геометрический)', value: MENU_THEME_FONTS.montserrat },
  { id: 'playfair-display', label: 'Playfair Display (классический)', value: MENU_THEME_FONTS['playfair-display'] },
  { id: 'pt-serif', label: 'PT Serif (серифный)', value: MENU_THEME_FONTS['pt-serif'] },
]
