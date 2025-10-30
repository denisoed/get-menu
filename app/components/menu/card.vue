<template>
  <div
    class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft flex flex-col dark:bg-slate-950 dark:border-slate-800 cursor-pointer"
    role="button"
    tabindex="0"
    @click="handleCardClick"
    @keydown.enter.prevent="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <img :src="img" :alt="name" class="h-44 w-full object-cover">
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h4 class="font-semibold text-lg text-slate-900 dark:text-slate-100">{{ name }}</h4>
          <div class="text-sm text-slate-500 dark:text-slate-400">{{ category }}</div>
        </div>
        <div class="text-right">
          <div class="font-bold text-brand-700 dark:text-brand-300">{{ fmt(price) }}</div>
          <div v-for="tag in tags" :key="tag" class="mt-1 flex flex-wrap gap-1">
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-slate-200">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button
          v-if="options"
          class="px-3 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click.stop="$emit('open-options', { id, name, category, price, tags, img, options, description })"
        >
          Выбрать
        </button>
        <div class="ml-auto flex items-center gap-2">
          <button
            class="px-3 py-2 text-sm rounded-xl bg-brand-600 text-white hover:bg-brand-700"
            @click.stop="$emit('add-to-cart', id)"
          >
            В корзину
          </button>
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
        </div>
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
  options?: {
    sizes?: Array<{ label: string; add?: number }>;
    extras?: Array<{ label: string; add?: number }>;
  };
  isFavorite?: boolean;
}>();

const emit = defineEmits<{
  'add-to-cart': [id: string];
  'open-options': [item: {
    id: string;
    name: string;
    category: string;
    price: number;
    tags: string[];
    img: string;
    description?: string;
    options: {
      sizes?: Array<{ label: string; add?: number }>;
      extras?: Array<{ label: string; add?: number }>;
    };
  }];
  'toggle-favorite': [id: string];
  'open-details': [id: string];
}>();

function handleCardClick () {
  emit('open-details', props.id);
}
</script>
