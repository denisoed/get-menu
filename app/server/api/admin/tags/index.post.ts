import { createError, defineEventHandler, readBody } from 'h3'

import { createTag } from '~/server/services/tags'
import { CreateTagInputSchema } from '~/schemas/tags'

function rethrowOrWrap(error: unknown) {
  const handled = error && typeof error === 'object' && 'statusCode' in error

  if (handled) {
    throw error
  }

  console.error('[api][admin][tags] Unexpected error while creating tag', error)
  throw createError({
    statusCode: 500,
    statusMessage: 'Не удалось создать тег.',
    message: 'Не удалось создать тег.',
    data: {
      code: 'admin_tags_unexpected_failure'
    }
  })
}

export const handleAdminTagsCreate = defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const payload = CreateTagInputSchema.parse(body)
    const tag = await createTag(payload)

    return {
      tag,
      error: null
    }
  } catch (error) {
    rethrowOrWrap(error)
  }
})

export default handleAdminTagsCreate
