import { createError, defineEventHandler, readBody } from 'h3'

import { updateTag } from '~/server/services/tags'
import { UpdateTagInputSchema } from '~/schemas/tags'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][tags] Unexpected error while updating tag', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось обновить тег.',
    message: 'Не удалось обновить тег.',
    data: {
      code: 'admin_tags_unexpected_failure'
    }
  })
}

export const handleAdminTagUpdate = defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id || typeof id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор тега.'
    })
  }

  try {
    const body = await readBody(event)
    const payload = UpdateTagInputSchema.parse(body)
    const tag = await updateTag(id, payload)

    return {
      tag,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminTagUpdate
