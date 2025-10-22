<template>
  <div
    id="quickOrder"
    class="fixed inset-0 items-end md:items-center justify-center z-50"
    :class="{ hidden: !isOpen || !hasItems, flex: isOpen && hasItems }"
  >
    <div class="absolute inset-0 bg-transparent backdrop-blur-sm" @click="close"></div>
    <div
      class="w-full md:w-[720px] rounded-none md:rounded-2xl p-5 h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-soft z-50"
      :style="dialogStyle"
    >
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-xl font-semibold" :style="headingStyle">Оформление заказа</h3>
        <button
          class="relative h-10 w-10 rounded-full shadow-md ring-1 transition focus:outline-none"
          :style="closeButtonStyle"
          @click="close"
          aria-label="Закрыть"
        >
          <span
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 grid place-items-center text-xl leading-none"
          >
            ✕
          </span>
        </button>
      </div>
      <form class="mt-4 grid md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
        <div class="grid gap-3">
          <label class="text-sm" :style="mutedStyle">Имя
            <input
              v-model="form.name"
              name="name"
              required
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border px-3 py-2"
              :style="inputStyle"
              placeholder="Ваше имя"
            />
          </label>
          <label class="text-sm" :style="mutedStyle">Телефон
            <input
              v-model="form.phone"
              name="phone"
              required
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border px-3 py-2"
              :style="inputStyle"
              placeholder="+996..."
            />
          </label>
          <label class="text-sm" :style="mutedStyle">Способ получения
            <select v-model="form.type" name="type" class="mt-1 w-full rounded-xl border px-3 py-2" :style="inputStyle">
              <option value="delivery">Доставка</option>
              <option value="pickup">Самовывоз</option>
            </select>
          </label>
          <label class="text-sm" :style="mutedStyle" v-show="requiresAddress">Адрес (для доставки)
            <input
              v-model="form.address"
              name="address"
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border px-3 py-2"
              :style="inputStyle"
              placeholder="Улица, дом, подъезд"
            />
          </label>
          <label class="text-sm" :style="mutedStyle">Время
            <select v-model="form.time" name="time" class="mt-1 w-full rounded-xl border px-3 py-2" :style="inputStyle">
              <option value="asap">Как можно скорее</option>
              <option value="30m">Через 30 минут</option>
              <option value="1h">Через 1 час</option>
            </select>
          </label>
        </div>
        <div class="grid gap-3">
          <div class="p-3 rounded-xl" :style="summaryCardStyle">
            <div class="flex items-center justify-between gap-3">
              <div class="font-medium" :style="headingStyle">Состав заказа</div>
              <div class="text-xs" :style="mutedStyle">{{ groupedCart.length }} поз.</div>
            </div>
            <div class="mt-3 grid gap-3">
              <div
                v-for="entry in groupedCart"
                :key="entry.key"
                class="rounded-xl border p-3 shadow-sm backdrop-blur-sm"
                :style="{ borderColor: theme.value.palette.border, backgroundColor: hexToRgba(theme.value.palette.surface, 0.7) }"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <div class="text-sm font-semibold" :style="headingStyle">{{ entry.item.name }}</div>
                    <div
                      v-if="cartEntryDescription(entry)"
                      class="mt-0.5 text-xs"
                      :style="mutedStyle"
                    >
                      {{ cartEntryDescription(entry) }}
                    </div>
                    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs" :style="mutedStyle">
                      <span class="inline-flex items-center gap-1 rounded-full px-2 py-1" :style="chipStyle">
                        Количество: <strong class="font-semibold">{{ entry.quantity }}</strong>
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full px-2 py-1" :style="chipStyle">
                        За шт.: <strong class="font-semibold">{{ fmt(entry.item.price) }}</strong>
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="text-sm font-semibold" :style="headingStyle">{{ fmt(entry.lineTotal) }}</div>
                    <button
                      type="button"
                      class="flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition"
                      :style="secondaryButtonStyle"
                      @click="removeFromCart(entry.key)"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="!groupedCart.length"
                class="rounded-xl border border-dashed p-6 text-center text-sm"
                :style="{ borderColor: theme.value.palette.border, color: theme.value.palette.muted }"
              >
                Корзина пуста. Добавьте блюда, чтобы оформить заказ.
              </div>
            </div>
            <div class="mt-4 space-y-2 rounded-xl p-3 text-sm shadow-inner" :style="summaryCardStyle">
              <div class="flex items-center justify-between">
                <span>Сумма блюд</span>
                <span class="font-medium" :style="headingStyle">{{ fmt(totals.subtotal) }}</span>
              </div>
              <div class="flex items-center justify-between" v-if="totals.delivery">
                <span>Доставка</span>
                <span class="font-medium" :style="headingStyle">{{ fmt(totals.delivery) }}</span>
              </div>
              <div class="flex items-center justify-between border-t pt-2 font-semibold" :style="{ borderColor: theme.value.palette.border, color: theme.value.palette.text }">
                <span>Итого</span>
                <span>{{ fmt(totals.total) }}</span>
              </div>
            </div>
          </div>
          <label class="text-sm" :style="mutedStyle">Комментарий курьеру
            <textarea
              v-model="form.comment"
              name="comment"
              rows="4"
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border px-3 py-2"
              :style="inputStyle"
              placeholder="Код домофона, пожелания…"
            ></textarea>
          </label>
          <button class="rounded-xl py-2.5 transition disabled:opacity-50" :style="primaryButtonStyle" :disabled="!hasItems">
            Подтвердить заказ
          </button>
          <a
            :href="whatsappOrderLink"
            target="_blank"
            class="rounded-xl border py-2 text-center transition"
            :style="whatsappButtonStyle"
            :class="{ 'pointer-events-none opacity-60': !hasItems }"
          >
            Отправить в WhatsApp
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import useDate from '~/composables/useDate'
import { useCartStore } from '~/store/cart'
import type { CartEntry } from '~/types/cart'
import { buildCartLines, calculateCartTotals, cartEntryDescription, composeOrderMessage, groupCartItems } from '~/utils/cart'
import { DEFAULT_MENU_THEME } from '~/config/menuThemes'
import { hexToRgba, resolveMenuTheme } from '~/utils/theme'
import type { ResolvedMenuTheme } from '~/types/theme'

