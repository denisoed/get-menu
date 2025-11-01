import { createError, defineEventHandler } from 'h3'

import { fetchTags } from '~/server/services/tags'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][tags] Unexpected error while fetching tags', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось загрузить теги.',
    message: 'Не удалось загрузить теги.',
    data: {
      code: 'admin_tags_unexpected_failure'
    }
  })
}

export const handleAdminTagsList = defineEventHandler(async () => {
  try {
    const tags = await fetchTags()
    return {
      tags,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminTagsList
