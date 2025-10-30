<template>
  <div v-if="menu.length" class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
    <MenuCard
      v-for="item in menu"
      :key="item.id"
      :id="item.id"
      :name="item.name"
      :category="item.category"
      :price="item.price"
      :tags="item.tags || []"
      :img="item.img"
      :description="item.description"
      :options="item.options"
      :is-favorite="props.isFavorite(item.id)"
      @open-options="openOptionsDialog"
      @add-to-cart="handleQuickAdd"
      @toggle-favorite="props.toggleFavorite"
      @open-details="openItemDetails"
    />
  </div>
  <div v-else class="rounded-xl border border-dashed border-slate-200 px-6 py-10 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400">
    Ничего не найдено. Попробуйте изменить запрос.
  </div>

  <MenuDetailModal
    :is-open="showDetailsModal"
    :item="selectedItem"
    :format-price="props.formatPrice"
    :is-favorite="props.isFavorite"
    @close="closeDetailsModal"
    @add-to-cart="handleAddToCart"
    @toggle-favorite="props.toggleFavorite"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '~/store/cart'
import type { MenuItem } from '../../types/menu'
import type { CartEntry } from '~/types/cart'

interface Props {
  menu: MenuItem[];
  formatPrice: (price: number) => string;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const props = defineProps<Props>();

const cartStore = useCartStore()

// Dialog state
const showDetailsModal = ref(false)
const selectedItem = ref<MenuItem | null>(null)

function openOptionsDialog(item: MenuItem) {
  openItemDetails(item.id)
}

function openItemDetails (id: string) {
  const item = props.menu.find(entry => entry.id === id)
  if (!item) return

  selectedItem.value = item
  showDetailsModal.value = true
}

function closeDetailsModal () {
  showDetailsModal.value = false
  selectedItem.value = null
}

function handleAddToCart(data: { id: string; sizeIdx: number | null; extrasIdx: number[] }) {
  const item = props.menu.find(entry => entry.id === data.id)
  if (!item) return

  cartStore.addToCart(createCartEntry(item, data))
}

function handleQuickAdd(id: string) {
  const item = props.menu.find(entry => entry.id === id)
  if (!item) return

  if (item.options?.sizes?.length || item.options?.extras?.length) {
    openItemDetails(id)
    return
  }

  cartStore.addToCart(createCartEntry(item))
}

function createCartEntry (
  item: MenuItem,
  options: { sizeIdx: number | null; extrasIdx: number[] } = { sizeIdx: null, extrasIdx: [] },
): CartEntry {
  const { sizeIdx, extrasIdx } = options
  const extrasSorted = [...(extrasIdx || [])].sort((a, b) => a - b)
  const size = sizeIdx != null ? item.options?.sizes?.[sizeIdx] : undefined
  const extras = (item.options?.extras || []).filter((_, idx) => extrasSorted.includes(idx))

  const additional = (size?.add || 0) + extras.reduce((acc, extra) => acc + (extra.add || 0), 0)
  const cartKeyParts = [
    item.id,
    sizeIdx != null ? `size:${sizeIdx}` : 'size:-',
    extrasSorted.length ? `extras:${extrasSorted.join(',')}` : 'extras:-',
  ]

  return {
    ...item,
    cartKey: cartKeyParts.join('|'),
    basePrice: item.price,
    price: item.price + additional,
    sizeLabel: size?.label,
    extrasLabels: extras.map(extra => extra.label),
  }
}
</script>
