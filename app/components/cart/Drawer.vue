<template>
  <aside id="cartDrawer" class="hidden md:block sticky top-[120px] h-fit">
    <div class="rounded-2xl border shadow-soft p-4" :style="drawerStyle">
      <h3 class="text-lg font-semibold" :style="headingStyle">Ваш заказ</h3>
      <div class="mt-3 flex flex-col gap-3">
        <div v-if="!groupedCart.length" class="text-sm" :style="mutedStyle">Корзина пуста</div>
        <div v-else>
          <div
            v-for="entry in groupedCart"
            :key="entry.key"
            class="flex items-start justify-between gap-2"
          >
            <div>
              <div class="font-medium" :style="headingStyle">{{ entry.item.name }}</div>
              <div v-if="cartEntryDescription(entry)" class="text-[12px]" :style="mutedStyle">
                {{ cartEntryDescription(entry) }}
              </div>
              <div class="text-[12px]" :style="mutedStyle">
                {{ fmt(entry.item.price) }} × {{ entry.quantity }}
              </div>
            </div>
            <div class="text-right" :style="headingStyle">
              <div class="font-semibold">{{ fmt(entry.lineTotal) }}</div>
              <div class="mt-1 flex items-center gap-1 justify-end">
                <button class="w-6 h-6 rounded-full border transition" :style="circleButtonStyle" @click="decrement(entry.key)">-</button>
                <button class="w-6 h-6 rounded-full border transition" :style="circleButtonStyle" @click="increment(entry.item)">+</button>
                <button class="ml-1 transition" :style="removeButtonStyle" @click="remove(entry.key)">
                  Удалить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-4 border-t pt-3 text-sm space-y-1" :style="summaryStyle">
        <div class="flex justify-between"><span>Доставка</span><span id="deliveryFee">{{ deliveryText }}</span></div>
        <div class="flex justify-between font-semibold" :style="headingStyle">
          <span>Итого</span>
          <span id="cartTotal">{{ fmt(totals.total) }}</span>
        </div>
        <div
          id="minOrderNote"
          class="text-[12px] rounded-lg p-2"
          :style="highlightStyle"
          :class="{ hidden: meetsMinOrder }"
        >
          Минимальная сумма заказа: {{ fmt(minOrder) }}
        </div>
      </div>
      <button
        id="checkoutBtn"
        class="mt-3 w-full rounded-xl py-2.5 transition disabled:opacity-50"
        :style="primaryButtonStyle"
        :disabled="!groupedCart.length || !meetsMinOrder"
        @click="emit('checkout')"
      >
        Оформить заказ
      </button>
      <a
        id="waOrder"
        :href="whatsappUrl"
        target="_blank"
        class="mt-2 w-full inline-block text-center rounded-xl border py-2 transition"
        :style="whatsappButtonStyle"
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
import { DEFAULT_MENU_THEME } from '~/config/menuThemes'
import { resolveMenuTheme } from '~/utils/theme'
import type { ResolvedMenuTheme } from '~/types/theme'

interface Props {
  deliveryFee: number
  minOrder: number
  whatsappPhone: string
  cafeName: string
  theme?: ResolvedMenuTheme
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'checkout'): void }>()
const { fmt } = useDate()
const cartStore = useCartStore()

const theme = computed(() => props.theme ?? resolveMenuTheme(DEFAULT_MENU_THEME))

const drawerStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  borderColor: theme.value.palette.border,
  color: theme.value.palette.text,
}))

const headingStyle = computed(() => ({
  color: theme.value.palette.text,
  fontFamily: theme.value.fonts.heading,
}))

const mutedStyle = computed(() => ({
  color: theme.value.palette.muted,
}))

const summaryStyle = computed(() => ({
  borderColor: theme.value.palette.border,
  color: theme.value.palette.text,
}))

const highlightStyle = computed(() => ({
  backgroundColor: theme.value.palette.subtle,
  color: theme.value.palette.text,
}))

const circleButtonStyle = computed(() => ({
  borderColor: theme.value.palette.border,
  color: theme.value.palette.text,
  backgroundColor: theme.value.palette.surface,
}))

const removeButtonStyle = computed(() => ({
  color: theme.value.palette.muted,
}))

const primaryButtonStyle = computed(() => ({
  backgroundColor: theme.value.palette.primary,
  color: theme.value.palette.primaryContent,
}))

const whatsappButtonStyle = computed(() => ({
  borderColor: theme.value.palette.accent,
  color: theme.value.palette.accent,
  backgroundColor: 'transparent',
}))

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
