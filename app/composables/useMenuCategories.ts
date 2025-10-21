import { computed, ref } from 'vue'
import { useNuxtApp } from '#imports'
import { z } from 'zod'

import { useNotifications } from '~/composables/useNotifications'
import { CategoryModelListSchema, CategoryModelSchema } from '~/schemas/categories'
import type { EditableCategory } from '~/types/admin-menu-editor'

const CategoriesListResponseSchema = z.object({
  categories: CategoryModelListSchema,
  error: z.any().nullable()
})

const CategoryResponseSchema = z.object({
  category: CategoryModelSchema,
  error: z.any().nullable()
})

function extractErrorMessage(error: unknown, fallback: string) {
  if (error && typeof error === 'object') {
    const candidate =
      (error as any).data?.statusMessage ??
      (error as any).statusMessage ??
      (error as any).data?.message ??
      (error as any).message

    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate
    }
  }

  return fallback
}

function extractErrorCode(error: unknown): string | null {
  if (error && typeof error === 'object') {
    const code = (error as any).data?.code ?? (error as any).code
    if (typeof code === 'string') {
      return code
    }
  }

  return null
}

export function useMenuCategories() {
  const { $fetch } = useNuxtApp()
  const notifications = useNotifications()

  const categories = ref<EditableCategory[]>([])
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const isCreating = ref(false)
  const updatingCategoryId = ref<string | null>(null)
  const deletingCategoryId = ref<string | null>(null)

  async function loadCategories() {
    try {
      isLoading.value = true
      loadError.value = null

      const response = await $fetch('/api/admin/categories')
      const parsed = CategoriesListResponseSchema.parse(response)

      categories.value = parsed.categories
    } catch (error) {
      console.error('[client][categories] Failed to load categories', error)
      const message = extractErrorMessage(error, 'Failed to load categories.')
      loadError.value = message

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(name: string) {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new Error('Category name is required.')
    }

    try {
      isCreating.value = true
      const response = await $fetch('/api/admin/categories', {
        method: 'POST',
        body: { name: trimmedName }
      })

      const parsed = CategoryResponseSchema.parse(response)

      categories.value = [...categories.value, parsed.category]

      if (process.client) {
        notifications.success('Category created.')
      }

      return parsed.category
    } catch (error) {
      console.error('[client][categories] Failed to create category', error)
      const message = extractErrorMessage(error, 'Failed to create category.')

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      isCreating.value = false
    }
  }

  async function updateCategoryName(id: string, name: string, updatedAt: string) {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new Error('Category name is required.')
    }

    try {
      updatingCategoryId.value = id

      const response = await $fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        body: {
          name: trimmedName,
          updatedAt
        }
      })

      const parsed = CategoryResponseSchema.parse(response)

      categories.value = categories.value.map((item) =>
        item.id === id ? parsed.category : item
      )

      if (process.client) {
        notifications.success('Category updated.')
      }

      return parsed.category
    } catch (error) {
      console.error('[client][categories] Failed to update category', error)
      const code = extractErrorCode(error)
      const message = extractErrorMessage(error, 'Failed to update category.')

      if (process.client) {
        notifications.error(message)
      }

      if (code === 'supabase_category_conflict') {
        await loadCategories()
      }

      throw error
    } finally {
      updatingCategoryId.value = null
    }
  }

  async function deleteCategory(id: string) {
    try {
      deletingCategoryId.value = id

      const response = await $fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE'
      })

      const parsed = CategoryResponseSchema.parse(response)

      categories.value = categories.value.filter((item) => item.id !== id)

      if (process.client) {
        notifications.success('Category deleted.')
      }

      return parsed.category
    } catch (error) {
      console.error('[client][categories] Failed to delete category', error)
      const message = extractErrorMessage(error, 'Failed to delete category.')

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      deletingCategoryId.value = null
    }
  }

  const hasCategories = computed(() => categories.value.length > 0)

  return {
    categories,
    hasCategories,
    isLoading,
    loadError,
    isCreating,
    updatingCategoryId,
    deletingCategoryId,
    loadCategories,
    reloadCategories: loadCategories,
    createCategory,
    updateCategoryName,
    deleteCategory
  }
}
