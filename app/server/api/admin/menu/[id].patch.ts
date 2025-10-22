import { createError, defineEventHandler, readBody } from 'h3'
import { AdminMenuDetailsSchema } from '~/schemas/adminMenu'
import { getMenuDetailsById, updateMenuDetails } from '~/server/data/menuStore'
import { validateMenuTheme } from '~/utils/theme'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню',
    })
  }

  const existing = getMenuDetailsById(id)

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено',
    })
  }

  const body = await readBody(event)
  const parsed = AdminMenuDetailsSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректные данные меню',
      data: parsed.error.flatten(),
    })
  }

  if (parsed.data.id !== id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Идентификатор меню не совпадает с запрошенным',
    })
  }

  const themeValidation = validateMenuTheme(parsed.data.theme)

  if (!themeValidation.isValid) {
    console.warn('[menu-store] Theme validation failed', {
      id,
      errors: themeValidation.errors,
    })

    throw createError({
      statusCode: 422,
      statusMessage: 'Настройки темы не проходят проверку доступности',
      data: {
        errors: themeValidation.errors,
      },
    })
  }

  if (themeValidation.warnings.length) {
    console.warn('[menu-store] Theme validation warnings', {
      id,
      warnings: themeValidation.warnings,
    })
  }

  const updated = updateMenuDetails(parsed.data)

  console.info('[menu-store] Theme configuration saved', {
    id,
    preset: parsed.data.theme.presetId,
  })

  return {
    menu: updated,
    warnings: themeValidation.warnings,
  }
})
