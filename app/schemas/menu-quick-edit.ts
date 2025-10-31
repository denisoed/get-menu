import { z } from 'zod'

import type {
  QuickEditAiDiff,
  QuickEditApplyRequestItem,
  QuickEditChangeField,
  QuickEditItemDiff
} from '~/types/menu-quick-edit'

export const QuickEditFieldSchema = z.enum(['price', 'tags', 'description'])

export const QuickEditChangeFieldSchema: z.ZodType<QuickEditChangeField> = z.object({
  id: z.string().min(1),
  field: QuickEditFieldSchema,
  label: z.string().min(1),
  previousValue: z.union([z.string(), z.number(), z.null()]),
  nextValue: z.union([z.string(), z.number(), z.null()]),
  unit: z.string().min(1).optional()
})

export const QuickEditItemDiffSchema: z.ZodType<QuickEditItemDiff> = z.object({
  id: z.string().min(1),
  itemId: z.string().min(1).nullable(),
  itemName: z.string().min(1),
  confidence: z.enum(['exact', 'fuzzy', 'unknown']),
  canApply: z.boolean(),
  reason: z.string().min(1),
  changes: z.array(QuickEditChangeFieldSchema).min(1),
  warnings: z.array(z.string().min(1)).default([])
})

export const QuickEditAiDiffSchema: z.ZodType<QuickEditAiDiff> = z.object({
  requestId: z.string().min(1),
  menuId: z.string().min(1),
  generatedAt: z.string().min(1),
  auditId: z.string().min(1),
  promptTemplate: z.string().min(1),
  schemaDefinition: z.string().min(1),
  summary: z.string().min(1),
  instructionsEcho: z.string().min(1),
  items: z.array(QuickEditItemDiffSchema).min(1),
  globalWarnings: z.array(z.string().min(1)).default([])
})

export const AiDiffRequestSchema = z.object({
  menuId: z.string().min(1, 'Требуется идентификатор меню.'),
  instructions: z.string().min(20, 'Опишите изменения — минимум 20 символов.').max(1500, 'Запрос слишком длинный (макс. 1500 символов).')
})

export type AiDiffRequestInput = z.infer<typeof AiDiffRequestSchema>

export const ApplyDiffRequestSchema = z.object({
  menuId: z.string().min(1, 'Требуется идентификатор меню.'),
  requestId: z.string().min(1, 'Требуется идентификатор запроса.'),
  items: z.array(z.object({
    itemId: z.string().min(1, 'Укажите блюдо для обновления.'),
    changes: z.array(z.object({
      field: QuickEditFieldSchema,
      value: z.union([z.string(), z.number(), z.null()])
    })).min(1)
  })).min(1)
})

export type ApplyDiffRequestInput = z.infer<typeof ApplyDiffRequestSchema>

export const QuickEditApplyRequestItemSchema: z.ZodType<QuickEditApplyRequestItem> = z.object({
  itemId: z.string().min(1),
  changes: z.array(z.object({
    field: QuickEditFieldSchema,
    value: z.union([z.string(), z.number(), z.null()])
  })).min(1)
})