interface Settings {
  cafeName: string
  whatsapp: string
  deliveryFee: number
}

interface Props {
  isOpen: boolean
  settings: Settings
  theme?: ResolvedMenuTheme
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:is-open', value: boolean): void }>()

const cartStore = useCartStore()
const { fmt } = useDate()

const theme = computed(() => props.theme ?? resolveMenuTheme(DEFAULT_MENU_THEME))

const dialogStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  color: theme.value.palette.text,
}))

const headingStyle = computed(() => ({
  color: theme.value.palette.text,
  fontFamily: theme.value.fonts.heading,
}))

const mutedStyle = computed(() => ({
  color: theme.value.palette.muted,
}))

const inputStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  borderColor: theme.value.palette.border,
  color: theme.value.palette.text,
}))

const chipStyle = computed(() => ({
  backgroundColor: theme.value.palette.subtle,
  color: theme.value.palette.text,
}))

const summaryCardStyle = computed(() => ({
  backgroundColor: hexToRgba(theme.value.palette.surface, 0.6),
  color: theme.value.palette.text,
}))

const badgeStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  color: theme.value.palette.text,
}))

const primaryButtonStyle = computed(() => ({
  backgroundColor: theme.value.palette.primary,
  color: theme.value.palette.primaryContent,
}))

const secondaryButtonStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  color: theme.value.palette.text,
  borderColor: theme.value.palette.border,
}))

const whatsappButtonStyle = computed(() => ({
  borderColor: theme.value.palette.accent,
  color: theme.value.palette.accent,
  backgroundColor: 'transparent',
}))

const closeButtonStyle = computed(() => ({
  backgroundColor: theme.value.palette.surface,
  color: theme.value.palette.muted,
  borderColor: theme.value.palette.border,
}))

const form = reactive({
  name: '',
  phone: '',
  type: 'delivery',
  address: '',
  time: 'asap',
  comment: '',
})

const cartItems = computed(() => cartStore.cart as CartEntry[])
const groupedCart = computed(() => groupCartItems(cartItems.value))
const totals = computed(() => calculateCartTotals(groupedCart.value, props.settings.deliveryFee))
const hasItems = computed(() => groupedCart.value.length > 0)

const quickOrderLines = computed(() => buildCartLines(groupedCart.value, fmt, totals.value))

const quickOrderMessage = computed(() => composeOrderMessage(props.settings.cafeName, quickOrderLines.value, {
  customer: {
    name: form.name,
    phone: form.phone,
    type: form.type,
    address: form.address,
    time: form.time,
    comment: form.comment,
  },
}))

const whatsappOrderLink = computed(() => {
  if (!hasItems.value) return '#'
  const phone = props.settings.whatsapp.replace(/\D/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(quickOrderMessage.value)}`
})

const requiresAddress = computed(() => form.type === 'delivery')

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) return
  if (!hasItems.value) {
    emit('update:is-open', false)
  }
})

function close () {
  emit('update:is-open', false)
}

function removeFromCart (key: string) {
  cartStore.cart = cartStore.cart.filter(entry => ((entry as CartEntry).cartKey || entry.id) !== key)
}

function handleSubmit () {
  if (!hasItems.value) return
  if (process.client) {
    window.open(whatsappOrderLink.value, '_blank')
  }
  close()
}
</script>
