<template>
  <div>
    <button
      v-if="quickEdit.isAvailable"
      type="button"
      class="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
      @click="quickEdit.open()"
    >
      <span aria-hidden="true" class="text-lg">✏️</span>
      <span class="hidden sm:inline">Быстрое редактирование</span>
    </button>

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
                          class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:cursor-not-allowed"
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
import { ref } from 'vue'

import type { MenuQuickEditBinding } from '~/composables/useMenuQuickEdit'

const props = defineProps<{
  quickEdit: MenuQuickEditBinding
}>()

const instructionsInput = ref<HTMLTextAreaElement | null>(null)

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

function handleClearInstructions() {
  quickEdit.clearInstructions()
  instructionsInput.value?.focus()
}
</script>


