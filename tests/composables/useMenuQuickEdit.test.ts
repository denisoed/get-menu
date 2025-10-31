import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref, type Ref } from 'vue'

import type { EditableMenuItem } from '~/types/admin-menu-editor'
import type { QuickEditAiDiff } from '~/types/menu-quick-edit'
import { useMenuQuickEdit } from '~/composables/useMenuQuickEdit'

const fetchMock = vi.fn()
const callHookMock = vi.fn()

vi.mock('#imports', () => ({
  useNuxtApp: () => ({
    $fetch: fetchMock,
    callHook: callHookMock
  })
}))

vi.mock('~/composables/useNotifications', () => ({
  useNotifications: () => ({
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn()
  })
}))

describe('useMenuQuickEdit draft persistence', () => {
  let storageMap: Map<string, string>
  let localStorageMock: Storage
  let setItemSpy: ReturnType<typeof vi.fn>

  async function flushReactivity() {
    await nextTick()
    await nextTick()
    await nextTick()
  }

  beforeEach(() => {
    fetchMock.mockReset()
    callHookMock.mockReset()
    storageMap = new Map<string, string>()

    const getItemSpy = vi.fn((key: string) => (storageMap.has(key) ? storageMap.get(key)! : null))
    setItemSpy = vi.fn((key: string, value: string) => {
      storageMap.set(key, value)
    })

    localStorageMock = {
      getItem: getItemSpy,
      setItem: setItemSpy,
      removeItem: vi.fn((key: string) => {
        storageMap.delete(key)
      }),
      clear: vi.fn(() => {
        storageMap.clear()
      }),
      key: vi.fn((index: number) => Array.from(storageMap.keys())[index] ?? null),
      get length() {
        return storageMap.size
      }
    } as Storage

    Object.defineProperty(globalThis, 'window', {
      value: { localStorage: localStorageMock },
      configurable: true
    })

    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      configurable: true
    })

    ;(process as any).client = true
  })

  function createBinding(menuIdValue: string, menuItems?: Ref<EditableMenuItem[]>) {
    const menuId = ref(menuIdValue)
    const menuTitle = ref('Тестовое меню')
    const items = menuItems ?? ref<EditableMenuItem[]>([])

    return useMenuQuickEdit({ menuId, menuTitle, menuItems: items })
  }

  it('restores stored draft and updates localStorage on change', async () => {
    const key = 'menu-quick-edit:draft:menu-42'
    storageMap.set(key, 'Сохранённый текст')

    const quickEdit = createBinding('menu-42')
    await flushReactivity()

    expect(quickEdit.state.instructions).toBe('Сохранённый текст')

    quickEdit.state.instructions = 'Новое описание меню'
    await flushReactivity()

    expect(storageMap.get(key)).toBe('Новое описание меню')
  })

  it('persists quick notes and formats instructions when saved via helper', async () => {
    const draftKey = 'menu-quick-edit:draft:menu-12'
    const notesKey = 'menu-quick-edit:notes:menu-12'
    const quickEdit = createBinding('menu-12')
    const note = 'Обновить описание и цену блюда до 360'

    await flushReactivity()

    const saved = quickEdit.addQuickNote(note)

    expect(saved).toBe(true)

    await flushReactivity()

    expect(quickEdit.state.quickNotes).toEqual([note])
    expect(quickEdit.state.instructions).toBe('1. Обновить описание и цену блюда до 360')
    expect(storageMap.get(draftKey)).toBe('1. Обновить описание и цену блюда до 360')
    expect(storageMap.get(notesKey)).toBe(JSON.stringify([note]))
    expect(callHookMock).toHaveBeenCalledTimes(1)
    expect(callHookMock).toHaveBeenCalledWith('analytics:quick-edit', {
      action: 'note_saved',
      notesCount: 1,
      length: note.length
    })
  })

  it('derives quick notes from manual instruction edits', async () => {
    const notesKey = 'menu-quick-edit:notes:menu-31'
    const quickEdit = createBinding('menu-31')

    await flushReactivity()

    quickEdit.state.instructions = '1. Первое изменение\n- Второе изменение'

    await flushReactivity()

    expect(quickEdit.state.quickNotes).toEqual(['Первое изменение', 'Второе изменение'])
    expect(storageMap.get(notesKey)).toBe(JSON.stringify(['Первое изменение', 'Второе изменение']))
  })

  it('removes individual quick notes and reports analytics event', async () => {
    const notesKey = 'menu-quick-edit:notes:menu-61'
    const quickEdit = createBinding('menu-61')

    await flushReactivity()

    quickEdit.addQuickNote('Первый пункт')
    quickEdit.addQuickNote('Второй пункт')

    await flushReactivity()

    expect(quickEdit.state.quickNotes).toEqual(['Первый пункт', 'Второй пункт'])
    expect(storageMap.get(notesKey)).toBe(JSON.stringify(['Первый пункт', 'Второй пункт']))

    callHookMock.mockClear()

    quickEdit.removeQuickNote(0)

    await flushReactivity()

    expect(quickEdit.state.quickNotes).toEqual(['Второй пункт'])
    expect(storageMap.get(notesKey)).toBe(JSON.stringify(['Второй пункт']))
    expect(callHookMock).toHaveBeenCalledWith('analytics:quick-edit', {
      action: 'note_removed',
      notesCount: 1
    })
  })

  it('clears draft manually without re-saving blank value', async () => {
    const key = 'menu-quick-edit:draft:menu-17'
    const quickEdit = createBinding('menu-17')

    await flushReactivity()

    quickEdit.state.instructions = 'Черновик для очистки'
    await flushReactivity()
    expect(setItemSpy).toHaveBeenCalled()
    expect(storageMap.get(key)).toBe('Черновик для очистки')

    quickEdit.clearInstructions()
    await flushReactivity()

    expect(quickEdit.state.instructions).toBe('')
    expect(quickEdit.state.quickNotes).toEqual([])
    expect(storageMap.has(key)).toBe(false)
    expect(storageMap.has('menu-quick-edit:notes:menu-17')).toBe(false)
  })

  it('removes draft from storage after successful apply', async () => {
    const menuItems = ref<EditableMenuItem[]>([
      {
        id: 'local-1',
        sourceId: 'dish-1',
        name: 'Блюдо',
        category: 'Основные',
        price: 310,
        img: '',
        tags: 'Хит',
        description: 'Старое описание',
        isCollapsed: false,
        options: {
          sizes: [],
          extras: []
        }
      }
    ])

    const key = 'menu-quick-edit:draft:menu-55'
    storageMap.set(key, 'Черновик для применения')

    const quickEdit = createBinding('menu-55', menuItems)
    await nextTick()

    expect(quickEdit.state.instructions).toBe('Черновик для применения')

    const diffPayload: QuickEditAiDiff = {
      requestId: 'req-1',
      menuId: 'menu-55',
      generatedAt: new Date().toISOString(),
      auditId: 'audit-1',
      promptTemplate: '',
      schemaDefinition: '',
      summary: '',
      instructionsEcho: '',
      items: [
        {
          id: 'diff-1',
          itemId: 'dish-1',
          itemName: 'Блюдо',
          confidence: 'exact',
          canApply: true,
          reason: 'test',
          changes: [
            {
              id: 'change-1',
              field: 'price',
              label: 'Цена',
              previousValue: 310,
              nextValue: 420
            }
          ],
          warnings: []
        }
      ],
      globalWarnings: []
    }

    const applyResponse = {
      menuId: 'menu-55',
      requestId: 'req-1',
      appliedCount: 1,
      updatedItems: [
        {
          id: 'dish-1',
          name: 'Блюдо',
          price: 420,
          tags: ['Хит'],
          description: 'Новое описание'
        }
      ],
      warnings: [],
      auditId: 'audit-1'
    }

    fetchMock.mockResolvedValueOnce(applyResponse)

    quickEdit.state.diff = diffPayload
    quickEdit.state.selectedDiffIds = new Set(['diff-1'])

    await quickEdit.applyChanges()

    expect(storageMap.has(key)).toBe(false)
    expect(quickEdit.state.instructions).toBe('')
  })
})
