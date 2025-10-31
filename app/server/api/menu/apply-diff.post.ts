import { createError, defineEventHandler, readBody } from 'h3'

import { ApplyDiffRequestSchema } from '~/schemas/menu-quick-edit'
import { getQuickEditAuditByRequestId, updateQuickEditAuditStatus } from '~/server/data/menu-quick-edit-audit'
import { applyQuickEditChanges } from '~/server/utils/menuQuickEdit'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = ApplyDiffRequestSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Некорректный запрос',
      message: parsed.error.issues[0]?.message ?? 'Некорректные данные запроса.'
    })
  }

  const { menuId, requestId, items } = parsed.data

  const auditRecord = getQuickEditAuditByRequestId(requestId)

  if (!auditRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Сессия быстрого редактирования не найдена',
      message: 'Сначала запросите изменения через AI, затем подтверждайте их.'
    })
  }

  try {
    const response = applyQuickEditChanges(menuId, requestId, auditRecord.id, items)

    updateQuickEditAuditStatus(requestId, {
      status: 'applied',
      applyWarnings: response.warnings,
      diffSummary: `${response.appliedCount} блюд обновлено`
    })

    return response
  } catch (error: any) {
    console.error('[api][menu][apply-diff] Failed to apply quick edit changes', error)
    updateQuickEditAuditStatus(requestId, {
      status: 'failed',
      errorMessage: error?.message ?? 'Неизвестная ошибка применения изменений.'
    })

    throw error
  }
})
