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

  const { $fetch } = useNuxtApp()
  const notifications = useNotifications()

  const draftKey = computed(() => {
    if (!menuId.value) {
      return null
    }

    return `menu-quick-edit:draft:${encodeURIComponent(menuId.value)}`
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
      return
    }

    skipDraftPersist.value = true
    instructions.value = value
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

  function hydrateDraft() {
    if (!menuId.value) {
      return
    }

    const stored = readDraftFromStorage(menuId.value)

    if (stored !== null) {
      setInstructionsSilently(stored)
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
    lastUpdatedAt
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
      return
    }

    if (!draftKey.value) {
      return
    }

    persistDraft(value)
  })

  watch(menuId, (next) => {
    if (!next) {
      setInstructionsSilently('')
      return
    }

    const stored = readDraftFromStorage(next)

    if (stored !== null) {
      setInstructionsSilently(stored)
    } else {
      setInstructionsSilently('')
    }
  }, { immediate: true })

  function clearInstructions() {
    removeDraft()
    setInstructionsSilently('')
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
        tagIds: [...updated.tagIds],
        tags: [...updated.tags],
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
    menuTitle
  }
}

export type MenuQuickEditBinding = ReturnType<typeof useMenuQuickEdit>
