import { createError, defineEventHandler, readBody } from 'h3'

import { MenuEditorPayloadSchema } from '~/server/api/admin/menu/_schema'
import { updateAdminMenu } from '~/server/services/adminMenus'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню'
    })
  }

  try {
    const rawBody = await readBody(event)
    const payload = MenuEditorPayloadSchema.parse(rawBody)

    if (payload.id && payload.id !== id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Идентификатор меню не совпадает с телом запроса'
      })
    }

    const resolvedPayload = {
      ...payload,
      id,
      title: payload.title?.trim() || 'Меню без названия',
      description: payload.description ?? '',
      slug: payload.slug?.trim() || payload.subdomain
    }

    const menu = updateAdminMenu(id, resolvedPayload)

    console.info('[api][menu] menu updated', {
      id,
      subdomain: menu.subdomain,
      isPublished: menu.isPublished
    })

    return {
      menu,
      error: null
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in (error as any)) {
      console.error('[api][menu] payload validation failed (update)', error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Некорректные данные меню',
        data: { error: 'validation_error' }
      })
    }

    if ((error as any)?.statusCode) {
      throw error
    }

    if ((error as any)?.code === 'menu_not_found') {
      console.warn('[api][menu] menu not found for update', { id })

      throw createError({
        statusCode: 404,
        statusMessage: 'Меню не найдено',
        data: { error: 'menu_not_found' }
      })
    }

    if ((error as any)?.code === 'subdomain_conflict') {
      console.warn('[api][menu] subdomain conflict on update', {
        id,
        subdomain: (error as any)?.subdomain
      })

      throw createError({
        statusCode: 409,
        statusMessage: 'Сабдомен уже используется другим меню',
        data: { error: 'subdomain_conflict' }
      })
    }

    console.error('[api][menu] unexpected error while updating menu', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось сохранить меню',
      data: { error: 'unexpected_error' }
    })
  }
})
