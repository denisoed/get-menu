<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span aria-hidden="true" class="text-base leading-none">←</span>
    <slot>Назад</slot>
  </button>
</template>

<script setup lang="ts">
import { useRouter } from '#imports'
import type { RouteLocationRaw } from 'vue-router'

const props = withDefaults(defineProps<{ fallback?: RouteLocationRaw }>(), {
  fallback: '/',
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const router = useRouter()

function navigateBack () {
  if (process.client && window.history.length > 1) {
    router.back()
    return true
  }

  if (props.fallback) {
    router.push(props.fallback)
    return true
  }

  return false
}

function handleClick (event: MouseEvent) {
  emit('click', event)

  if (event.defaultPrevented) {
    return
  }

  navigateBack()
}
</script>
