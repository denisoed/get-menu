<template>
  <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Теги</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Создайте теги заранее, чтобы быстро отмечать ими блюда.
        </p>
      </div>
      <form
        class="flex w-full flex-col gap-2 md:w-auto md:flex-row"
        :aria-busy="isLoading || isCreating"
        @submit.prevent="addTag"
      >
        <div class="flex-1">
          <label class="sr-only" for="new-tag">Название тега</label>
          <input
            id="new-tag"
            v-model="newTagName"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500 md:w-56"
            placeholder="Например, Хит"
            :disabled="isLoading || isCreating"
            maxlength="24"
            enterkeyhint="done"
          >
        </div>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
          :disabled="isLoading || isCreating || !newTagName.trim()"
        >
          <span v-if="isCreating" class="inline-flex items-center gap-2"><span class="h-2 w-2 animate-ping rounded-full bg-white"></span>Сохраняем…</span>
          <span v-else>Добавить</span>
        </button>
        <p v-if="formError" class="text-xs text-red-600 dark:text-red-300">{{ formError }}</p>
      </form>
    </div>

    <div v-if="isLoading" class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span class="h-2 w-2 animate-ping rounded-full bg-brand-500"></span>
      <span>Загружаем теги…</span>
    </div>

    <div v-else-if="loadError" class="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
      <span>{{ loadError }}</span>
      <button
        type="button"
        class="inline-flex w-fit items-center gap-2 rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/60 dark:text-red-200"
        :disabled="isLoading"
        @click="reloadTags"
      >
        Повторить загрузку
      </button>
    </div>

    <div
      v-else-if="!tags.length"
      class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      Добавьте первый тег, чтобы отмечать популярные блюда, острые позиции и другие особенности.
    </div>

    <div v-else class="space-y-3">
      <p v-if="listError" class="text-xs text-red-600 dark:text-red-300">{{ listError }}</p>
      <ul class="space-y-3">
        <li
          v-for="tag in tags"
          :key="tag.id"
          class="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1">
            <div v-if="editingTagId === tag.id" class="space-y-2">
              <label class="sr-only" :for="`edit-tag-${tag.id}`">Редактировать тег</label>
              <input
                :id="`edit-tag-${tag.id}`"
                v-model="editingTagName"
                type="text"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500"
                placeholder="Название тега"
                maxlength="24"
                enterkeyhint="done"
                :disabled="isProcessingUpdate(tag.id)"
                @keyup.enter.prevent="saveTagEdit"
                @keyup.esc.prevent="cancelTagEdit"
                autofocus
              >
              <p v-if="editError" class="text-xs text-red-600 dark:text-red-300">{{ editError }}</p>
            </div>
            <div v-else class="text-sm font-medium text-slate-900 dark:text-slate-100">
              {{ tag.name }}
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="editingTagId === tag.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-brand-200 px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:border-brand-400/40 dark:text-brand-300 dark:hover:bg-brand-500/10"
              :disabled="isProcessingUpdate(tag.id)"
              @click="saveTagEdit"
            >
              <span v-if="isProcessingUpdate(tag.id)">Сохраняем…</span>
              <span v-else>Сохранить</span>
            </button>
            <button
              v-if="editingTagId === tag.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              :disabled="isProcessingUpdate(tag.id)"
              @click="cancelTagEdit"
            >
              Отмена
            </button>
            <button
              v-else
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              :disabled="isProcessingAny"
              @click="startTagEdit(tag)"
            >
              Редактировать
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              :disabled="isProcessingDelete(tag.id) || isProcessingAny"
              @click="removeTag(tag)"
            >
              <span v-if="isProcessingDelete(tag.id)">Удаляем…</span>
              <span v-else>Удалить</span>
            </button>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import type { EditableTag } from '~/types/admin-menu-editor'

interface UpdatePayload {
  id: string
  name: string
  updatedAt: string
}

interface DeletePayload {
  id: string
}

const props = defineProps<{
  tags: EditableTag[]
  isLoading: boolean
  loadError: string | null
  isCreating: boolean
  updatingTagId: string | null
  deletingTagId: string | null
  onReload: () => Promise<void>
  onCreateTag: (name: string) => Promise<unknown>
  onUpdateTag: (payload: UpdatePayload) => Promise<unknown>
  onDeleteTag: (payload: DeletePayload) => Promise<unknown>
}>()

const newTagName = ref('')
const formError = ref<string | null>(null)
const editError = ref<string | null>(null)
const listError = ref<string | null>(null)
const editingTagId = ref<string | null>(null)
const editingTagName = ref('')

const tags = computed(() => props.tags)
const isProcessingAny = computed(() => props.isCreating || Boolean(props.updatingTagId) || Boolean(props.deletingTagId))

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

  if (error instanceof Error && error.message) {
    return error.message
  }

  return fallback
}

async function reloadTags() {
  listError.value = null
  try {
    await props.onReload()
  } catch (error) {
    listError.value = extractErrorMessage(error, 'Не удалось обновить список тегов.')
  }
}

async function addTag() {
  if (!newTagName.value.trim()) {
    formError.value = 'Название тега обязательно.'
    return
  }

  formError.value = null

  try {
    await props.onCreateTag(newTagName.value)
    newTagName.value = ''
  } catch (error) {
    formError.value = extractErrorMessage(error, 'Не удалось создать тег.')
  }
}

function startTagEdit(tag: EditableTag) {
  editingTagId.value = tag.id
  editingTagName.value = tag.name
  editError.value = null
}

function cancelTagEdit() {
  editingTagId.value = null
  editingTagName.value = ''
  editError.value = null
}

async function saveTagEdit() {
  if (!editingTagId.value) {
    return
  }

  const trimmed = editingTagName.value.trim()

  if (!trimmed) {
    editError.value = 'Название тега обязательно.'
    return
  }

  editError.value = null

  const current = tags.value.find((tag) => tag.id === editingTagId.value)

  if (!current) {
    editError.value = 'Тег не найден.'
    return
  }

  try {
    await props.onUpdateTag({
      id: editingTagId.value,
      name: trimmed,
      updatedAt: current.updatedAt
    })
    cancelTagEdit()
  } catch (error) {
    editError.value = extractErrorMessage(error, 'Не удалось обновить тег.')
  }
}

async function removeTag(tag: EditableTag) {
  listError.value = null
  try {
    await props.onDeleteTag({ id: tag.id })
  } catch (error) {
    listError.value = extractErrorMessage(error, 'Не удалось удалить тег.')
  }
}

function isProcessingUpdate(id: string) {
  return props.updatingTagId === id
}

function isProcessingDelete(id: string) {
  return props.deletingTagId === id
}

watch(() => props.loadError, (value) => {
  if (!value) {
    listError.value = null
  }
})
</script>
