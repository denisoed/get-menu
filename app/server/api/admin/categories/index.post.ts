import { createError, defineEventHandler, readBody } from 'h3'

import { createCategory } from '~/server/services/categories'
import { CreateCategoryInputSchema } from '~/schemas/categories'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][categories] Unexpected error while creating category', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to create category.',
    message: 'Failed to create category.',
    data: {
      code: 'admin_categories_create_unexpected_failure'
    }
  })
}

export const handleAdminCategoriesCreate = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const parsed = CreateCategoryInputSchema.safeParse(body)

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

    const category = await createCategory(parsed.data)

    return {
      category,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminCategoriesCreate
