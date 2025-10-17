<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-transparent backdrop-blur-sm" @click="close"></div>
    <div class="relative bg-white w-[92vw] max-w-md rounded-2xl p-5 shadow-soft dark:bg-slate-950 dark:text-slate-100">
      <div class="flex items-start justify-between">
        <div class="font-semibold text-lg text-slate-900 dark:text-slate-100">{{ item.name }}</div>
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

      <div class="space-y-2 mt-4 text-slate-700 dark:text-slate-200">
        <!-- Size selection -->
        <label v-if="item.options?.sizes?.length" class="text-sm block">
          Размер
          <select 
            v-model="selectedSizeIndex" 
            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
          >
            <option 
              v-for="(size, index) in item.options.sizes" 
              :key="index" 
              :value="index"
            >
              {{ size.label }} {{ size.add ? `(+${formatPrice(size.add)})` : '' }}
            </option>
          </select>
        </label>
        
        <!-- Extras selection -->
        <div v-if="item.options?.extras?.length" class="text-sm">
          Добавки
          <div class="mt-1 grid grid-cols-2 gap-2">
            <label
              v-for="(extra, index) in item.options.extras"
              :key="index"
              class="flex gap-2 items-center text-sm border rounded-xl px-3 py-2 dark:border-slate-700 dark:bg-slate-900/60"
            >
              <input 
                type="checkbox" 
                :value="index" 
                v-model="selectedExtrasIndexes"
                class="extraCheck"
              >
              {{ extra.label }} {{ extra.add ? `(+${formatPrice(extra.add)})` : '' }}
            </label>
          </div>
        </div>
      </div>
      
      <div class="mt-4 flex gap-2">
        <button 
          class="px-4 py-2 rounded-xl bg-brand-600 text-white" 
          @click="addToCart"
        >
          Добавить
        </button>
        <button 
          class="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200"
          @click="close"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBodyScrollLock } from '~/composables/useBodyScrollLock'

interface MenuItem {
  id: string
  name: string
  price: number
  options?: {
    sizes?: Array<{ label: string; add?: number }>
    extras?: Array<{ label: string; add?: number }>
  }
}

interface Props {
  isVisible: boolean
  item: MenuItem | null
  formatPrice: (price: number) => string
}

interface Emits {
  (e: 'close'): void
  (e: 'add-to-cart', data: { id: string; sizeIdx: number | null; extrasIdx: number[] }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const selectedSizeIndex = ref<number | null>(null)
const selectedExtrasIndexes = ref<number[]>([])

useBodyScrollLock(() => props.isVisible)

// Initialize selected values when item changes
watch(() => props.item, (newItem) => {
  if (newItem?.options?.sizes?.length) {
    selectedSizeIndex.value = 0
  } else {
    selectedSizeIndex.value = null
  }
  selectedExtrasIndexes.value = []
}, { immediate: true })

function close() {
  emit('close')
}

function addToCart() {
  if (!props.item) return
  
  emit('add-to-cart', {
    id: props.item.id,
    sizeIdx: selectedSizeIndex.value,
    extrasIdx: selectedExtrasIndexes.value
  })
  close()
}
</script>