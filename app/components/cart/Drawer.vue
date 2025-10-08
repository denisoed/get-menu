<template>
  <aside id="cartDrawer" class="hidden md:block sticky top-[120px] h-fit">
    <div class="bg-white rounded-2xl border border-slate-100 shadow-soft p-4 dark:bg-slate-950 dark:border-slate-800">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Ваш заказ</h3>
      <div class="mt-3 flex flex-col gap-3">
        <div v-if="!groupedCart.length" class="text-slate-500 text-sm dark:text-slate-400">Корзина пуста</div>
        <div v-else>
          <div
            v-for="entry in groupedCart"
            :key="entry.key"
            class="flex items-start justify-between gap-2 text-slate-700 dark:text-slate-200"
          >
            <div>
              <div class="font-medium text-slate-900 dark:text-slate-100">{{ entry.item.name }}</div>
              <div v-if="cartEntryDescription(entry)" class="text-[12px] text-slate-500 dark:text-slate-400">
                {{ cartEntryDescription(entry) }}
              </div>
              <div class="text-[12px] text-slate-500 dark:text-slate-400">
                {{ fmt(entry.item.price) }} × {{ entry.quantity }}
              </div>
            </div>
            <div class="text-right text-slate-900 dark:text-slate-100">
              <div class="font-semibold">{{ fmt(entry.lineTotal) }}</div>
              <div class="mt-1 flex items-center gap-1 justify-end">
                <button class="w-6 h-6 rounded-full border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="decrement(entry.key)">-</button>
                <button class="w-6 h-6 rounded-full border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" @click="increment(entry.item)">+</button>
                <button class="ml-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400" @click="remove(entry.key)">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 border-t pt-3 text-sm text-slate-600 space-y-1 dark:border-slate-800 dark:text-slate-300">
        <div class="flex justify-between"><span>Доставка</span><span id="deliveryFee">{{ deliveryText }}</span></div>
        <div class="flex justify-between font-semibold text-slate-800 dark:text-slate-100">
          <span>Итого</span>
          <span id="cartTotal">{{ fmt(totals.total) }}</span>
        </div>
        <div
          id="minOrderNote"
          class="text-[12px] text-amber-700 bg-amber-50 rounded-lg p-2 dark:text-amber-300 dark:bg-amber-900/40"
          :class="{ hidden: meetsMinOrder }"
        >
          Минимальная сумма заказа: {{ fmt(minOrder) }}
        </div>
      </div>
      <button
        id="checkoutBtn"
        class="mt-3 w-full rounded-xl bg-brand-600 text-white py-2.5 hover:bg-brand-700 disabled:opacity-50"
        :disabled="!groupedCart.length || !meetsMinOrder"
        @click="emit('checkout')"
      >
        Оформить заказ
      </button>
      <a
        id="waOrder"
        :href="whatsappUrl"
        target="_blank"
        class="mt-2 w-full inline-block text-center rounded-xl border border-green-600 text-green-700 py-2 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/40"
        :class="{ 'pointer-events-none opacity-60': !groupedCart.length }"
      >
        WhatsApp
      </a>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useDate from '~/composables/useDate'
import { useCartStore } from '~/store/cart'
import type { CartEntry } from '~/types/cart'
import { buildCartLines, calculateCartTotals, cartEntryDescription, composeOrderMessage, groupCartItems } from '~/utils/cart'

interface Props {
  deliveryFee: number
  minOrder: number
  whatsappPhone: string
  cafeName: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'checkout'): void }>()
const { fmt } = useDate()
const cartStore = useCartStore()

const cartItems = computed(() => cartStore.cart as CartEntry[])
const groupedCart = computed(() => groupCartItems(cartItems.value))
const totals = computed(() => calculateCartTotals(groupedCart.value, props.deliveryFee))
const meetsMinOrder = computed(() => totals.value.total >= props.minOrder)

const deliveryText = computed(() => {
  if (!groupedCart.value.length) return '—'
  return fmt(props.deliveryFee)
})

const whatsappUrl = computed(() => {
  if (!groupedCart.value.length) return '#'
  const phone = props.whatsappPhone.replace(/\D/g, '')
  const text = encodeURIComponent(buildOrderText())
  return `https://wa.me/${phone}?text=${text}`
})

function increment (item: CartEntry) {
  cartStore.addToCart({ ...item })
}

function decrement (key: string) {
  const index = cartStore.cart.findIndex(entry => ((entry as CartEntry).cartKey || entry.id) === key)
  if (index >= 0) {
    cartStore.cart.splice(index, 1)
  }
}

function remove (key: string) {
  cartStore.cart = cartStore.cart.filter(entry => ((entry as CartEntry).cartKey || entry.id) !== key)
}

function buildOrderText () {
  const lines = buildCartLines(groupedCart.value, fmt, totals.value)
  return composeOrderMessage(props.cafeName, lines)
}
</script>
