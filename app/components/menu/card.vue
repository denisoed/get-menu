<template>
  <div
    class="rounded-2xl overflow-hidden border shadow-soft flex flex-col"
    :style="{
      backgroundColor: 'var(--menu-theme-color-surface)',
      borderColor: 'var(--menu-theme-color-border)',
      color: 'var(--menu-theme-color-text)'
    }"
  >
    <img :src="img" :alt="name" class="h-44 w-full object-cover">
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h4 class="font-semibold text-lg" :style="{ fontFamily: 'var(--menu-theme-font-heading)', color: 'var(--menu-theme-color-text)' }">{{ name }}</h4>
          <div class="text-sm" :style="{ color: 'var(--menu-theme-color-muted)' }">{{ category }}</div>
        </div>
        <div class="text-right">
          <div class="font-bold" :style="{ color: 'var(--menu-theme-color-primary)' }">{{ fmt(price) }}</div>
          <div v-for="tag in tags" :key="tag" class="mt-1 flex flex-wrap gap-1">
            <span
              class="text-[11px] px-2 py-0.5 rounded-full"
              :style="{ backgroundColor: 'var(--menu-theme-color-subtle)', color: 'var(--menu-theme-color-text)' }"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button
          v-if="options"
          class="px-3 py-2 text-sm rounded-xl border transition"
          :style="{ borderColor: 'var(--menu-theme-color-border)', color: 'var(--menu-theme-color-text)', backgroundColor: 'transparent' }"
          @click="$emit('open-options', { id, name, category, price, tags, img, options })"
        >
          Выбрать
        </button>
        <div class="ml-auto flex items-center gap-2">
          <button
            class="px-3 py-2 text-sm rounded-xl transition"
            :style="{ backgroundColor: 'var(--menu-theme-color-primary)', color: 'var(--menu-theme-color-primary-content)' }"
            @click="$emit('add-to-cart', id)"
          >
            В корзину
          </button>
          <button
            type="button"
            class="h-10 w-10 flex items-center justify-center rounded-xl border transition"
            :style="isFavorite
              ? { borderColor: 'var(--menu-theme-color-primary)', backgroundColor: 'var(--menu-theme-color-subtle)', color: 'var(--menu-theme-color-primary)' }
              : { borderColor: 'var(--menu-theme-color-border)', color: 'var(--menu-theme-color-muted)' }"
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

defineProps<{
  id: string;
  name: string;
  category: string;
  price: number;
  tags: string[];
  img: string;
  options?: {
    sizes?: Array<{ label: string; add?: number }>;
    extras?: Array<{ label: string; add?: number }>;
  };
  isFavorite?: boolean;
}>();

defineEmits<{
  'add-to-cart': [id: string];
  'open-options': [item: {
    id: string;
    name: string;
    category: string;
    price: number;
    tags: string[];
    img: string;
    options: {
      sizes?: Array<{ label: string; add?: number }>;
      extras?: Array<{ label: string; add?: number }>;
    };
  }];
  'toggle-favorite': [id: string];
}>();
</script>
