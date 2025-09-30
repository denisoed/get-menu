<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
    <MenuCard
      v-for="item in menu"
      :key="item.id"
      :id="item.id"
      :name="item.name"
      :category="item.category"
      :price="item.price"
      :tags="item.tags || []"
      :img="item.img"
      :options="item.options"
      @open-options="openOptionsDialog"
    />
  </div>

  <DialogOptions 
    :is-visible="showOptionsDialog" 
    :item="selectedItem" 
    :format-price="formatPrice"
    @close="closeOptionsDialog"
    @add-to-cart="handleAddToCart"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { MenuItem } from '../../types/menu';

interface Props {
  menu: MenuItem[];
  formatPrice: (price: number) => string;
  onAddToCart: (id: string, opts?: { sizeIdx?: number | null; extrasIdx?: number[] }) => void;
}

const props = defineProps<Props>();

// Dialog state
const showOptionsDialog = ref(false);
const selectedItem = ref<MenuItem | null>(null);

function openOptionsDialog(item: MenuItem) {
  if (!item.options) {
    props.onAddToCart(item.id);
    return;
  }
  selectedItem.value = item;
  showOptionsDialog.value = true;
}

function closeOptionsDialog() {
  showOptionsDialog.value = false;
  selectedItem.value = null;
}

function handleAddToCart(data: { id: string; sizeIdx: number | null; extrasIdx: number[] }) {
  props.onAddToCart(data.id, { sizeIdx: data.sizeIdx, extrasIdx: data.extrasIdx });
}
</script>