import type { MenuThemeConfig } from '~/types/theme'

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  tags: string[] | []
  img: string
  options?: {
    sizes?: Array<{ label: string; add?: number }>
    extras?: Array<{ label: string; add?: number }>
  }
}

export interface MenuCafeSettings {
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

export interface PublicMenuPayload {
  menu: MenuItem[]
  cafe: MenuCafeSettings
  theme: MenuThemeConfig
  title: string
  description: string
}
