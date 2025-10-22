import { createError } from 'h3'
import { getPublicMenuBySlug } from '~/server/data/menuStore'

export default defineEventHandler((event) => {
  const slug = event.context.params?.slug
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню'
    })
  }

  const payload = getPublicMenuBySlug(slug)

  if (!payload) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено'
    })
  }

  console.info('[menu-store] public menu delivered', {
    slug,
    theme: payload.theme.presetId,
  })

  return payload
})
