export interface AdminMenuDetails {
  id: string
  slug: string
  subdomain: string
  title: string
  description: string
  isPublished: boolean
  cafe: {
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
  items: Array<{
    id: string
    name: string
    category: string
    price: number | null
    img: string
    tags: string[]
    description: string
    options: {
      sizes: Array<{ id: string; label: string; add: number | null }>
      extras: Array<{ id: string; label: string; add: number | null }>
    }
  }>
}
