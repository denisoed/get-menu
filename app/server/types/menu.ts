/**
 * Represents a single menu record fetched from Supabase.
 */
export interface MenuRecord {
  id: string
  title: string
  description?: string | null
  price: number
  category?: string | null
  is_active: boolean
  position?: number | null
  image_url?: string | null
  tags?: string[] | null
  created_at?: string | null
  updated_at?: string | null
}

export interface MenuListResponse {
  menus: MenuRecord[]
  error: null | {
    message: string
  }
}
