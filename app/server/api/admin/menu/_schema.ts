import { z } from 'zod'

const MenuOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  add: z.number().nullable()
})

const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  price: z.number().nullable(),
  img: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
  options: z.object({
    sizes: z.array(MenuOptionSchema),
    extras: z.array(MenuOptionSchema)
  })
})

const CafeSchema = z.object({
  cafeName: z.string(),
  phone: z.string(),
  whatsapp: z.string(),
  minOrder: z.number().nullable(),
  deliveryFee: z.number().nullable(),
  address: z.string(),
  announcement: z.string(),
  bannerImage: z.string(),
  bannerTitle: z.string(),
  bannerSubtitle: z.string(),
  openHours: z.string(),
  scheduleDetails: z.string()
})

const subdomainRule = z
  .string()
  .min(3, 'Subdomain must contain at least 3 characters.')
  .max(32, 'Subdomain must not exceed 32 characters.')
  .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, or hyphens.')

export const MenuEditorPayloadSchema = z.object({
  id: z.string().optional(),
  subdomain: subdomainRule,
  title: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
  isPublished: z.boolean(),
  cafe: CafeSchema,
  items: z.array(MenuItemSchema)
})

export type MenuEditorPayload = z.infer<typeof MenuEditorPayloadSchema>
