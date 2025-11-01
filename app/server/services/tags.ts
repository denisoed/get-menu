import { createError, type H3Error } from 'h3'
import type { PostgrestError } from '@supabase/supabase-js'

import {
  TagModelListSchema,
  TagModelSchema,
  TagRowListSchema,
  TagRowSchema,
  type CreateTagInput,
  type TagModel,
  type UpdateTagInput
} from '~/schemas/tags'
import { getSupabaseServiceClient } from '~/server/utils/supabaseClient'

function logSupabaseError(action: string, error: PostgrestError) {
  console.error(`[supabase][tags] Failed to ${action}`, {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint
  })
}

function mapTagRow(row: unknown): TagModel {
  const parsed = TagRowSchema.safeParse(row)

  if (!parsed.success) {
    console.error('[supabase][tags] Unexpected payload shape', parsed.error.flatten())
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось обработать данные тегов.',
      message: 'Не удалось обработать данные тегов.',
      data: {
        code: 'supabase_tag_invalid_payload'
      }
    })
  }

  const normalized: TagModel = {
    id: parsed.data.id,
    name: parsed.data.name,
    createdAt: parsed.data.created_at,
    updatedAt: parsed.data.updated_at
  }

  return TagModelSchema.parse(normalized)
}

function handleSupabaseError(action: string, error: PostgrestError): H3Error {
  logSupabaseError(action, error)

  if (error.code === '23505') {
    return createError({
      statusCode: 409,
      statusMessage: 'Такой тег уже существует.',
      message: 'Такой тег уже существует.',
      data: {
        code: 'supabase_tag_unique_violation'
      }
    })
  }

  if (error.code === 'PGRST116') {
    if (action === 'update tag') {
      return createError({
        statusCode: 409,
        statusMessage: 'Тег изменён другим пользователем. Обновите страницу и попробуйте снова.',
        message: 'Тег изменён другим пользователем. Обновите страницу и попробуйте снова.',
        data: {
          code: 'supabase_tag_conflict',
          details: error.details ?? error.message ?? null
        }
      })
    }

    if (action === 'delete tag') {
      return createError({
        statusCode: 404,
        statusMessage: 'Тег не найден или уже удалён.',
        message: 'Тег не найден или уже удалён.',
        data: {
          code: 'supabase_tag_not_found',
          details: error.details ?? error.message ?? null
        }
      })
    }
  }

  return createError({
    statusCode: 502,
    statusMessage: 'Не удалось выполнить запрос к Supabase для тегов.',
    message: 'Не удалось выполнить запрос к Supabase для тегов.',
    data: {
      code: 'supabase_tag_request_failed',
      details: error.details ?? error.message ?? null
    }
  })
}

export async function fetchTags(): Promise<TagModel[]> {
  const supabase = getSupabaseServiceClient()

  const { data, error } = await supabase
    .from('tags')
    .select('id, name, created_at, updated_at')
    .order('name', { ascending: true })

  if (error) {
    throw handleSupabaseError('fetch tags', error)
  }

  const parsed = TagRowListSchema.safeParse(data ?? [])

  if (!parsed.success) {
    console.error('[supabase][tags] Invalid tags payload', parsed.error.flatten())
    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось обработать список тегов.',
      message: 'Не удалось обработать список тегов.',
      data: {
        code: 'supabase_tag_parse_failed'
      }
    })
  }

  return TagModelListSchema.parse(parsed.data.map(mapTagRow))
}

export async function createTag(payload: CreateTagInput): Promise<TagModel> {
  const supabase = getSupabaseServiceClient()

  const insert = {
    name: payload.name.trim()
  }

  const { data, error } = await supabase
    .from('tags')
    .insert(insert)
    .select('id, name, created_at, updated_at')
    .single()

  if (error) {
    throw handleSupabaseError('create tag', error)
  }

  return mapTagRow(data)
}

export async function updateTag(id: string, payload: UpdateTagInput): Promise<TagModel> {
  const supabase = getSupabaseServiceClient()

  const updatePayload = {
    name: payload.name.trim()
  }

  const { data, error } = await supabase
    .from('tags')
    .update(updatePayload)
    .eq('id', id)
    .eq('updated_at', payload.updatedAt)
    .select('id, name, created_at, updated_at')
    .maybeSingle()

  if (error) {
    throw handleSupabaseError('update tag', error)
  }

  if (!data) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Тег изменён другим пользователем. Обновите страницу и попробуйте снова.',
      message: 'Тег изменён другим пользователем. Обновите страницу и попробуйте снова.',
      data: {
        code: 'supabase_tag_conflict'
      }
    })
  }

  return mapTagRow(data)
}

async function cleanupTagReferences(tagId: string) {
  const supabase = getSupabaseServiceClient()

  const { error } = await supabase.rpc('remove_tag_from_menu_items', { tag_id: tagId })

  if (error) {
    throw handleSupabaseError('cleanup tag references', error)
  }
}

export async function deleteTag(id: string): Promise<TagModel> {
  const supabase = getSupabaseServiceClient()

  await cleanupTagReferences(id).catch((error) => {
    console.error('[supabase][tags] Failed to cleanup menu items before deleting tag', error)
  })

  const { data, error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)
    .select('id, name, created_at, updated_at')
    .maybeSingle()

  if (error) {
    throw handleSupabaseError('delete tag', error)
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Тег не найден или уже удалён.',
      message: 'Тег не найден или уже удалён.',
      data: {
        code: 'supabase_tag_not_found'
      }
    })
  }

  return mapTagRow(data)
}
