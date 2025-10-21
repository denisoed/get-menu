import { createError, type H3Error } from 'h3'
import type { PostgrestError } from '@supabase/supabase-js'

import {
  CategoryModelListSchema,
  CategoryModelSchema,
  CategoryRowListSchema,
  CategoryRowSchema,
  type CategoryModel,
  type CreateCategoryInput,
  type UpdateCategoryInput
} from '~/schemas/categories'
import { getSupabaseServiceClient } from '~/server/utils/supabaseClient'

function logSupabaseError(action: string, error: PostgrestError) {
  console.error(`[supabase][categories] Failed to ${action}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  })
}

function mapCategoryRow(row: unknown): CategoryModel {
  const parsed = CategoryRowSchema.safeParse(row)

  if (!parsed.success) {
    console.error('[supabase][categories] Unexpected payload shape', parsed.error.flatten())
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process category data.',
      message: 'Failed to process category data.',
      data: {
        code: 'supabase_category_invalid_payload'
      }
    })
  }

  const normalized: CategoryModel = {
    id: parsed.data.id,
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    position: parsed.data.position ?? null,
    createdAt: parsed.data.created_at,
    updatedAt: parsed.data.updated_at
  }

  const validated = CategoryModelSchema.parse(normalized)
  return validated
}

function handleSupabaseError(action: string, error: PostgrestError): H3Error {
  logSupabaseError(action, error)

  if (error.code === '23505') {
    return createError({
      statusCode: 409,
      statusMessage: 'A category with this name already exists.',
      message: 'A category with this name already exists.',
      data: {
        code: 'supabase_category_unique_violation'
      }
    })
  }

  if (error.code === '23503') {
    return createError({
      statusCode: 409,
      statusMessage: 'Category cannot be deleted while dishes reference it.',
      message: 'Category cannot be deleted while dishes reference it.',
      data: {
        code: 'supabase_category_in_use'
      }
    })
  }

  if (error.code === 'PGRST116') {
    if (action === 'update category') {
      return createError({
        statusCode: 409,
        statusMessage: 'Category was modified by another user. Refresh and try again.',
        message: 'Category was modified by another user. Refresh and try again.',
        data: {
          code: 'supabase_category_conflict',
          details: error.details ?? error.message ?? null
        }
      })
    }

    if (action === 'delete category') {
      return createError({
        statusCode: 404,
        statusMessage: 'Category not found or already removed.',
        message: 'Category not found or already removed.',
        data: {
          code: 'supabase_category_not_found',
          details: error.details ?? error.message ?? null
        }
      })
    }
  }

  return createError({
    statusCode: 502,
    statusMessage: 'Failed to process Supabase request for categories.',
    message: 'Failed to process Supabase request for categories.',
    data: {
      code: 'supabase_category_request_failed',
      details: error.details ?? error.message ?? null
    }
  })
}

export async function fetchCategories(): Promise<CategoryModel[]> {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('categories')
    .select('id, name, description, position, created_at, updated_at')
    .order('position', { ascending: true, nullsLast: true })
    .order('name', { ascending: true })

  if (error) {
    throw handleSupabaseError('fetch categories', error)
  }

  const parsed = CategoryRowListSchema.safeParse(data ?? [])

  if (!parsed.success) {
    console.error('[supabase][categories] Invalid categories payload', parsed.error.flatten())
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to parse category list.',
      message: 'Failed to parse category list.',
      data: {
        code: 'supabase_category_parse_failed'
      }
    })
  }

  return CategoryModelListSchema.parse(parsed.data.map(mapCategoryRow))
}

export async function createCategory(payload: CreateCategoryInput): Promise<CategoryModel> {
  const supabase = getSupabaseServiceClient()

  const insert = {
    name: payload.name.trim(),
    description: payload.description?.trim() ?? null,
    position: payload.position ?? null
  }

  const { data, error } = await supabase
    .from('categories')
    .insert(insert)
    .select('id, name, description, position, created_at, updated_at')
    .single()

  if (error) {
    throw handleSupabaseError('create category', error)
  }

  return mapCategoryRow(data)
}

export async function updateCategory(id: string, payload: UpdateCategoryInput): Promise<CategoryModel> {
  const supabase = getSupabaseServiceClient()

  const updatePayload = {
    name: payload.name.trim(),
    description: payload.description?.trim() ?? null,
    position: payload.position ?? null
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updatePayload)
    .eq('id', id)
    .eq('updated_at', payload.updatedAt)
    .select('id, name, description, position, created_at, updated_at')
    .maybeSingle()

  if (error) {
    throw handleSupabaseError('update category', error)
  }

  if (!data) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Category was modified by another user. Refresh and try again.',
      message: 'Category was modified by another user. Refresh and try again.',
      data: {
        code: 'supabase_category_conflict'
      }
    })
  }

  return mapCategoryRow(data)
}

export async function deleteCategory(id: string): Promise<CategoryModel> {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)
    .select('id, name, description, position, created_at, updated_at')
    .maybeSingle()

  if (error) {
    throw handleSupabaseError('delete category', error)
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Category not found or already removed.',
      message: 'Category not found or already removed.',
      data: {
        code: 'supabase_category_not_found'
      }
    })
  }

  return mapCategoryRow(data)
}
