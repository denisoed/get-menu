/**
 * Represents a single menu record fetched from Supabase.
 *
 * A menu is a logical collection of dishes (e.g. "Летнее меню", "Детское меню").
 * Individual dishes are stored in a separate `dishes` table and reference the
 * menu via a foreign key — this interface intentionally does not include dish
 * level pricing or category fields.
 */
export interface MenuRecord {
  id: string
  name: string
  slug?: string | null
  description?: string | null
  is_active: boolean
  position?: number | null
  valid_from?: string | null
  valid_to?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface MenuListResponse {
  menus: MenuRecord[]
  error: null | {
    message: string
  }
}
