<template>
  <div
    class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft flex flex-col dark:bg-slate-950 dark:border-slate-800 cursor-pointer"
    role="button"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <div class="relative">
      <img :src="img" :alt="name" class="h-44 w-full object-cover">
      <div
        v-if="tags.length"
        class="absolute bottom-3 right-3 flex max-w-[calc(100%-1.5rem)] flex-wrap justify-end gap-1"
      >
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    <div class="p-4 flex-1 flex flex-col">
      <div class="font-semibold text-brand-700 text-base dark:text-brand-300">{{ fmt(price) }}</div>
      <h4 class="mt-1 font-semibold text-base leading-snug text-slate-900 dark:text-slate-100">{{ name }}</h4>
      <div class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ category }}</div>
      <div class="mt-4 flex items-center gap-2">
        <button
          type="button"
          class="h-10 w-10 flex items-center justify-center rounded-xl border transition-colors"
          :class="isFavorite
            ? 'border-brand-200 bg-brand-50 text-brand-600 dark:border-brand-500 dark:bg-brand-900/40 dark:text-brand-300'
            : 'border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-300'"
          :aria-pressed="isFavorite"
          :title="isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'"
          @click.stop="$emit('toggle-favorite', id)"
        >
          <svg
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              v-if="isFavorite"
              d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656l-6.01 6.01a.75.75 0 0 1-1.06 0l-6.01-6.01a4 4 0 0 1 0-5.656Z"
            />
            <path
              v-else
              fill-rule="evenodd"
              d="M3.172 5.172a4 4 0 0 1 5.656 0L10 6.343l1.172-1.171a4 4 0 1 1 5.656 5.656l-6.01 6.01a.75.75 0 0 1-1.06 0l-6.01-6.01a4 4 0 0 1 0-5.656Zm1.06 1.06a2.5 2.5 0 0 0 0 3.536L10 15.475l5.768-5.707a2.5 2.5 0 0 0-3.536-3.536L10 8.465l-1.232-1.231a2.5 2.5 0 0 0-3.536 0Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="sr-only">{{ isFavorite ? 'Убрать из избранного' : 'Добавить в избранное' }}</span>
        </button>
        <button
          type="button"
          class="ml-auto px-3 py-2 text-sm rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700"
          @click.stop="handleCardClick"
        >
          Выбрать
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useDate from '../../composables/useDate';

const { fmt } = useDate();

const props = defineProps<{
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  img: string;
  description?: string;
  isFavorite?: boolean;
}>();

const emit = defineEmits<{
  'toggle-favorite': [id: string];
  'open-details': [id: string];
}>();

function handleCardClick () {
  emit('open-details', props.id);
}
</script>
