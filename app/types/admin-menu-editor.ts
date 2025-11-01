import type { CategoryModel } from '~/schemas/categories'
import type { TagModel } from '~/schemas/tags'

export type OptionType = 'sizes' | 'extras'

export type EditableCategory = CategoryModel
export type EditableTag = TagModel

export interface EditableOption {
  id: string
  label: string
  add: number | null
}

export interface EditableMenuItem {
  id: string
  sourceId: string | null
  name: string
  category: string
  price: number | null
  img: string
  tagIds: string[]
  tags: string[]
  description: string
  isCollapsed: boolean
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
