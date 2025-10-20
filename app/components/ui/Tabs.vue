<template>
  <div>
    <div
      class="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-800 dark:bg-slate-900"
    >
      <div
        class="flex flex-wrap items-center gap-2 overflow-x-auto rounded-xl bg-slate-100/60 p-1 dark:bg-slate-800/60"
        role="tablist"
        :aria-orientation="orientation"
      >
        <button
          v-for="tab in items"
          :key="tab.value"
          type="button"
          class="group flex min-w-[8rem] flex-1 flex-col rounded-xl px-3 py-2 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:min-w-[10rem]"
          :class="[
            tab.value === current ? 'bg-white text-brand-600 shadow-soft dark:bg-slate-900 dark:text-brand-300' : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-200',
          ]"
          role="tab"
          :aria-selected="tab.value === current"
          :tabindex="tab.value === current ? 0 : -1"
          @click="setCurrent(tab.value)"
        >
          <span class="text-sm font-semibold">{{ tab.label }}</span>
          <span
            v-if="tab.description"
            class="mt-1 text-xs text-slate-500 transition-colors dark:text-slate-400 group-[.bg-white]:text-slate-500"
          >
            {{ tab.description }}
          </span>
        </button>
      </div>
    </div>

    <div class="mt-6">
      <slot :name="current" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, ref } from 'vue'

type Orientation = 'horizontal' | 'vertical'

interface TabItem {
  value: string
  label: string
  description?: string
}

const props = defineProps<{
  items: TabItem[]
  modelValue?: string
  defaultValue?: string
  orientation?: Orientation
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const fallbackValue = computed(() => props.modelValue ?? props.defaultValue ?? props.items[0]?.value ?? '')
const current = ref(fallbackValue.value)

watch(
  () => props.modelValue,
  (value) => {
    if (value && value !== current.value) {
      current.value = value
    }
  },
)

watch(fallbackValue, (value) => {
  if (!props.modelValue) {
    current.value = value
  }
})

function setCurrent (value: string) {
  if (current.value === value) return
  current.value = value
  emit('update:modelValue', value)
  emit('change', value)
}

const orientation = computed(() => props.orientation ?? 'horizontal')
</script>
