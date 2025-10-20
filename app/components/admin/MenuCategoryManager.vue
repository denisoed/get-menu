<template>
  <div class="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Категории блюд</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Создайте категории заранее, чтобы быстро распределять блюда по разделам.
        </p>
      </div>
      <form class="flex w-full gap-2 md:w-auto" @submit.prevent="addCategory">
        <label class="sr-only" for="new-category">Название категории</label>
        <input
          id="new-category"
          v-model="newCategoryName"
          type="text"
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500 md:w-56"
          placeholder="Например, Пицца"
          enterkeyhint="done"
        >
        <button
          type="submit"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
          :disabled="!newCategoryName.trim()"
        >
          Добавить
        </button>
      </form>
    </div>

    <div
      v-if="!hasCategories"
      class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
    >
      Создайте первую категорию, чтобы распределять блюда по разделам.
    </div>
    <ul v-else class="space-y-3">
      <li
        v-for="category in categories"
        :key="category.id"
        class="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex-1">
          <div v-if="editingCategoryId === category.id">
            <label class="sr-only" :for="`edit-category-${category.id}`">Редактировать категорию</label>
            <input
              :id="`edit-category-${category.id}`"
              v-model="editingCategoryName"
              type="text"
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500"
              placeholder="Название категории"
              enterkeyhint="done"
              @keyup.enter.prevent="saveCategoryEdit"
              @keyup.esc.prevent="cancelCategoryEdit"
              autofocus
            >
          </div>
          <div v-else class="text-sm font-medium text-slate-900 dark:text-slate-100">
            {{ category.name }}
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="editingCategoryId === category.id"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-brand-200 px-3 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-brand-400/40 dark:text-brand-300 dark:hover:bg-brand-500/10"
            @click="saveCategoryEdit"
          >
            Сохранить
          </button>
          <button
            v-if="editingCategoryId === category.id"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
            @click="cancelCategoryEdit"
          >
            Отмена
          </button>
          <button
            v-else
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
            @click="startCategoryEdit(category)"
          >
            Редактировать
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
            @click="removeCategory(category.id)"
          >
            Удалить
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { EditableCategory } from '~/types/admin-menu-editor'

const props = defineProps<{
  categories: EditableCategory[]
}>()

const emit = defineEmits<{
  (event: 'update:categories', value: EditableCategory[]): void
  (event: 'category-renamed', payload: { previousName: string; nextName: string }): void
  (event: 'category-removed', payload: { name: string }): void
}>()

const newCategoryName = ref('')
const editingCategoryId = ref<string | null>(null)
const editingCategoryName = ref('')

const categories = computed(() => props.categories)
const hasCategories = computed(() => categories.value.length > 0)

function createId () {
  return Math.random().toString(36).slice(2, 10)
}

function addCategory () {
  const name = newCategoryName.value.trim()
  if (!name) return

  const updated = [...categories.value, { id: createId(), name }]
  emit('update:categories', updated)
  newCategoryName.value = ''
}

function startCategoryEdit (category: EditableCategory) {
  editingCategoryId.value = category.id
  editingCategoryName.value = category.name
}

function cancelCategoryEdit () {
  editingCategoryId.value = null
  editingCategoryName.value = ''
}

function saveCategoryEdit () {
  if (!editingCategoryId.value) return

  const category = categories.value.find((item) => item.id === editingCategoryId.value)
  if (!category) {
    cancelCategoryEdit()
    return
  }

  const trimmedName = editingCategoryName.value.trim()
  if (!trimmedName) {
    removeCategory(category.id)
    return
  }

  const previousName = category.name
  if (previousName === trimmedName) {
    cancelCategoryEdit()
    return
  }

  const updated = categories.value.map((item) =>
    item.id === category.id
      ? { ...item, name: trimmedName }
      : item,
  )

  emit('update:categories', updated)
  emit('category-renamed', { previousName, nextName: trimmedName })
  cancelCategoryEdit()
}

function removeCategory (categoryId: string) {
  const index = categories.value.findIndex((item) => item.id === categoryId)
  if (index === -1) return

  const removedName = categories.value[index].name
  const updated = categories.value.filter((item) => item.id !== categoryId)
  emit('update:categories', updated)
  emit('category-removed', { name: removedName })

  if (editingCategoryId.value === categoryId) {
    cancelCategoryEdit()
  }
}

watch(categories, (next, prev) => {
  if (next === prev) return

  if (editingCategoryId.value && !next.some((item) => item.id === editingCategoryId.value)) {
    cancelCategoryEdit()
  }
})
</script>
