export type QuickEditField = 'price' | 'tags' | 'description'

export interface QuickEditChangeField {
  id: string
  field: QuickEditField
  label: string
  previousValue: string | number | null
  nextValue: string | number | null
  unit?: string
}

export type QuickEditMatchConfidence = 'exact' | 'fuzzy' | 'unknown'

export interface QuickEditItemDiff {
  id: string
  itemId: string | null
  itemName: string
  confidence: QuickEditMatchConfidence
  canApply: boolean
  reason: string
  changes: QuickEditChangeField[]
  warnings: string[]
}

export interface QuickEditAiDiff {
  requestId: string
  menuId: string
  generatedAt: string
  auditId: string
  promptTemplate: string
  schemaDefinition: string
  summary: string
  instructionsEcho: string
  items: QuickEditItemDiff[]
  globalWarnings: string[]
}

export interface QuickEditApplyRequestItem {
  itemId: string
  changes: Array<{
    field: QuickEditField
    value: string | number | null
  }>
}

export interface QuickEditApplyResponse {
  menuId: string
  requestId: string
  appliedCount: number
  updatedItems: Array<{
    id: string
    name: string
    price: number | null
    tags: string[]
    description: string
  }>
  warnings: string[]
  auditId: string
}

export interface QuickEditAuditRecord {
  id: string
  menuId: string
  createdAt: string
  actor: 'admin'
  instructions: string
  diffRequestId: string
  diffSummary: string
  diffItems: QuickEditItemDiff[]
  applyWarnings: string[]
  status: 'diff_generated' | 'applied' | 'failed'
  errorMessage?: string
}
