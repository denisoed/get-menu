<template>
  <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-soft flex flex-col dark:bg-slate-950 dark:border-slate-800">
    <img :src="img" :alt="name" class="h-44 w-full object-cover">
    <div class="p-4 flex-1 flex flex-col">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h4 class="font-semibold text-lg text-slate-900 dark:text-slate-100">{{ name }}</h4>
          <div class="text-sm text-slate-500 dark:text-slate-400">{{ category }}</div>
        </div>
        <div class="text-right">
          <div class="font-bold text-brand-700 dark:text-brand-300">{{ fmt(price) }}</div>
          <div v-for="tag in tags" :key="tag" class='mt-1 flex flex-wrap gap-1'>
            <span class="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 dark:text-slate-200">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2">
        <button
          v-if="options"
          class="px-3 py-2 text-sm rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="$emit('open-options', { id, name, category, price, tags, img, options })"
        >
          Выбрать
        </button>
        <button
          class="px-3 py-2 text-sm rounded-xl bg-brand-600 text-white hover:bg-brand-700"
          @click="$emit('add-to-cart', id)"
        >
          В корзину
        </button>
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
}>();
</script>