import type { MenuItem } from './menu'

export interface CartEntryMeta {
  cartKey: string
  basePrice: number
  sizeLabel?: string
  extrasLabels?: string[]
}

export type CartEntry = MenuItem & CartEntryMeta

export interface GroupedCartItem {
  key: string
  item: CartEntry
  quantity: number
  lineTotal: number
}
