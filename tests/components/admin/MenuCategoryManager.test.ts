import { describe, expect, it, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import MenuCategoryManager from '~/components/admin/MenuCategoryManager.vue'
import type { EditableCategory } from '~/types/admin-menu-editor'

const baseCategory: EditableCategory = {
  id: '1',
  name: 'Бургеры',
  description: null,
  position: 1,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

describe('MenuCategoryManager', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  function mountComponent(overrides: Partial<InstanceType<typeof MenuCategoryManager>['$props']> = {}) {
    return mount(MenuCategoryManager, {
      props: {
        categories: [baseCategory],
        isLoading: false,
        loadError: null,
        isCreating: false,
        updatingCategoryId: null,
        deletingCategoryId: null,
        onReload: vi.fn().mockResolvedValue(undefined),
        onCreateCategory: vi.fn().mockResolvedValue(undefined),
        onUpdateCategory: vi.fn().mockResolvedValue(baseCategory),
        onDeleteCategory: vi.fn().mockResolvedValue(baseCategory),
        ...overrides
      }
    })
  }

  it('renders loading indicator when categories are loading', () => {
    const wrapper = mountComponent({ isLoading: true, categories: [] })

    expect(wrapper.text()).toContain('Загружаем категории…')
  })

  it('submits new category name', async () => {
    const onCreate = vi.fn().mockResolvedValue(undefined)
    const wrapper = mountComponent({ onCreateCategory: onCreate })

    const input = wrapper.get('#new-category')
    await input.setValue('  Новая категория  ')

    await wrapper.get('form').trigger('submit.prevent')

    expect(onCreate).toHaveBeenCalledWith('Новая категория')
    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('enters edit mode and saves changes', async () => {
    const updatedCategory = { ...baseCategory, name: 'Горячие блюда', updatedAt: '2024-01-02T00:00:00Z' }
    const onUpdate = vi.fn().mockResolvedValue(updatedCategory)
    const wrapper = mountComponent({ onUpdateCategory: onUpdate })

    const editButton = wrapper.findAll('button').find((button) => button.text() === 'Редактировать')
    expect(editButton).toBeDefined()
    await editButton!.trigger('click')

    const editInput = wrapper.get('input[id^="edit-category-"]')
    await editInput.setValue('Горячие блюда')

    const saveButton = wrapper.findAll('button').find((button) => button.text().includes('Сохранить'))
    expect(saveButton).toBeDefined()
    await saveButton!.trigger('click')

    expect(onUpdate).toHaveBeenCalledWith({
      id: baseCategory.id,
      name: 'Горячие блюда',
      updatedAt: baseCategory.updatedAt
    })
    expect(wrapper.find('input[id^="edit-category-"]').exists()).toBe(false)
  })

  it('confirms deletion before invoking handler', async () => {
    const onDelete = vi.fn().mockResolvedValue(baseCategory)
    const wrapper = mountComponent({ onDeleteCategory: onDelete })

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    const deleteButton = wrapper.findAll('button').find((button) => button.text().includes('Удалить'))
    expect(deleteButton).toBeDefined()
    await deleteButton!.trigger('click')

    expect(confirmSpy).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalledWith({ id: baseCategory.id })
  })
})
