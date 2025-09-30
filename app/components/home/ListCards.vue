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
    />
  </div>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/menu';

defineProps<{
  menu: MenuItem[];
}>();
</script>