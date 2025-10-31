import { createError, defineEventHandler, readBody, type H3Event } from 'h3'

import { AiDiffRequestSchema } from '~/schemas/menu-quick-edit'
import { recordQuickEditEvent } from '~/server/data/menu-quick-edit-audit'
import { buildQuickEditDiff } from '~/server/utils/menuQuickEdit'
import { assertRateLimit } from '~/server/utils/rateLimiter'

function resolveClientKey(event: H3Event) {
  const forwarded = event.node.req.headers['x-forwarded-for']
  if (Array.isArray(forwarded)) {
    return forwarded[0]
  }

  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0]!.trim()
  }

  return event.node.req.socket.remoteAddress || 'unknown'
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const parsed = AiDiffRequestSchema.safeParse(body)

    if (!parsed.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Некорректный запрос',
        message: parsed.error.issues[0]?.message ?? 'Некорректные данные запроса.'
      })
    }

    const clientKey = `${parsed.data.menuId}:${resolveClientKey(event)}`
    assertRateLimit(clientKey, {
      limit: 5,
      windowMs: 60_000,
      errorMessage: 'Вы отправляете слишком много запросов. Попробуйте снова через минуту.'
    })

    const diff = buildQuickEditDiff(parsed.data.menuId, parsed.data.instructions)

    recordQuickEditEvent({
      id: diff.auditId,
      menuId: diff.menuId,
      createdAt: diff.generatedAt,
      actor: 'admin',
      instructions: diff.instructionsEcho,
      diffRequestId: diff.requestId,
      diffSummary: diff.summary,
      diffItems: diff.items,
      applyWarnings: diff.globalWarnings,
      status: 'diff_generated'
    })

    return diff
  } catch (error) {
    console.error('[api][menu][ai-diff] Failed to process quick edit diff', error)
    throw error
  }
})
