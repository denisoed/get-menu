<template>
  <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Категории блюд</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Создайте категории заранее, чтобы быстро распределять блюда по разделам.
        </p>
      </div>
      <form
        class="flex w-full flex-col gap-2 md:w-auto md:flex-row"
        :aria-busy="isLoading || isCreating"
        @submit.prevent="addCategory"
      >
        <div class="flex-1">
          <label class="sr-only" for="new-category">Название категории</label>
          <input
            id="new-category"
            v-model="newCategoryName"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500 md:w-56"
            placeholder="Например, Пицца"
            :disabled="isLoading || isCreating"
            enterkeyhint="done"
          >
        </div>
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
          :disabled="isLoading || isCreating || !newCategoryName.trim()"
        >
          <span v-if="isCreating" class="inline-flex items-center gap-2"><span class="h-2 w-2 animate-ping rounded-full bg-white"></span>Сохраняем…</span>
          <span v-else>Добавить</span>
        </button>
        <p v-if="formError" class="text-xs text-red-600 dark:text-red-300">{{ formError }}</p>
      </form>
    </div>

    <div v-if="isLoading" class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <span class="h-2 w-2 animate-ping rounded-full bg-brand-500"></span>
      <span>Загружаем категории…</span>
    </div>

    <div v-else-if="loadError" class="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200">
      <span>{{ loadError }}</span>
      <button
        type="button"
        class="inline-flex w-fit items-center gap-2 rounded-lg border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/60 dark:text-red-200"
        :disabled="isLoading"
        @click="reloadCategories"
      >
        Повторить загрузку
      </button>
    </div>

    <div
      v-else-if="!categories.length"
      class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      Создайте первую категорию, чтобы распределять блюда по разделам.
    </div>

    <div v-else class="space-y-3">
      <p v-if="listError" class="text-xs text-red-600 dark:text-red-300">{{ listError }}</p>
      <ul class="space-y-3">
        <li
          v-for="category in categories"
          :key="category.id"
          class="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between"
        >
          <div class="flex-1">
            <div v-if="editingCategoryId === category.id" class="space-y-2">
              <label class="sr-only" :for="`edit-category-${category.id}`">Редактировать категорию</label>
              <input
                :id="`edit-category-${category.id}`"
                v-model="editingCategoryName"
                type="text"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500"
                placeholder="Название категории"
                enterkeyhint="done"
                :disabled="isProcessingUpdate(category.id)"
                @keyup.enter.prevent="saveCategoryEdit"
                @keyup.esc.prevent="cancelCategoryEdit"
                autofocus
              >
              <p v-if="editError" class="text-xs text-red-600 dark:text-red-300">{{ editError }}</p>
            </div>
            <div v-else class="text-sm font-medium text-slate-900 dark:text-slate-100">
              {{ category.name }}
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-if="editingCategoryId === category.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-brand-200 px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:border-brand-400/40 dark:text-brand-300 dark:hover:bg-brand-500/10"
              :disabled="isProcessingUpdate(category.id)"
              @click="saveCategoryEdit"
            >
              <span v-if="isProcessingUpdate(category.id)">Сохраняем…</span>
              <span v-else>Сохранить</span>
            </button>
            <button
              v-if="editingCategoryId === category.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              :disabled="isProcessingUpdate(category.id)"
              @click="cancelCategoryEdit"
            >
              Отмена
            </button>
            <button
              v-else
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              :disabled="isProcessingAny"
              @click="startCategoryEdit(category)"
            >
              Редактировать
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:opacity-60 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              :disabled="isProcessingDelete(category.id) || isProcessingAny"
              @click="removeCategory(category)"
            >
              <span v-if="isProcessingDelete(category.id)">Удаляем…</span>
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

import type { EditableCategory } from '~/types/admin-menu-editor'

interface UpdatePayload {
  id: string
  name: string
  updatedAt: string
}

interface DeletePayload {
  id: string
}

const props = defineProps<{
  categories: EditableCategory[]
  isLoading: boolean
  loadError: string | null
  isCreating: boolean
  updatingCategoryId: string | null
  deletingCategoryId: string | null
  onReload: () => Promise<void>
  onCreateCategory: (name: string) => Promise<unknown>
  onUpdateCategory: (payload: UpdatePayload) => Promise<unknown>
  onDeleteCategory: (payload: DeletePayload) => Promise<unknown>
}>()

const newCategoryName = ref('')
const formError = ref<string | null>(null)
const editError = ref<string | null>(null)
const listError = ref<string | null>(null)
const editingCategoryId = ref<string | null>(null)
const editingCategoryName = ref('')

const categories = computed(() => props.categories)
const isProcessingAny = computed(() => props.isCreating || Boolean(props.updatingCategoryId) || Boolean(props.deletingCategoryId))

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

async function reloadCategories() {
  listError.value = null
  try {
    await props.onReload()
  } catch (error) {
    listError.value = extractErrorMessage(error, 'Failed to refresh categories.')
  }
}

async function addCategory() {
  const trimmedName = newCategoryName.value.trim()

  if (!trimmedName) {
    formError.value = 'Enter a category name.'
    return
  }

  formError.value = null

  try {
    await props.onCreateCategory(trimmedName)
    newCategoryName.value = ''
  } catch (error) {
    formError.value = extractErrorMessage(error, 'Failed to create category.')
  }
}

function startCategoryEdit(category: EditableCategory) {
  editingCategoryId.value = category.id
  editingCategoryName.value = category.name
  editError.value = null
}

function cancelCategoryEdit() {
  editingCategoryId.value = null
  editingCategoryName.value = ''
  editError.value = null
}

function isProcessingUpdate(id: string) {
  return props.updatingCategoryId === id
}

function isProcessingDelete(id: string) {
  return props.deletingCategoryId === id
}

async function saveCategoryEdit() {
  if (!editingCategoryId.value) return

  const current = categories.value.find((item) => item.id === editingCategoryId.value)
  if (!current) {
    cancelCategoryEdit()
    return
  }

  const trimmedName = editingCategoryName.value.trim()

  if (!trimmedName) {
    editError.value = 'Enter a category name.'
    return
  }

  if (trimmedName === current.name) {
    cancelCategoryEdit()
    return
  }

  try {
    await props.onUpdateCategory({
      id: current.id,
      name: trimmedName,
      updatedAt: current.updatedAt
    })
    cancelCategoryEdit()
  } catch (error) {
    editError.value = extractErrorMessage(error, 'Failed to update category.')
  }
}

async function removeCategory(category: EditableCategory) {
  const confirmed = window.confirm(`Delete category "${category.name}"? This action cannot be undone.`)
  if (!confirmed) return

  listError.value = null

  try {
    await props.onDeleteCategory({ id: category.id })
    if (editingCategoryId.value === category.id) {
      cancelCategoryEdit()
    }
  } catch (error) {
    listError.value = extractErrorMessage(error, 'Failed to delete category.')
  }
}

watch(
  () => props.categories,
  (next, prev) => {
    if (next === prev) return

    if (editingCategoryId.value) {
      const current = next.find((item) => item.id === editingCategoryId.value)
      if (!current) {
        cancelCategoryEdit()
        return
      }

      editingCategoryName.value = current.name
    }
  },
  { deep: true }
)
</script>
