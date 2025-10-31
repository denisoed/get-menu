<template>
  <div class="inline-flex items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
    <button
      type="button"
      class="h-10 w-10 touch-manipulation rounded-l-xl transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800"
      :aria-label="decreaseLabel"
      @click="decrease"
    >
      <span aria-hidden="true" class="block text-xl leading-none">−</span>
    </button>
    <div class="min-w-[3rem] px-3 text-center text-base font-semibold">
      {{ modelValue }}
    </div>
    <button
      type="button"
      class="h-10 w-10 touch-manipulation rounded-r-xl transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:hover:bg-slate-800"
      :aria-label="increaseLabel"
      @click="increase"
    >
      <span aria-hidden="true" class="block text-xl leading-none">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const decreaseLabel = computed(() => `Уменьшить количество до ${Math.max(props.min, props.modelValue - 1)}`)
const increaseLabel = computed(() => {
  const next = props.modelValue + 1
  return props.max ? `Увеличить количество до ${Math.min(props.max, next)}` : `Увеличить количество до ${next}`
})

function decrease () {
  const next = props.modelValue - 1
  if (next < props.min) return
  emit('update:modelValue', next)
}

function increase () {
  const next = props.modelValue + 1
  if (props.max != null && next > props.max) return
  emit('update:modelValue', next)
}
</script>
