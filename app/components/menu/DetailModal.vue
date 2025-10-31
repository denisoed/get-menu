<template>
  <div
    v-if="isOpen && item"
    class="fixed inset-0 z-50 flex items-end md:items-center justify-center"
  >
    <div class="absolute inset-0 bg-transparent backdrop-blur-sm" @click="close"></div>
    <div class="relative w-full md:w-[720px] h-full md:h-auto md:max-h-[90vh] overflow-y-auto bg-white rounded-none md:rounded-2xl shadow-soft p-5 dark:bg-slate-950 dark:text-slate-100">
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ item.category }}</div>
          <h3 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ item.name }}</h3>
        </div>
        <button
          class="relative h-10 w-10 rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900/80 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
          @click="close"
          aria-label="Закрыть"
        >
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 grid place-items-center text-xl leading-none"
          >
            ✕
          </span>
        </button>
      </div>

      <div class="mt-5 grid gap-5 md:grid-cols-[minmax(0,_320px)_1fr]">
        <div class="space-y-3">
          <div class="relative overflow-hidden rounded-2xl bg-slate-100 aspect-square">
            <img :src="item.img" :alt="item.name" class="h-full w-full object-cover" />
            <button
              v-if="item"
              type="button"
              class="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full shadow-md ring-1 backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-brand-500"
              :class="isFavorite
                ? 'bg-brand-600 text-white ring-brand-500 hover:bg-brand-700 dark:bg-brand-500 dark:text-slate-950 dark:ring-brand-400 dark:hover:bg-brand-400'
                : 'bg-white/90 text-slate-500 ring-slate-200 hover:bg-white hover:text-brand-600 dark:bg-slate-950/80 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-900 dark:hover:text-brand-300'"
              :aria-pressed="isFavorite"
              :title="favoriteLabel"
              @click="toggleFavorite"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  v-if="isFavorite"
                  d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656l-6.01 6.01a.75.75 0 0 1-1.06 0l-6.01-6.01a4 4 0 0 1 0-5.656Z"
                />
                <path
                  v-else
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656l-6.01 6.01a.75.75 0 0 1-1.06 0l-6.01-6.01a4 4 0 0 1 0-5.656Zm1.06 1.06a2.5 2.5 0 0 0 0 3.536L10 15.475l5.768-5.707a2.5 2.5 0 0 0-3.536-3.536L10 8.465l-1.232-1.231a2.5 2.5 0 0 0-3.536 0Z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="sr-only">{{ favoriteLabel }}</span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-5">
          <div class="space-y-3">
            <div class="text-sm text-slate-500 dark:text-slate-400">Цена</div>
            <div class="text-3xl font-semibold text-slate-900 dark:text-slate-100">{{ formatPrice(totalPrice) }}</div>
            <p v-if="item.description" class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {{ item.description }}
            </p>
          </div>

          <div class="space-y-4">
            <div v-if="sizeOptions.length" class="space-y-2">
              <div class="text-sm font-medium text-slate-700 dark:text-slate-200">Размер</div>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  v-for="(size, index) in sizeOptions"
                  :key="size.label"
                  type="button"
                  class="rounded-xl border px-3 py-2 text-left text-sm transition"
                  :class="selectedSizeIdx === index
                    ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-500 dark:bg-brand-900/30 dark:text-brand-200'
                    : 'border-slate-200 text-slate-600 hover:border-brand-200 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-500'"
                  @click="selectSize(index)"
                >
                  <div class="font-medium">{{ size.label }}</div>
                  <div v-if="size.add" class="text-xs text-slate-500 dark:text-slate-400">+{{ formatPrice(size.add) }}</div>
                </button>
              </div>
            </div>

            <div v-if="extrasOptions.length" class="space-y-2">
              <div class="text-sm font-medium text-slate-700 dark:text-slate-200">Добавки</div>
              <div class="grid gap-2 sm:grid-cols-2">
                <label
                  v-for="(extra, index) in extrasOptions"
                  :key="extra.label"
                  class="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
                >
                  <input
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-900"
                    :value="index"
                    :checked="selectedExtrasIdx.includes(index)"
                    @change="toggleExtra(index)"
                  />
                  <div class="flex-1">
                    <div class="font-medium">{{ extra.label }}</div>
                    <div v-if="extra.add" class="text-xs text-slate-500 dark:text-slate-400">+{{ formatPrice(extra.add) }}</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 mt-auto flex flex-nowrap items-center gap-3 bg-white dark:bg-slate-950">
            <UiQuantitySelector
              v-model="quantity"
              class="shrink-0"
            />
            <button
              class="flex-1 rounded-xl bg-brand-600 py-3 text-white hover:bg-brand-700"
              @click="handleAddToCart"
            >
              В корзину
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { MenuItem } from '~/types/menu'

interface Props {
  isOpen: boolean
  item: MenuItem | null
  formatPrice: (price: number) => string
  isFavorite: (id: string) => boolean
}

const props = defineProps<Props>()
const formatPrice = (price: number) => props.formatPrice(price)
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-to-cart', payload: { id: string; sizeIdx: number | null; extrasIdx: number[]; quantity: number }): void
  (e: 'toggle-favorite', id: string): void
}>()

const selectedSizeIdx = ref<number | null>(null)
const selectedExtrasIdx = ref<number[]>([])
const quantity = ref(1)

const sizeOptions = computed(() => props.item?.options?.sizes ?? [])
const extrasOptions = computed(() => props.item?.options?.extras ?? [])

watch(() => props.item, (next) => {
  if (!next) {
    selectedSizeIdx.value = null
    selectedExtrasIdx.value = []
    quantity.value = 1
    return
  }

  selectedSizeIdx.value = next.options?.sizes?.length ? 0 : null
  selectedExtrasIdx.value = []
  quantity.value = 1
}, { immediate: true })

const basePrice = computed(() => props.item?.price ?? 0)

const selectedSizePrice = computed(() => {
  if (!props.item || selectedSizeIdx.value === null) return 0
  return props.item.options?.sizes?.[selectedSizeIdx.value]?.add ?? 0
})

const selectedExtrasPrice = computed(() => {
  if (!props.item?.options?.extras?.length) return 0
  return selectedExtrasIdx.value.reduce((total, extraIdx) => {
    const extra = props.item?.options?.extras?.[extraIdx]
    return total + (extra?.add ?? 0)
  }, 0)
})

const unitPrice = computed(() => basePrice.value + selectedSizePrice.value + selectedExtrasPrice.value)

const totalPrice = computed(() => unitPrice.value * quantity.value)

const isFavorite = computed(() => {
  if (!props.item) return false
  return props.isFavorite(props.item.id)
})

const favoriteLabel = computed(() => {
  if (!props.item) return 'В избранное'
  return isFavorite.value ? 'В избранном' : 'В избранное'
})

function selectSize (index: number) {
  selectedSizeIdx.value = index
}

function toggleExtra (index: number) {
  if (selectedExtrasIdx.value.includes(index)) {
    selectedExtrasIdx.value = selectedExtrasIdx.value.filter(item => item !== index)
  } else {
    selectedExtrasIdx.value = [...selectedExtrasIdx.value, index]
  }
}

function close () {
  emit('close')
}

function handleAddToCart () {
  if (!props.item) return
  emit('add-to-cart', {
    id: props.item.id,
    sizeIdx: selectedSizeIdx.value,
    extrasIdx: [...selectedExtrasIdx.value].sort((a, b) => a - b),
    quantity: quantity.value,
  })
  close()
}

function toggleFavorite () {
  if (!props.item) return
  emit('toggle-favorite', props.item.id)
}
</script>
