import type { CategoryModel } from '~/schemas/categories'
import type { MenuThemeConfig } from '~/types/theme'

export type OptionType = 'sizes' | 'extras'

export type EditableCategory = CategoryModel

export interface EditableOption {
  id: string
  label: string
  add: number | null
}

export interface EditableMenuItem {
  id: string
  name: string
  category: string
  price: number | null
  img: string
  tags: string
  description: string
  options: {
    sizes: EditableOption[]
    extras: EditableOption[]
  }
}

export interface CafeForm {
  cafeName: string
  phone: string
  whatsapp: string
  minOrder: number | null
  deliveryFee: number | null
  address: string
  announcement: string
  bannerImage: string
  bannerTitle: string
  bannerSubtitle: string
  openHours: string
  scheduleDetails: string
}

export type EditableMenuTheme = MenuThemeConfig
