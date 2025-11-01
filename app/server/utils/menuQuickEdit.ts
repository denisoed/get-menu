import { createError } from 'h3'

import { MENU_DETAILS } from '~/server/data/admin-menu-details'
import { QUICK_EDIT_PROMPT_TEMPLATE, QUICK_EDIT_RESPONSE_SCHEMA } from '~/server/data/menu-quick-edit-prompts'
import type {
  QuickEditAiDiff,
  QuickEditApplyRequestItem,
  QuickEditApplyResponse,
  QuickEditChangeField,
  QuickEditItemDiff
} from '~/types/menu-quick-edit'

interface ParsedContext {
  price: number | null
  tags: string[]
  description: string | null
  warnings: string[]
}

const PRICE_PATTERNS = [
  /цен[а-яё]*[^0-9]{0,10}(\d{2,6})/i,
  /стоимост[ьа][^0-9]{0,10}(\d{2,6})/i,
  /(\d{2,6})\s*(?:сом(?:ов)?|kgs?)/i
]

const TAGS_PATTERN = /тег(?:и)?(?:\s*[:=]\s*|\s+)([^\n.;]+)/i
const DESCRIPTION_PATTERN = /описан[ие][^\w]{0,10}(?:на|=|:)?\s*"?([^"\n]+)"?/i

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[«»"'()]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function collapse(value: string) {
  return normalize(value).replace(/\s+/g, '')
}

function collectContexts(text: string, name: string) {
  const regex = new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const contexts: string[] = []
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const start = Math.max(0, match.index - 80)
    const end = Math.min(text.length, match.index + match[0].length + 120)
    contexts.push(text.slice(start, end))
  }

  return contexts
}

function parseContext(context: string): ParsedContext {
  const warnings: string[] = []
  let price: number | null = null
  let tags: string[] = []
  let description: string | null = null

  for (const pattern of PRICE_PATTERNS) {
    const match = context.match(pattern)
    if (match && match[1]) {
      const normalized = match[1].replace(/\s+/g, '')
      const parsed = Number.parseInt(normalized, 10)
      if (!Number.isNaN(parsed)) {
        price = parsed
        break
      }
    }
  }

  const tagsMatch = context.match(TAGS_PATTERN)
  if (tagsMatch && tagsMatch[1]) {
    tags = tagsMatch[1]
      .split(/[,;/]/)
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  const descriptionMatch = context.match(DESCRIPTION_PATTERN)
  if (descriptionMatch && descriptionMatch[1]) {
    description = descriptionMatch[1].trim()
  }

  if (!price && !tags.length && !description) {
    warnings.push('Не удалось извлечь конкретные изменения из текста рядом с названием блюда.')
  }

  return { price, tags, description, warnings }
}

function createChangeField(
  menuItem: (typeof MENU_DETAILS[keyof typeof MENU_DETAILS])['items'][number],
  parsed: ParsedContext
): QuickEditChangeField[] {
  const changes: QuickEditChangeField[] = []

  if (parsed.price !== null && parsed.price !== menuItem.price) {
    changes.push({
      id: `price:${menuItem.id}`,
      field: 'price',
      label: 'Цена',
      previousValue: menuItem.price,
      nextValue: parsed.price,
      unit: 'KGS'
    })
  }

  if (parsed.tags.length) {
    const nextTags = parsed.tags.join(', ')
    const previousTags = menuItem.tags.join(', ')

    if (nextTags && nextTags !== previousTags) {
      changes.push({
        id: `tags:${menuItem.id}`,
        field: 'tags',
        label: 'Теги',
        previousValue: previousTags || null,
        nextValue: nextTags || null
      })
    }
  }

  if (parsed.description && parsed.description !== menuItem.description) {
    changes.push({
      id: `description:${menuItem.id}`,
      field: 'description',
      label: 'Описание',
      previousValue: menuItem.description || null,
      nextValue: parsed.description
    })
  }

  return changes
}

function extractRequestedNames(instructions: string) {
  const pattern = /(?:блюд[аоуы]|позици[яиюи]|блюду|для\s+блюда|у\s+блюда)\s+«?([^«»"\n.,]+)/gi
  const matches: string[] = []
  let match: RegExpExecArray | null

  while ((match = pattern.exec(instructions)) !== null) {
    matches.push(match[1].trim())
  }

  return matches
}

export function buildQuickEditDiff(menuId: string, instructions: string): QuickEditAiDiff {
  const menu = MENU_DETAILS[menuId]

  if (!menu) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено',
      message: 'Меню не найдено.'
    })
  }

  const requestId = createId('qe')
  const auditId = createId('audit')
  const generatedAt = new Date().toISOString()
  const normalizedText = normalize(instructions)
  const collapsedText = collapse(instructions)

  const diffs: QuickEditItemDiff[] = []
  const requestedNames = extractRequestedNames(instructions)

  for (const item of menu.items) {
    const contexts = collectContexts(instructions, item.name)
    const normalizedName = normalize(item.name)
    const collapsedName = collapse(item.name)

    let confidence: 'exact' | 'fuzzy' | 'unknown' = 'unknown'

    if (contexts.length) {
      confidence = 'exact'
    } else if (normalizedText.includes(normalizedName) || collapsedText.includes(collapsedName)) {
      confidence = 'fuzzy'
    }

    if (!contexts.length && confidence === 'unknown') {
      continue
    }

    const parsedResults = contexts.length ? contexts.map(parseContext) : [parseContext(instructions)]
    const aggregated: ParsedContext = parsedResults.reduce<ParsedContext>((acc, current) => ({
      price: current.price ?? acc.price,
      tags: current.tags.length ? current.tags : acc.tags,
      description: current.description ?? acc.description,
      warnings: [...acc.warnings, ...current.warnings]
    }), { price: null, tags: [], description: null, warnings: [] })

    const changes = createChangeField(item, aggregated)

    if (!changes.length) {
      diffs.push({
        id: `${requestId}:${item.id}`,
        itemId: item.id,
        itemName: item.name,
        confidence,
        canApply: false,
        reason: confidence === 'exact' ? 'Изменения не распознаны' : 'Низкая уверенность сопоставления',
        changes: [],
        warnings: aggregated.warnings.length
          ? aggregated.warnings
          : ['Не найдено конкретных изменений для применения.']
      })
      continue
    }

    diffs.push({
      id: `${requestId}:${item.id}`,
      itemId: item.id,
      itemName: item.name,
      confidence,
      canApply: true,
      reason: confidence === 'exact' ? 'Совпадение по названию блюда' : 'Совпадение по приблизительному названию',
      changes,
      warnings: aggregated.warnings
    })
  }

  if (!diffs.length) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Не удалось распознать изменения',
      message: 'AI не смог сопоставить текст с существующими блюдами. Попробуйте уточнить формулировки.'
    })
  }

  const matchedNames = new Set(diffs.map((diff) => diff.itemName.toLowerCase()))
  const globalWarnings: string[] = []

  for (const candidate of requestedNames) {
    if (!matchedNames.has(candidate.toLowerCase())) {
      globalWarnings.push(`Не найдено блюдо «${candidate}». Проверьте орфографию или уточните категорию.`)
    }
  }

  const summary = `Найдено ${diffs.filter((diff) => diff.canApply).length} блюд с потенциальными изменениями.`

  return {
    requestId,
    auditId,
    menuId,
    generatedAt,
    promptTemplate: QUICK_EDIT_PROMPT_TEMPLATE,
    schemaDefinition: QUICK_EDIT_RESPONSE_SCHEMA,
    summary,
    instructionsEcho: instructions,
    items: diffs,
    globalWarnings
  }
}

export function applyQuickEditChanges(
  menuId: string,
  requestId: string,
  auditId: string,
  items: QuickEditApplyRequestItem[]
): QuickEditApplyResponse {
  const menu = MENU_DETAILS[menuId]

  if (!menu) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено',
      message: 'Меню не найдено.'
    })
  }

  const warnings: string[] = []
  const updatedItems = new Map<string, {
    id: string
    name: string
    price: number | null
    tagIds: string[]
    tags: string[]
    description: string
  }>()

  for (const item of items) {
    const target = menu.items.find((entry) => entry.id === item.itemId)

    if (!target) {
      warnings.push(`Блюдо с идентификатором ${item.itemId} не найдено, изменения пропущены.`)
      continue
    }

    for (const change of item.changes) {
      if (change.field === 'price') {
        const numeric = typeof change.value === 'number' ? change.value : Number(change.value)
        if (Number.isFinite(numeric)) {
          target.price = numeric
        } else {
          warnings.push(`Не удалось применить цену для блюда «${target.name}».`)
        }
      }

      if (change.field === 'tags') {
        if (typeof change.value === 'string') {
          const previousMap = new Map(
            (target.tags || []).map((tag, index) => [normalize(tag), target.tagIds?.[index] ?? null])
          )

          const nextNames = change.value
            .split(/[,;/]/)
            .map((tag) => tag.trim())
            .filter(Boolean)

          target.tags = nextNames
          target.tagIds = nextNames.map((name) => {
            const normalizedName = normalize(name)
            const existing = previousMap.get(normalizedName)

            if (existing) {
              return existing
            }

            return createId('tag')
          })
        } else {
          warnings.push(`Некорректные теги для блюда «${target.name}».`)
        }
      }

      if (change.field === 'description') {
        if (typeof change.value === 'string') {
          target.description = change.value.trim()
        } else {
          warnings.push(`Некорректное описание для блюда «${target.name}».`)
        }
      }
    }

    updatedItems.set(target.id, {
      id: target.id,
      name: target.name,
      price: target.price ?? null,
      tagIds: target.tagIds ? [...target.tagIds] : [],
      tags: [...target.tags],
      description: target.description
    })
  }

  return {
    menuId,
    requestId,
    auditId,
    appliedCount: updatedItems.size,
    updatedItems: Array.from(updatedItems.values()),
    warnings
  }
}
