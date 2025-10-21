import { createError, defineEventHandler } from 'h3'

import { fetchCategories } from '~/server/services/categories'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][categories] Unexpected error while fetching categories', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to load categories.',
    message: 'Failed to load categories.',
    data: {
      code: 'admin_categories_unexpected_failure'
    }
  })
}

export const handleAdminCategoriesList = defineEventHandler(async () => {
  try {
    const categories = await fetchCategories()
    return {
      categories,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminCategoriesList
