<template>
  <label
    :class="[
      'relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 py-2 text-sm text-slate-700 transition focus-within:ring-2 focus-within:ring-brand-400 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus-within:ring-brand-500 dark:focus-within:ring-offset-slate-950',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
      labelClass
    ]"
  >
    <input
      v-bind="inputAttrs"
      type="checkbox"
      class="peer sr-only"
      :checked="isChecked"
      :disabled="disabled"
      @change="onChange"
    />
    <span
      class="grid h-5 w-5 place-items-center rounded-md border border-slate-300 bg-white text-transparent transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand-300 peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white dark:border-slate-600 dark:bg-slate-900 dark:peer-focus-visible:outline-brand-500"
    >
      <svg
        class="h-3.5 w-3.5"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 10.5L8.5 14L15 6"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="flex-1 leading-tight">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

type ModelValue = boolean | any[]

interface Props {
  modelValue: ModelValue
  value?: any
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void
}>()

const attrs = useAttrs() as Record<string, unknown>

const labelClass = computed(() => attrs.class)

const inputAttrs = computed(() => {
  const result: Record<string, unknown> = {}
  Object.entries(attrs).forEach(([key, value]) => {
    if (key !== 'class') {
      result[key] = value
    }
  })
  return result
})

const isArrayModel = computed(() => Array.isArray(props.modelValue))

const isChecked = computed(() => {
  if (isArrayModel.value) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(props.value)
  }
  return Boolean(props.modelValue)
})

function onChange(event: Event) {
  if (props.disabled) {
    return
  }

  const target = event.target as HTMLInputElement

  if (isArrayModel.value) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []

    if (target.checked) {
      if (!current.includes(props.value)) {
        current.push(props.value)
      }
    } else {
      const index = current.findIndex((item) => item === props.value)
      if (index !== -1) {
        current.splice(index, 1)
      }
    }

    emit('update:modelValue', current)
  } else {
    emit('update:modelValue', target.checked)
  }
}
</script>
