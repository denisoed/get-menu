import { z } from 'zod'
import { MenuThemeConfigSchema } from '~/schemas/menuTheme'

const MenuOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1).max(120),
  add: z.number().nullable(),
})

const MenuItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(180),
  category: z.string().max(120),
  price: z.number().nullable(),
  img: z.string().url().or(z.literal('')),
  tags: z.array(z.string()),
  description: z.string(),
  options: z.object({
    sizes: z.array(MenuOptionSchema),
    extras: z.array(MenuOptionSchema),
  }),
})

const CafeSchema = z.object({
  cafeName: z.string().min(1),
  phone: z.string().min(1),
  whatsapp: z.string().min(1),
  minOrder: z.number().nullable(),
  deliveryFee: z.number().nullable(),
  address: z.string(),
  announcement: z.string(),
  bannerImage: z.string().url().or(z.literal('')),
  bannerTitle: z.string(),
  bannerSubtitle: z.string(),
  openHours: z.string(),
  scheduleDetails: z.string(),
})

export const AdminMenuDetailsSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  cafe: CafeSchema,
  items: z.array(MenuItemSchema),
  theme: MenuThemeConfigSchema,
})

export type AdminMenuDetailsInput = z.infer<typeof AdminMenuDetailsSchema>
