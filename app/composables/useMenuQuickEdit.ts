import { computed, reactive, ref, watch, type Ref } from 'vue'
import { useNuxtApp } from '#imports'

import type {
  QuickEditAiDiff,
  QuickEditApplyResponse,
  QuickEditItemDiff
} from '~/types/menu-quick-edit'
import type { EditableMenuItem } from '~/types/admin-menu-editor'
import { useNotifications } from '~/composables/useNotifications'

interface UseMenuQuickEditOptions {
  menuId: Ref<string | null>
  menuTitle: Ref<string>
  menuItems: Ref<EditableMenuItem[]>
}

interface FetchErrorPayload {
  statusCode?: number
  statusMessage?: string
  data?: { message?: string; code?: string; retryAfter?: number }
  message?: string
}

export function useMenuQuickEdit({ menuId, menuTitle, menuItems }: UseMenuQuickEditOptions) {
  const nuxtApp = useNuxtApp()
  const isOpen = ref(false)
  const step = ref<'input' | 'confirm' | 'success'>('input')
  const instructions = ref('')
  const instructionsLimit = 1500
  const instructionsError = ref<string | null>(null)
  const isRequestingDiff = ref(false)
  const isApplying = ref(false)
  const diff = ref<QuickEditAiDiff | null>(null)
  const selectedDiffIds = ref(new Set<string>())
  const errorMessage = ref<string | null>(null)
  const lastUpdatedAt = ref<string | null>(null)

  const { $fetch } = nuxtApp
  const notifications = useNotifications()

  const quickNotes = ref<string[]>([])
  const skipNextInstructionsSync = ref(false)
  const skipNextNotesSync = ref(false)

  const draftKey = computed(() => {
    if (!menuId.value) {
      return null
    }

    return `menu-quick-edit:draft:${encodeURIComponent(menuId.value)}`
  })

  const notesDraftKey = computed(() => {
    if (!menuId.value) {
      return null
    }

    return `menu-quick-edit:notes:${encodeURIComponent(menuId.value)}`
  })

  const skipDraftPersist = ref(false)

  function getDraftStorage() {
    if (!process.client) {
      return null
    }

    try {
      return window.localStorage
    } catch (error) {
      console.warn('Local storage is not accessible', error)
      return null
    }
  }

  function setInstructionsSilently(value: string) {
    if (instructions.value === value) {
      skipDraftPersist.value = false
      return false
    }

    skipDraftPersist.value = true
    instructions.value = value
    return true
  }

  function formatQuickNotes(notes: string[]) {
    return notes.map((entry, index) => `${index + 1}. ${entry}`).join('\n')
  }

  function parseQuickNotes(value: string) {
    return value
      .split(/\n+/)
      .map((line) => line.replace(/^[-•]\s+/, '').replace(/^\d+[\.)]\s+/, '').trim())
      .filter((line) => line.length > 0)
  }

  function readDraftFromStorage(id: string) {
    const storage = getDraftStorage()

    if (!storage) {
      return null
    }

    try {
      return storage.getItem(`menu-quick-edit:draft:${encodeURIComponent(id)}`)
    } catch (error) {
      console.warn('Failed to read quick edit draft', error)
      return null
    }
  }

  function persistDraft(value: string) {
    const storage = getDraftStorage()

    if (!storage || !draftKey.value) {
      return
    }

    try {
      storage.setItem(draftKey.value, value)
    } catch (error) {
      console.warn('Failed to persist quick edit draft', error)
    }
  }

  function readNotesFromStorage(id: string) {
    const storage = getDraftStorage()

    if (!storage) {
      return null
    }

    try {
      const stored = storage.getItem(`menu-quick-edit:notes:${encodeURIComponent(id)}`)

      if (!stored) {
        return null
      }

      const parsed = JSON.parse(stored)

      if (!Array.isArray(parsed)) {
        return []
      }

      return parsed
        .map((entry) => (typeof entry === 'string' ? entry : String(entry ?? '')))
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
    } catch (error) {
      console.warn('Failed to read quick edit notes', error)
      return []
    }
  }

  function persistNotes(notes: string[]) {
    const storage = getDraftStorage()

    if (!storage || !notesDraftKey.value) {
      return
    }

    try {
      if (!notes.length) {
        storage.removeItem(notesDraftKey.value)
        return
      }

      storage.setItem(notesDraftKey.value, JSON.stringify(notes))
    } catch (error) {
      console.warn('Failed to persist quick edit notes', error)
    }
  }

  function removeDraft() {
    const storage = getDraftStorage()

    if (!storage || !draftKey.value) {
      return
    }

    try {
      storage.removeItem(draftKey.value)
    } catch (error) {
      console.warn('Failed to remove quick edit draft', error)
    }
  }

  function removeNotes() {
    const storage = getDraftStorage()

    if (!storage || !notesDraftKey.value) {
      return
    }

    try {
      storage.removeItem(notesDraftKey.value)
    } catch (error) {
      console.warn('Failed to remove quick edit notes', error)
    }
  }

  function hydrateDraft() {
    if (!menuId.value) {
      return
    }

    const stored = readDraftFromStorage(menuId.value)

    if (stored !== null) {
      skipNextNotesSync.value = true
      const instructionsChanged = setInstructionsSilently(stored)

      if (!instructionsChanged) {
        skipNextNotesSync.value = false
      }
    }
  }

  function hydrateQuickNotes() {
    if (!menuId.value) {
      return
    }

    const stored = readNotesFromStorage(menuId.value)

    if (stored !== null) {
      skipNextInstructionsSync.value = true
      quickNotes.value = stored
    }
  }

  const state = reactive({
    isOpen,
    step,
    instructions,
    instructionsError,
    isRequestingDiff,
    isApplying,
    diff,
    selectedDiffIds,
    errorMessage,
    lastUpdatedAt,
    quickNotes
  })

  const isAvailable = computed(() => Boolean(menuId.value))

  watch(menuId, () => {
    if (!menuId.value && isOpen.value) {
      close()
    }
  })

  watch(instructions, (value) => {
    if (skipDraftPersist.value) {
      skipDraftPersist.value = false
    } else if (draftKey.value) {
      persistDraft(value)
    }

    if (skipNextNotesSync.value) {
      skipNextNotesSync.value = false
      return
    }

    const parsed = parseQuickNotes(value)
    skipNextInstructionsSync.value = true
    quickNotes.value = parsed
    persistNotes(parsed)
  })

  watch(menuId, (next) => {
    if (!next) {
      const instructionsChanged = setInstructionsSilently('')
      skipNextNotesSync.value = instructionsChanged

      if (quickNotes.value.length) {
        skipNextInstructionsSync.value = true
        quickNotes.value = []
      } else {
        skipNextInstructionsSync.value = false
      }

      return
    }

    const storedNotes = readNotesFromStorage(next)
    const storedDraft = readDraftFromStorage(next)

    if (storedNotes && storedNotes.length) {
      skipNextInstructionsSync.value = true
      quickNotes.value = storedNotes
      const formatted = formatQuickNotes(storedNotes)
      skipNextNotesSync.value = true
      const instructionsChanged = setInstructionsSilently(formatted)

      if (!instructionsChanged) {
        skipNextNotesSync.value = false
      }
    } else if (storedDraft !== null) {
      skipNextNotesSync.value = true
      const instructionsChanged = setInstructionsSilently(storedDraft)
      const parsed = parseQuickNotes(storedDraft)
      skipNextInstructionsSync.value = true
      quickNotes.value = parsed
      persistNotes(parsed)

      if (!instructionsChanged) {
        skipNextNotesSync.value = false
      }
    } else {
      skipNextNotesSync.value = true
      const instructionsChanged = setInstructionsSilently('')

      if (!instructionsChanged) {
        skipNextNotesSync.value = false
      }

      if (quickNotes.value.length) {
        skipNextInstructionsSync.value = true
        quickNotes.value = []
      } else {
        skipNextInstructionsSync.value = false
      }
    }
  }, { immediate: true })

  watch(quickNotes, (notes) => {
    if (skipNextInstructionsSync.value) {
      skipNextInstructionsSync.value = false
      return
    }

    const formatted = formatQuickNotes(notes)
    skipNextNotesSync.value = true
    const instructionsChanged = setInstructionsSilently(formatted)

    if (!instructionsChanged) {
      skipNextNotesSync.value = false
    } else if (draftKey.value) {
      persistDraft(formatted)
    }

    persistNotes(notes)
  })

  function clearInstructions() {
    removeDraft()
    removeNotes()
    const instructionsChanged = setInstructionsSilently('')
    skipNextNotesSync.value = instructionsChanged

    if (quickNotes.value.length) {
      skipNextInstructionsSync.value = true
      quickNotes.value = []
    } else {
      skipNextInstructionsSync.value = false
    }
    instructionsError.value = null
  }

  function close() {
    isOpen.value = false
    step.value = 'input'
    instructionsError.value = null
    isRequestingDiff.value = false
    isApplying.value = false
    diff.value = null
    selectedDiffIds.value = new Set<string>()
    errorMessage.value = null
    lastUpdatedAt.value = null
  }

  function open() {
    if (!isAvailable.value) {
      notifications.error('Быстрое редактирование доступно только для сохранённых меню.')
      return
    }

    hydrateDraft()
    hydrateQuickNotes()
    isOpen.value = true
    step.value = diff.value ? 'confirm' : 'input'
  }

  function validateInstructions() {
    if (!instructions.value.trim()) {
      instructionsError.value = 'Опишите, какие блюда обновить.'
      return false
    }

    if (instructions.value.trim().length < 20) {
      instructionsError.value = 'Добавьте больше контекста — минимум 20 символов.'
      return false
    }

    instructionsError.value = null
    return true
  }

  function handleFetchError(payload: FetchErrorPayload) {
    if (payload?.statusCode === 429) {
      const retry = payload.data?.retryAfter ?? 60
      return `Превышен лимит запросов. Попробуйте снова через ${retry} секунд.`
    }

    return (
      payload?.data?.message ||
      payload?.message ||
      payload?.statusMessage ||
      'Не удалось выполнить запрос. Попробуйте ещё раз.'
    )
  }

  async function requestDiff() {
    if (!menuId.value) {
      notifications.error('Идентификатор меню не найден. Обновите страницу и попробуйте снова.')
      return
    }

    const isValid = validateInstructions()

    if (!isValid) {
      return
    }

    isRequestingDiff.value = true
    errorMessage.value = null

    try {
      const response = await $fetch<QuickEditAiDiff>('/api/menu/ai-diff', {
        method: 'POST',
        body: {
          menuId: menuId.value,
          instructions: instructions.value.trim()
        }
      })

      diff.value = response
      lastUpdatedAt.value = response.generatedAt
      step.value = 'confirm'
      selectedDiffIds.value = new Set(response.items.filter((item) => item.canApply).map((item) => item.id))

      if (response.globalWarnings.length) {
        errorMessage.value = response.globalWarnings.join('\n')
      }
    } catch (error: any) {
      const message = handleFetchError(error?.response?._data ?? error?.data ?? error)
      errorMessage.value = message
      notifications.error(message)
    } finally {
      isRequestingDiff.value = false
    }
  }

  function toggleItem(id: string) {
    const next = new Set(selectedDiffIds.value)

    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }

    selectedDiffIds.value = next
  }

  function selectAll() {
    if (!diff.value) return
    selectedDiffIds.value = new Set(diff.value.items.filter((item) => item.canApply).map((item) => item.id))
  }

  function clearSelection() {
    selectedDiffIds.value = new Set()
  }

  function backToEdit() {
    step.value = 'input'
    errorMessage.value = null
  }

  function startOver() {
    step.value = 'input'
    clearInstructions()
    diff.value = null
    selectedDiffIds.value = new Set()
    errorMessage.value = null
  }

  function mergeLocalItems(payload: QuickEditApplyResponse) {
    const updates = new Map(payload.updatedItems.map((item) => [item.id, item]))

    menuItems.value = menuItems.value.map((entry) => {
      if (!entry.sourceId) {
        return entry
      }

      const updated = updates.get(entry.sourceId)

      if (!updated) {
        return entry
      }

      return {
        ...entry,
        price: updated.price,
        tags: updated.tags.join(', '),
        description: updated.description
      }
    })
  }

  const selectedItems = computed<QuickEditItemDiff[]>(() => {
    if (!diff.value) return []
    return diff.value.items.filter((item) => selectedDiffIds.value.has(item.id))
  })

  const canApply = computed(() => selectedItems.value.some((item) => item.canApply))

  async function applyChanges() {
    if (!diff.value || !menuId.value) {
      notifications.error('Нет данных для применения. Сначала запросите изменения.')
      return
    }

    const applicable = diff.value.items.filter((item) => selectedDiffIds.value.has(item.id) && item.canApply)

    if (!applicable.length) {
      notifications.error('Выберите хотя бы одно изменение для применения.')
      return
    }

    isApplying.value = true
    errorMessage.value = null

    try {
      const response = await $fetch<QuickEditApplyResponse>('/api/menu/apply-diff', {
        method: 'POST',
        body: {
          menuId: menuId.value,
          requestId: diff.value.requestId,
          items: applicable.map((item) => ({
            itemId: item.itemId!,
            changes: item.changes.map((change) => ({
              field: change.field,
              value: change.nextValue
            }))
          }))
        }
      })

      mergeLocalItems(response)
      notifications.success(`Изменения применены (${response.appliedCount} блюд).`)
      clearInstructions()
      step.value = 'success'
      lastUpdatedAt.value = new Date().toISOString()

      if (response.warnings.length) {
        errorMessage.value = response.warnings.join('\n')
      } else {
        errorMessage.value = null
      }
    } catch (error: any) {
      const message = handleFetchError(error?.response?._data ?? error?.data ?? error)
      errorMessage.value = message
      notifications.error(message)
    } finally {
      isApplying.value = false
    }
  }

  function addQuickNote(note: string) {
    const trimmed = note.trim()

    if (!trimmed) {
      return false
    }

    quickNotes.value = [...quickNotes.value, trimmed]
    void nuxtApp.callHook('analytics:quick-edit', {
      action: 'note_saved',
      notesCount: quickNotes.value.length,
      length: trimmed.length
    })

    return true
  }

  function removeQuickNote(index: number) {
    if (index < 0 || index >= quickNotes.value.length) {
      return
    }

    quickNotes.value = quickNotes.value.filter((_, entryIndex) => entryIndex !== index)

    void nuxtApp.callHook('analytics:quick-edit', {
      action: 'note_removed',
      notesCount: quickNotes.value.length
    })
  }

  function replaceQuickNotes(notes: string[]) {
    const normalized = notes.map((entry) => entry.trim()).filter((entry) => entry.length > 0)
    quickNotes.value = normalized

    void nuxtApp.callHook('analytics:quick-edit', {
      action: 'notes_replaced',
      notesCount: quickNotes.value.length
    })
  }

  return {
    state,
    isAvailable,
    open,
    close,
    clearInstructions,
    requestDiff,
    toggleItem,
    selectAll,
    clearSelection,
    backToEdit,
    startOver,
    applyChanges,
    canApply,
    selectedItems,
    instructionsLimit,
    menuTitle,
    addQuickNote,
    removeQuickNote,
    replaceQuickNotes
  }
}

export type MenuQuickEditBinding = ReturnType<typeof useMenuQuickEdit>
