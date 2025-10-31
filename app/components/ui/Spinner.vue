<template>
  <span class="inline-flex items-center justify-center" role="status">
    <span class="sr-only">Загрузка…</span>
    <span
      class="block animate-spin rounded-full border-slate-200 border-t-brand-500"
      :class="presetClasses"
      aria-hidden="true"
    ></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ size?: 'sm' | 'md' | 'lg' }>(), {
  size: 'md',
})

const presetClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-6 w-6 border-2'
    case 'lg':
      return 'h-12 w-12 border-4'
    default:
      return 'h-8 w-8 border-[3px]'
  }
})
</script>
