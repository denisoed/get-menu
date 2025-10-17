<template>
  <footer class="mt-12 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
    <div class="mx-auto container-capped flex flex-col gap-3 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
      <p class="font-medium text-slate-700 dark:text-slate-200">
        Управление меню в Get Menu — создавайте и редактируйте проекты в одном месте.
      </p>
      <div class="flex flex-wrap items-center gap-3">
        <span class="text-xs text-slate-500 dark:text-slate-400">© {{ currentYear }} Get Menu</span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
