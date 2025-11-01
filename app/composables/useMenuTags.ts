import { computed, ref } from 'vue'
import { useNuxtApp } from '#imports'
import { z } from 'zod'

import { useNotifications } from '~/composables/useNotifications'
import { TagModelListSchema, TagModelSchema } from '~/schemas/tags'
import type { EditableTag } from '~/types/admin-menu-editor'

const TagsListResponseSchema = z.object({
  tags: TagModelListSchema,
  error: z.any().nullable()
})

const TagResponseSchema = z.object({
  tag: TagModelSchema,
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

export function useMenuTags() {
  const nuxtApp = useNuxtApp()
  const request =
    nuxtApp?.$fetch ??
    (globalThis as unknown as { $fetch?: typeof $fetch }).$fetch

  if (!request) {
    throw new Error('Nuxt $fetch instance is not available.')
  }

  const notifications = useNotifications()

  const tags = ref<EditableTag[]>([])
  const isLoading = ref(false)
  const loadError = ref<string | null>(null)
  const isCreating = ref(false)
  const updatingTagId = ref<string | null>(null)
  const deletingTagId = ref<string | null>(null)

  async function loadTags() {
    try {
      isLoading.value = true
      loadError.value = null

      const response = await request('/api/admin/tags')
      const parsed = TagsListResponseSchema.parse(response)

      tags.value = parsed.tags
    } catch (error) {
      console.error('[client][tags] Failed to load tags', error)
      const message = extractErrorMessage(error, 'Не удалось загрузить теги.')
      loadError.value = message

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function createTag(name: string) {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new Error('Название тега обязательно.')
    }

    try {
      isCreating.value = true
      const response = await request('/api/admin/tags', {
        method: 'POST',
        body: { name: trimmedName }
      })

      const parsed = TagResponseSchema.parse(response)

      tags.value = [...tags.value, parsed.tag]

      if (process.client) {
        notifications.success('Тег добавлен.')
      }

      return parsed.tag
    } catch (error) {
      console.error('[client][tags] Failed to create tag', error)
      const message = extractErrorMessage(error, 'Не удалось создать тег.')

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      isCreating.value = false
    }
  }

  async function updateTagName(id: string, name: string, updatedAt: string) {
    const trimmedName = name.trim()

    if (!trimmedName) {
      throw new Error('Название тега обязательно.')
    }

    try {
      updatingTagId.value = id

      const response = await request(`/api/admin/tags/${id}`, {
        method: 'PATCH',
        body: {
          name: trimmedName,
          updatedAt
        }
      })

      const parsed = TagResponseSchema.parse(response)

      tags.value = tags.value.map((item) => (item.id === id ? parsed.tag : item))

      if (process.client) {
        notifications.success('Тег обновлён.')
      }

      return parsed.tag
    } catch (error) {
      console.error('[client][tags] Failed to update tag', error)
      const code = extractErrorCode(error)
      const message = extractErrorMessage(error, 'Не удалось обновить тег.')

      if (process.client) {
        notifications.error(message)
      }

      if (code === 'supabase_tag_conflict') {
        await loadTags()
      }

      throw error
    } finally {
      updatingTagId.value = null
    }
  }

  async function deleteTag(id: string) {
    try {
      deletingTagId.value = id

      const response = await request(`/api/admin/tags/${id}`, {
        method: 'DELETE'
      })

      const parsed = TagResponseSchema.parse(response)

      tags.value = tags.value.filter((item) => item.id !== id)

      if (process.client) {
        notifications.success('Тег удалён.')
      }

      return parsed.tag
    } catch (error) {
      console.error('[client][tags] Failed to delete tag', error)
      const message = extractErrorMessage(error, 'Не удалось удалить тег.')

      if (process.client) {
        notifications.error(message)
      }

      throw error
    } finally {
      deletingTagId.value = null
    }
  }

  const hasTags = computed(() => tags.value.length > 0)

  return {
    tags,
    hasTags,
    isLoading,
    loadError,
    isCreating,
    updatingTagId,
    deletingTagId,
    loadTags,
    reloadTags: loadTags,
    createTag,
    updateTagName,
    deleteTag
  }
}
