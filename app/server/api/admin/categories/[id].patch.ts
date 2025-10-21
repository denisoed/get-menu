import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'

import { updateCategory } from '~/server/services/categories'
import { UpdateCategoryInputSchema } from '~/schemas/categories'

const CategoryIdSchema = z.string().uuid('Category identifier has an invalid format.')

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][categories] Unexpected error while updating category', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to update category.',
    message: 'Failed to update category.',
    data: {
      code: 'admin_categories_update_unexpected_failure'
    }
  })
}

export const handleAdminCategoriesUpdate = defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const idResult = CategoryIdSchema.safeParse(idParam)

    if (!idResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category identifier is invalid.',
        message: 'Category identifier is invalid.',
        data: {
          code: 'admin_categories_invalid_id',
          issues: idResult.error.flatten()
        }
      })
    }

    const body = await readBody(event)
    const parsed = UpdateCategoryInputSchema.safeParse(body)

    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Category data is invalid.',
        message: 'Category data is invalid.',
        data: {
          code: 'admin_categories_invalid_payload',
          issues: parsed.error.flatten()
        }
      })
    }

    const category = await updateCategory(idResult.data, parsed.data)

    return {
      category,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminCategoriesUpdate
