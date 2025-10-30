<template>
  <div v-if="groupedMenu.length" class="space-y-10">
    <section
      v-for="group in groupedMenu"
      :key="group.category"
      class="flex flex-col gap-4"
    >
      <h2
        class="text-lg font-semibold text-slate-900 dark:text-slate-100"
      >
        {{ group.category }}
      </h2>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <MenuCard
          v-for="item in group.items"
          :key="item.id"
          :id="item.id"
          :name="item.name"
          :category="item.category"
          :price="item.price"
          :tags="item.tags || []"
          :img="item.img"
          :description="item.description"
          :is-favorite="props.isFavorite(item.id)"
          @toggle-favorite="props.toggleFavorite"
          @open-details="openItemDetails"
        />
      </div>
    </section>
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
import { computed, ref } from 'vue'
import { useCartStore } from '~/store/cart'
import type { MenuItem } from '~/types/menu'
import type { CartEntry } from '~/types/cart'

interface Props {
  menu: MenuItem[];
  formatPrice: (price: number) => string;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const props = defineProps<Props>();

const cartStore = useCartStore()

const showDetailsModal = ref(false)
const selectedItem = ref<MenuItem | null>(null)

const groupedMenu = computed(() => {
  const groups = new Map<string, MenuItem[]>()

  props.menu.forEach((item) => {
    const category = item.category?.trim() || 'Без категории'

    if (!groups.has(category)) {
      groups.set(category, [])
    }

    groups.get(category)?.push(item)
  })

  return Array.from(groups.entries()).map(([category, items]) => ({
    category,
    items,
  }))
})

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
