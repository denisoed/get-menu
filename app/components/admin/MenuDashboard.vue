<template>
  <div>
    <LayoutAdminHeader />

    <section class="bg-white dark:bg-slate-950">
      <div class="mx-auto container-capped px-4 py-10">
        <div class="max-w-3xl space-y-4">
          <p class="text-sm uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Администрирование</p>
          <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
            Мои меню
          </h1>
          <p class="text-base text-slate-600 dark:text-slate-300">
            Выберите меню, чтобы продолжить редактирование, или создайте новое. Здесь собраны все проекты, которые вы уже публиковали или сохраняли в черновиках.
          </p>
        </div>
      </div>
    </section>

    <section class="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800">
      <div class="mx-auto container-capped px-4 py-10">
        <div v-if="userMenus.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <NuxtLink
            v-for="menu in userMenus"
            :key="menu.id"
            :to="{ path: '/admin/create', query: { edit: menu.id } }"
            class="group relative flex h-full flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900"
          >
            <div class="flex flex-col gap-3">
              <div class="flex items-start justify-between gap-3">
                <h2 class="min-w-0 flex-1 text-xl font-semibold text-slate-900 transition-colors group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
                  {{ menu.title }}
                </h2>
                <div class="flex flex-shrink-0 items-center justify-end gap-2 text-right">
                  <span
                    class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                    :class="menu.isPublished
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200'
                      : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'"
                  >
                    <span class="text-base leading-none">{{ menu.isPublished ? '●' : '○' }}</span>
                    {{ menu.isPublished ? 'Опубликовано' : 'Черновик' }}
                  </span>
                </div>
              </div>
            </div>

            <p class="text-sm text-slate-600 dark:text-slate-300">
              {{ menu.description }}
            </p>

            <div class="mt-auto flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>
                Позиций: <span class="font-semibold text-slate-900 dark:text-slate-100">{{ menu.itemsCount }}</span>
              </span>
              <span>
                Обновлено {{ formatMenuDate(menu.lastUpdated) }}
              </span>
            </div>

            <div class="flex items-center justify-between gap-3 pt-1">
              <div class="flex items-center gap-2 text-sm font-medium text-brand-600 transition-all group-hover:gap-3 dark:text-brand-300">
                <span>Редактировать меню</span>
                <span aria-hidden="true" class="text-lg leading-none">→</span>
              </div>
              <button
                type="button"
                class="inline-flex items-center rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                :aria-label="`Просмотреть меню «${menu.title}»`"
                @click.stop.prevent="navigateToMenu(menu)"
                @keydown.enter.stop.prevent="navigateToMenu(menu)"
                @keydown.space.stop.prevent="navigateToMenu(menu)"
              >
                <span aria-hidden="true" class="text-sm">👁️</span>
              </button>
            </div>
          </NuxtLink>
        </div>
        <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          <p class="text-lg font-medium">Здесь появятся ваши меню.</p>
          <p class="mt-2 text-sm">Начните с создания нового проекта, чтобы собрать блюда и поделиться ссылкой с гостями.</p>
        </div>
      </div>
    </section>

    <LayoutAdminFooter />

    <NuxtLink
      to="/admin/create"
      class="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
      aria-label="Создать новое меню"
    >
      <span aria-hidden="true" class="text-2xl leading-none">＋</span>
      <span class="hidden sm:inline text-sm font-semibold">Новое меню</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead, useRouter } from '#imports'
import type { UserMenu } from '~/types/user-menu'

const { data } = await useFetch<UserMenu[]>('/api/user-menus')

const userMenus = computed(() => data.value ?? [])

const router = useRouter()

function navigateToMenu (menu: UserMenu) {
  router.push({
    path: `/${menu.slug}`
  })
}

function formatMenuDate (isoDate: string) {
  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return 'неизвестно'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}

useHead({
  title: 'Управление меню — Get Menu'
})
</script>
