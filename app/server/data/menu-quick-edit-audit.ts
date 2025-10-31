import type { QuickEditAuditRecord } from '~/types/menu-quick-edit'

const auditLog: QuickEditAuditRecord[] = []

export function recordQuickEditEvent(entry: QuickEditAuditRecord) {
  auditLog.push(entry)
}

export function updateQuickEditAuditStatus(diffRequestId: string, patch: Partial<QuickEditAuditRecord>) {
  const target = auditLog.find((item) => item.diffRequestId === diffRequestId)

  if (!target) {
    return null
  }

  Object.assign(target, patch)

  return target
}

export function listQuickEditAudit() {
  return [...auditLog]
}

export function getQuickEditAuditByRequestId(requestId: string) {
  return auditLog.find((item) => item.diffRequestId === requestId) ?? null
}
