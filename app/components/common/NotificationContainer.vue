<template>
  <div
    v-if="notifications.length"
    class="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:inset-x-auto sm:right-4 sm:flex-col sm:items-end"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup name="notification" tag="div" class="flex w-full flex-col gap-3 sm:w-80">
      <div
        v-for="item in notifications"
        :key="item.id"
        class="pointer-events-auto overflow-hidden rounded-2xl border p-4 shadow-lg"
        :class="kindClasses[item.kind]"
      >
        <div class="flex items-start justify-between gap-4">
          <p class="text-sm font-medium">{{ item.message }}</p>
          <button
            type="button"
            class="rounded-full p-1 text-sm opacity-70 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :class="closeButtonClasses[item.kind]"
            @click="dismiss(item.id)"
          >
            <span aria-hidden="true">&times;</span>
            <span class="sr-only">Закрыть уведомление</span>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useNotifications } from '~/composables/useNotifications'

const { notifications: notificationState, dismiss } = useNotifications()

const notifications = computed(() => notificationState.value)

const kindClasses = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-100',
  info: 'border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
} as const

const closeButtonClasses = {
  success: 'text-emerald-700 focus-visible:outline-emerald-500 dark:text-emerald-200',
  error: 'text-red-700 focus-visible:outline-red-500 dark:text-red-200',
  info: 'text-slate-600 focus-visible:outline-brand-500 dark:text-slate-200'
} as const
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.25s ease;
}

.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}
</style>
