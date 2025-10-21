import { createError, defineEventHandler, getRouterParam } from 'h3'
import { z } from 'zod'

import { deleteCategory } from '~/server/services/categories'

const CategoryIdSchema = z.string().uuid('Category identifier has an invalid format.')

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][categories] Unexpected error while deleting category', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to delete category.',
    message: 'Failed to delete category.',
    data: {
      code: 'admin_categories_delete_unexpected_failure'
    }
  })
}

export const handleAdminCategoriesDelete = defineEventHandler(async (event) => {
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

    const category = await deleteCategory(idResult.data)

    return {
      category,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminCategoriesDelete
