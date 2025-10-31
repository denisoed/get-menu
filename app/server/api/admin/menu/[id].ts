import { createError, defineEventHandler } from 'h3'
import { MENU_DETAILS } from '~/server/data/admin-menu-details'

export default defineEventHandler((event) => {
  const id = event.context.params?.id

  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню'
    })
  }

  const menu = MENU_DETAILS[id]

  if (!menu) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено'
    })
  }

  return menu
})
