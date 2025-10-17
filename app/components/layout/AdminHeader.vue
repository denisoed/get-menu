<template>
  <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur supports-backdrop:backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
    <div class="mx-auto container-capped flex items-center justify-between gap-4 px-4 py-3 text-slate-700 dark:text-slate-200">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-2 text-lg font-semibold text-slate-900 transition hover:text-brand-600 dark:text-slate-100 dark:hover:text-brand-300"
      >
        <span aria-hidden="true" class="text-xl">🍽️</span>
        <span>Get Menu Admin</span>
      </NuxtLink>
      <div class="flex items-center gap-3 text-sm">
        <NuxtLink
          to="/"
          class="rounded-full border border-slate-300 px-3 py-1 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400 dark:hover:text-brand-300"
        >
          На публичное меню
        </NuxtLink>
        <button
          class="rounded-full border border-slate-300 px-3 py-1 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-400 dark:hover:text-brand-300"
          type="button"
          @click="toggleTheme"
        >
          🌓 Тема
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

const { toggleTheme } = useTheme()
</script>
