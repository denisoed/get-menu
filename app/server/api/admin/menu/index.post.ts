import { createError, defineEventHandler, readBody } from 'h3'

import { MenuEditorPayloadSchema } from '~/server/api/admin/menu/_schema'
import { createAdminMenu } from '~/server/services/adminMenus'

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readBody(event)
    const payload = MenuEditorPayloadSchema.parse(rawBody)

    const resolvedPayload = {
      ...payload,
      title: payload.title?.trim() || 'Меню без названия',
      description: payload.description ?? '',
      slug: payload.slug?.trim() || payload.subdomain
    }

    const menu = createAdminMenu(resolvedPayload)

    console.info('[api][menu] menu created', {
      id: menu.id,
      subdomain: menu.subdomain,
      isPublished: menu.isPublished
    })

    event.node.res.statusCode = 201

    return {
      menu,
      error: null
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'issues' in (error as any)) {
      console.error('[api][menu] payload validation failed', error)

      throw createError({
        statusCode: 400,
        statusMessage: 'Некорректные данные меню',
        data: { error: 'validation_error' }
      })
    }

    if ((error as any)?.code === 'subdomain_conflict') {
      console.warn('[api][menu] subdomain conflict on create', {
        subdomain: (error as any)?.subdomain
      })

      throw createError({
        statusCode: 409,
        statusMessage: 'Сабдомен уже используется другим меню',
        data: { error: 'subdomain_conflict' }
      })
    }

    console.error('[api][menu] unexpected error while creating menu', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Не удалось сохранить меню',
      data: { error: 'unexpected_error' }
    })
  }
})
