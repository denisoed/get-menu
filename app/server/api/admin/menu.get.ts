import { createError, defineEventHandler } from 'h3'
import { getSupabaseServiceClient } from '~/server/utils/supabaseClient'
import type { MenuListResponse, MenuRecord } from '~/server/types/menu'

const DEFAULT_ERROR_MESSAGE = 'Failed to load menus. Please try again later.'

export const handleAdminMenuRequest = defineEventHandler(async () => {
  try {
    const supabase = getSupabaseServiceClient()

    const query = supabase
      .from('menus')
      .select(
        [
          'id',
          'name',
          'slug',
          'description',
          'is_active',
          'position',
          'valid_from',
          'valid_to',
          'created_at',
          'updated_at'
        ].join(', ')
      )
      .eq('is_active', true)
      .order('position', { ascending: true, nullsLast: false })
      .order('created_at', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error while fetching admin menus', {
        message: error.message,
        details: error.details,
        hint: error.hint
      })

      throw createError<{ menus: MenuRecord[]; error: MenuListResponse['error'] }>({
        statusCode: 502,
        statusMessage: 'Bad Gateway',
        data: {
          menus: [],
          error: { message: DEFAULT_ERROR_MESSAGE }
        }
      })
    }

    const menus = (data ?? []) as MenuRecord[]

    const response: MenuListResponse = {
      menus,
      error: null
    }

    return response
  } catch (cause: any) {
    const isHandledError = cause && typeof cause === 'object' && 'statusCode' in cause

    if (!isHandledError) {
      console.error('Unexpected error while loading admin menus', cause)
    }

    if (isHandledError) {
      throw cause
    }

    throw createError<{ menus: MenuRecord[]; error: MenuListResponse['error'] }>({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        menus: [],
        error: { message: DEFAULT_ERROR_MESSAGE }
      }
    })
  }
})

export default handleAdminMenuRequest
