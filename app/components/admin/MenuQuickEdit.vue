<template>
  <div>
    <div
      v-if="quickEdit.isAvailable"
      class="fixed bottom-6 right-6 z-50 flex flex-row-reverse items-stretch gap-3"
    >
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
        :aria-expanded="isInlineOpen"
        aria-controls="quick-edit-inline"
        @click="toggleInline"
      >
        <span aria-hidden="true" class="text-lg">✏️</span>
        <span class="hidden sm:inline">
          {{ isInlineOpen ? 'Скрыть быстрый ввод' : 'Быстрое редактирование' }}
        </span>
        <span class="sm:hidden">Правки</span>
        <span
          v-if="savedNotesCount"
          class="ml-2 hidden rounded-full bg-white/20 px-2 py-0.5 text-xs font-semibold text-white sm:inline-flex"
        >
          {{ savedNotesLabel }}
        </span>
      </button>

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-x-4 scale-95 opacity-0"
        enter-to-class="translate-x-0 scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-x-0 scale-100 opacity-100"
        leave-to-class="translate-x-2 scale-95 opacity-0"
      >
        <form
          v-if="isInlineOpen"
          id="quick-edit-inline"
          class="flex min-w-[18rem] max-w-[calc(100vw-3rem)] flex-col gap-2 rounded-3xl bg-white/95 p-4 text-sm shadow-soft ring-1 ring-slate-200 backdrop-blur dark:bg-slate-900/90 dark:text-slate-100 dark:ring-slate-700 sm:min-w-[22rem]"
          @submit.prevent="handleInlineSave"
        >
          <label class="sr-only" for="quick-edit-inline-input">Быстрая заметка для редактирования</label>
          <div class="flex items-center gap-2">
            <input
              id="quick-edit-inline-input"
              ref="inlineInput"
              v-model="inlineValue"
              type="text"
              class="h-11 flex-1 rounded-full border border-slate-300 bg-white/80 px-4 text-sm text-slate-700 shadow-inner-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-slate-600 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-brand-400 dark:focus:ring-brand-500"
              placeholder="Например: поднять цену на Пиццу Маргарита до 690"
              autocomplete="off"
              @keydown.esc.prevent="handleInlineCollapse"
            >
            <button
              type="submit"
              class="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              <span
                aria-hidden="true"
                class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white/70 transition dark:border-white/10"
                :class="savedIndicator ? 'border-white/60 bg-white text-brand-600 dark:bg-white/90 dark:text-brand-500' : ''"
              >
                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 13.5 9.5 18 19 8" />
                </svg>
              </span>
              <span>{{ savedIndicator ? 'Сохранено' : 'Сохранить' }}</span>
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span v-if="inlineError" class="text-red-500 dark:text-red-400">
              {{ inlineError }}
            </span>
            <span
              v-else-if="savedIndicator"
              class="text-emerald-600 dark:text-emerald-400"
              role="status"
            >
              Заметка добавлена
            </span>
            <span v-else-if="hasPendingDraft" class="text-slate-500 dark:text-slate-400">
              Несохранённый черновик
            </span>
            <span
              v-if="savedNotesCount"
              class="ml-auto inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              <span aria-hidden="true">•</span>
              {{ savedNotesLabel }}
            </span>
          </div>

          <div
            v-if="recentQuickNotes.length"
            class="max-h-32 space-y-1 overflow-hidden rounded-2xl bg-slate-100/70 p-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
          >
            <p class="text-[11px] uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
              Последние записи
            </p>
            <ol class="max-h-24 space-y-1 overflow-y-auto pr-1">
              <li
                v-for="note in recentQuickNotes"
                :key="`inline-note-${note.index}`"
                class="flex items-start gap-2"
              >
                <span class="font-semibold text-brand-600 dark:text-brand-300">{{ note.index + 1 }}.</span>
                <span class="flex-1 leading-snug">{{ note.value }}</span>
              </li>
            </ol>
          </div>

          <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 font-medium transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 dark:border-slate-600 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
              @click="handleOpenModalFromInline"
            >
              Просмотреть все правки
            </button>
            <button
              type="button"
              class="inline-flex items-center gap-1 rounded-full border border-transparent px-3 py-1 font-medium text-slate-500 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300 dark:text-slate-400 dark:hover:text-slate-200"
              @click="handleInlineCollapse"
            >
              Скрыть поле
            </button>
          </div>
        </form>
      </Transition>
    </div>

    <Teleport to="body">
      <div
        v-if="quickEdit.state.isOpen"
        id="adminMenuQuickEdit"
        class="fixed inset-0 z-50 flex items-end justify-center md:items-center"
      >
        <div class="absolute inset-0 bg-transparent backdrop-blur-sm" aria-hidden="true" @click="quickEdit.close()" />
        <div
          class="relative z-50 flex h-full w-full flex-col overflow-hidden rounded-none bg-white p-5 shadow-soft dark:bg-slate-950 dark:text-slate-100 md:h-auto md:w-[720px] md:max-h-[90vh] md:rounded-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-edit-title"
          tabindex="-1"
          @keyup.esc.prevent.stop="quickEdit.close()"
        >
          <header class="static flex items-start justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                Меню «{{ quickEdit.menuTitle || '...' }}»
              </p>
              <h2 id="quick-edit-title" class="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Быстрое редактирование
              </h2>
              <p v-if="quickEdit.state.lastUpdatedAt" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Последнее обновление {{ formatDate(quickEdit.state.lastUpdatedAt) }}
              </p>
            </div>
            <button
              type="button"
              class="relative h-10 w-10 rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900/80 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
              aria-label="Закрыть окно быстрого редактирования"
              @click="quickEdit.close()"
            >
              <span aria-hidden="true" class="pointer-events-none absolute inset-0 grid place-items-center text-xl leading-none">✕</span>
            </button>
          </header>

          <section class="mt-4 flex-1 overflow-hidden text-sm text-slate-700 dark:text-slate-300">
            <div v-if="quickEdit.state.step === 'input'" class="flex h-full flex-col">
              <div class="flex-1 overflow-y-auto">
                <div class="flex min-h-full flex-col gap-4">
                  <p>
                    Опишите на естественном языке, какие блюда и что нужно поменять. AI предложит список изменений
                    и попросит подтверждение.
                  </p>
                  <div
                    v-if="quickEdit.state.errorMessage"
                    class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
                  >
                    {{ quickEdit.state.errorMessage }}
                  </div>
                  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-400">
                    <p class="font-semibold text-slate-600 dark:text-slate-200">Примеры запросов:</p>
                    <ul class="mt-2 space-y-1">
                      <li>• «У блюда Пицца Маргарита подними цену до 690, добавь тег “Новинка”»</li>
                      <li>• «Бургер Классик: обнови описание, добавь, что котлета теперь из говядины»</li>
                    </ul>
                  </div>
                  <label class="flex flex-1 flex-col text-sm font-medium text-slate-700 dark:text-slate-200">
                    Инструкция для AI
                    <div class="relative mt-2 flex-1">
                      <textarea
                        ref="instructionsInput"
                        v-model="quickEdit.state.instructions"
                        class="flex min-h-[240px] w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 pr-12 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-brand-500"
                        :maxlength="quickEdit.instructionsLimit"
                        placeholder="Например: у блюда Пицца Маргарита подними цену до 690 и добавь тег новинка"
                        autocomplete="off"
                      />
                      <button
                        v-if="quickEdit.state.instructions"
                        type="button"
                        class="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-500 dark:hover:text-slate-200"
                        aria-label="Очистить текст инструкции"
                        title="Очистить текст инструкции"
                        @click="handleClearInstructions"
                      >
                        <span aria-hidden="true">✕</span>
                      </button>
                    </div>
                  </label>
                  <div class="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>{{ quickEdit.state.instructions.length }} / {{ quickEdit.instructionsLimit }} символов</span>
                    <span v-if="quickEdit.state.instructionsError" class="text-red-500 dark:text-red-400">
                      {{ quickEdit.state.instructionsError }}
                    </span>
                  </div>
                  <div
                    v-if="quickEdit.state.quickNotes.length"
                    class="mt-4 space-y-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-slate-700 dark:border-brand-400/30 dark:bg-brand-500/10 dark:text-slate-200"
                  >
                    <div class="flex items-center justify-between gap-3">
                      <p class="font-semibold text-brand-700 dark:text-brand-200">Сохранённые быстрые заметки</p>
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-brand-400/40 dark:text-brand-200 dark:hover:border-brand-300"
                        @click="handleClearNotes"
                      >
                        Очистить список
                      </button>
                    </div>
                    <ol class="space-y-2">
                      <li
                        v-for="(note, index) in quickEdit.state.quickNotes"
                        :key="`modal-note-${index}`"
                        class="flex items-start gap-3 rounded-xl bg-white/80 p-3 text-left shadow-inner-sm ring-1 ring-slate-100 dark:bg-slate-900/70 dark:ring-slate-800"
                      >
                        <span class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                          {{ index + 1 }}
                        </span>
                        <span class="flex-1 leading-relaxed">{{ note }}</span>
                        <button
                          type="button"
                          class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-transparent text-slate-400 transition hover:border-red-200 hover:text-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 dark:text-slate-500 dark:hover:border-red-400/40 dark:hover:text-red-300"
                          :aria-label="`Удалить заметку ${index + 1}`"
                          @click="handleRemoveNote(index)"
                        >
                          ✕
                        </button>
                      </li>
                    </ol>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                      Эти пункты уже добавлены в поле инструкции выше — отредактируйте текст перед отправкой, если нужно.
                    </p>
                  </div>
                  <div class="mt-auto bg-white pt-4 dark:bg-slate-950">
                    <button
                      type="button"
                      class="w-full rounded-xl bg-brand-600 py-3 text-white hover:bg-brand-700 disabled:opacity-50"
                      :disabled="quickEdit.state.isRequestingDiff"
                      @click="quickEdit.requestDiff()"
                    >
                      <span v-if="quickEdit.state.isRequestingDiff" class="mr-2 inline-block h-2 w-2 animate-ping rounded-full bg-white"></span>
                      Отправить на обработку
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="quickEdit.state.step === 'confirm'" class="h-full space-y-4 overflow-y-auto">
              <p class="text-sm">
                Проверьте предлагаемые изменения и снимите галочки с тех блюд, которые не нужно обновлять.
              </p>

              <div
                v-if="quickEdit.state.errorMessage"
                class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
              >
                {{ quickEdit.state.errorMessage }}
              </div>

              <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  class="rounded-full border border-slate-300 px-3 py-1 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                  @click="quickEdit.selectAll()"
                >
                  Выбрать все
                </button>
                <button
                  type="button"
                  class="rounded-full border border-slate-300 px-3 py-1 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                  @click="quickEdit.clearSelection()"
                >
                  Очистить
                </button>
              </div>

              <ul class="space-y-4">
                <li
                  v-for="item in quickEdit.state.diff?.items"
                  :key="item.id"
                  class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
                  :class="{
                    'bg-slate-50 dark:bg-slate-900/60': quickEdit.state.selectedDiffIds.has(item.id),
                    'opacity-60': !item.canApply
                  }"
                >
                  <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <label class="inline-flex items-center gap-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                        <input
                          type="checkbox"
                          :checked="quickEdit.state.selectedDiffIds.has(item.id)"
                          :disabled="!item.canApply"
                          class="h-4 w-4 rounded border-slate-300 focus:ring-brand-500 disabled:cursor-not-allowed"
                          @change="quickEdit.toggleItem(item.id)"
                        >
                        {{ item.itemName }}
                      </label>
                      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {{ item.reason }} · {{ confidenceLabel(item.confidence) }}
                      </p>
                    </div>
                    <div v-if="!item.canApply" class="text-xs font-medium text-amber-600 dark:text-amber-300">
                      Нельзя применить автоматически
                    </div>
                  </div>

                  <dl v-if="item.changes.length" class="mt-3 grid gap-3">
                    <div v-for="change in item.changes" :key="change.id" class="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                      <dt class="text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">
                        {{ change.label }}
                      </dt>
                      <dd class="mt-1 text-sm text-slate-700 dark:text-slate-200">
                        <span class="text-xs text-slate-500 dark:text-slate-400">Было:</span>
                        <span class="font-semibold">{{ formatValue(change.previousValue, change.unit) }}</span>
                        <span class="mx-2 text-slate-400">→</span>
                        <span class="text-xs text-slate-500 dark:text-slate-400">Станет:</span>
                        <span class="font-semibold text-brand-600 dark:text-brand-300">{{ formatValue(change.nextValue, change.unit) }}</span>
                      </dd>
                    </div>
                  </dl>

                  <ul v-if="item.warnings.length" class="mt-3 space-y-1 text-xs text-amber-600 dark:text-amber-300">
                    <li v-for="warning in item.warnings" :key="warning">⚠️ {{ warning }}</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div v-else class="h-full space-y-4 overflow-y-auto">
              <div class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                <p class="font-semibold">Изменения применены</p>
                <p class="mt-1">Проверьте блюда в списке — они уже обновлены. Вы всегда можете отправить ещё одну инструкцию.</p>
              </div>
              <div
                v-if="quickEdit.state.errorMessage"
                class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200"
              >
                {{ quickEdit.state.errorMessage }}
              </div>
            </div>
          </section>

          <footer
            v-if="quickEdit.state.step !== 'input'"
            class="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
          >
            <div v-if="quickEdit.state.step === 'confirm'" class="text-xs text-slate-500 dark:text-slate-400">
              Выбрано {{ quickEdit.selectedItems.length }} из {{ quickEdit.state.diff?.items.length || 0 }} блюд
            </div>
            <div v-else />

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                v-if="quickEdit.state.step === 'confirm'"
                type="button"
                class="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-slate-100"
                @click="quickEdit.backToEdit()"
              >
                Исправить запрос
              </button>
              <button
                v-if="quickEdit.state.step === 'confirm'"
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
                :disabled="!quickEdit.canApply || quickEdit.state.isApplying"
                @click="quickEdit.applyChanges()"
              >
                <span v-if="quickEdit.state.isApplying" class="mr-2 h-2 w-2 animate-ping rounded-full bg-white"></span>
                Применить изменения
              </button>
              <button
                v-else
                type="button"
                class="inline-flex items-center justify-center rounded-full bg-brand-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 dark:bg-brand-500 dark:hover:bg-brand-400"
                @click="quickEdit.startOver()"
              >
                Новая инструкция
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

import type { MenuQuickEditBinding } from '~/composables/useMenuQuickEdit'

const props = defineProps<{
  quickEdit: MenuQuickEditBinding
}>()

const instructionsInput = ref<HTMLTextAreaElement | null>(null)
const inlineInput = ref<HTMLInputElement | null>(null)
const isInlineOpen = ref(false)
const inlineValue = ref('')
const inlineError = ref<string | null>(null)
const savedIndicator = ref(false)
const savedIndicatorTimeout = ref<ReturnType<typeof window.setTimeout> | null>(null)

function formatValue(value: string | number | null, unit?: string) {
  if (value === null || value === '') {
    return '—'
  }

  if (typeof value === 'number') {
    return unit ? `${value} ${unit}` : value
  }

  return value
}

function confidenceLabel(value: string) {
  if (value === 'exact') return 'точное совпадение'
  if (value === 'fuzzy') return 'похоже на название блюда'
  return 'низкая уверенность'
}

function formatDate(value: string) {
  try {
    const formatter = new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'long',
      timeStyle: 'short'
    })
    return formatter.format(new Date(value))
  } catch (error) {
    return value
  }
}

const quickEdit = props.quickEdit
const savedNotesCount = computed(() => quickEdit.state.quickNotes.length)
const pluralRules = new Intl.PluralRules('ru-RU')
const savedNotesLabel = computed(() => {
  const count = savedNotesCount.value

  if (!count) {
    return ''
  }

  const form = pluralRules.select(count)

  if (form === 'one') {
    return `${count} запись`
  }

  if (form === 'few') {
    return `${count} записи`
  }

  return `${count} записей`
})

const recentQuickNotes = computed(() =>
  quickEdit.state.quickNotes.map((value, index) => ({ value, index })).slice(-3)
)

const hasPendingDraft = computed(() => inlineValue.value.trim().length > 0)

function handleClearInstructions() {
  quickEdit.clearInstructions()
  instructionsInput.value?.focus()
}

function focusInlineInput() {
  nextTick(() => {
    inlineInput.value?.focus()
  })
}

function openInline() {
  isInlineOpen.value = true
  focusInlineInput()
}

function handleInlineCollapse() {
  isInlineOpen.value = false
}

function toggleInline() {
  if (isInlineOpen.value) {
    handleInlineCollapse()
    return
  }

  openInline()
}

function resetSavedIndicator() {
  if (savedIndicatorTimeout.value !== null && typeof window !== 'undefined') {
    window.clearTimeout(savedIndicatorTimeout.value)
  }
  savedIndicatorTimeout.value = null
  savedIndicator.value = false
}

function scheduleSavedIndicatorHide() {
  resetSavedIndicator()

  if (typeof window === 'undefined') {
    savedIndicator.value = true
    return
  }

  savedIndicator.value = true
  savedIndicatorTimeout.value = window.setTimeout(() => {
    savedIndicator.value = false
    savedIndicatorTimeout.value = null
  }, 1800)
}

function handleInlineSave() {
  const trimmed = inlineValue.value.trim()

  if (!trimmed) {
    inlineError.value = 'Добавьте текст изменения.'
    return
  }

  const saved = quickEdit.addQuickNote(trimmed)

  if (!saved) {
    inlineError.value = 'Не удалось сохранить запись.'
    return
  }

  inlineValue.value = ''
  inlineError.value = null
  scheduleSavedIndicatorHide()
  focusInlineInput()
}

function handleOpenModalFromInline() {
  quickEdit.open()
  handleInlineCollapse()
  nextTick(() => {
    instructionsInput.value?.focus()
  })
}

function handleRemoveNote(index: number) {
  quickEdit.removeQuickNote(index)
}

function handleClearNotes() {
  quickEdit.replaceQuickNotes([])
  nextTick(() => {
    instructionsInput.value?.focus()
  })
}

watch(inlineValue, () => {
  inlineError.value = null

  if (savedIndicator.value) {
    resetSavedIndicator()
  }
})

onBeforeUnmount(() => {
  resetSavedIndicator()
})
</script>


