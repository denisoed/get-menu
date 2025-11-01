import { createError, defineEventHandler } from 'h3'

import { deleteTag } from '~/server/services/tags'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][tags] Unexpected error while deleting tag', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось удалить тег.',
    message: 'Не удалось удалить тег.',
    data: {
      code: 'admin_tags_unexpected_failure'
    }
  })
}

export const handleAdminTagDelete = defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор тега.'
    })
  }

  try {
    const tag = await deleteTag(id)

    return {
      tag,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminTagDelete
