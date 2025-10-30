<template>
  <div
    id="quickOrder"
    class="fixed inset-0 items-end md:items-center justify-center z-50"
    :class="{ hidden: !isOpen || !hasItems, flex: isOpen && hasItems }"
  >
    <div class="absolute inset-0 bg-transparent backdrop-blur-sm" @click="close"></div>
    <div class="w-full md:w-[720px] bg-white rounded-none md:rounded-2xl p-5 h-full md:h-auto md:max-h-[90vh] overflow-y-auto shadow-soft z-50 dark:bg-slate-950 dark:text-slate-100">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Оформление заказа</h3>
        <button
          class="relative h-10 w-10 rounded-full bg-white text-slate-500 shadow-md ring-1 ring-slate-200 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-900/80 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
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
          <label class="text-sm text-slate-700 dark:text-slate-200">Имя
            <input
              v-model="form.name"
              name="name"
              required
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="Ваше имя"
            />
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200">Телефон
            <input
              v-model="form.phone"
              name="phone"
              required
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="+996..."
            />
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200">Способ получения
            <select v-model="form.type" name="type" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
              <option value="delivery">Доставка</option>
              <option value="pickup">Самовывоз</option>
            </select>
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200" v-show="requiresAddress">Адрес (для доставки)
            <input
              v-model="form.address"
              name="address"
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="Улица, дом, подъезд"
            />
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200">Время
            <select v-model="form.time" name="time" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
              <option value="asap">Как можно скорее</option>
              <option value="30m">Через 30 минут</option>
              <option value="1h">Через 1 час</option>
            </select>
          </label>
        </div>
        <div class="grid gap-3">
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80">
            <div class="flex items-center justify-between gap-3">
              <div class="font-medium text-slate-800 dark:text-slate-100">Состав заказа</div>
              <div class="text-xs text-slate-500 dark:text-slate-400">{{ groupedCart.length }} поз.</div>
            </div>
            <div class="mt-3 grid gap-3">
              <div
                v-for="entry in groupedCart"
                :key="entry.key"
                class="rounded-xl border border-slate-200 bg-white/70 p-3 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/70"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ entry.item.name }}</div>
                    <div
                      v-if="cartEntryDescription(entry)"
                      class="mt-0.5 text-xs text-slate-500 dark:text-slate-400"
                    >
                      {{ cartEntryDescription(entry) }}
                    </div>
                    <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                      <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/60">
                        Количество: <strong class="font-semibold">{{ entry.quantity }}</strong>
                      </span>
                      <span class="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800/60">
                        За шт.: <strong class="font-semibold">{{ fmt(entry.item.price) }}</strong>
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ fmt(entry.lineTotal) }}</div>
                    <button
                      type="button"
                      class="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                      @click="removeFromCart(entry.key)"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-if="!groupedCart.length"
                class="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400"
              >
                Корзина пуста. Добавьте блюда, чтобы оформить заказ.
              </div>
            </div>
            <div class="mt-4 space-y-2 rounded-xl bg-white/60 p-3 text-sm text-slate-700 shadow-inner dark:bg-slate-900/60 dark:text-slate-200">
              <div class="flex items-center justify-between">
                <span>Сумма блюд</span>
                <span class="font-medium text-slate-900 dark:text-slate-100">{{ fmt(totals.subtotal) }}</span>
              </div>
              <div class="flex items-center justify-between" v-if="totals.delivery">
                <span>Доставка</span>
                <span class="font-medium text-slate-900 dark:text-slate-100">{{ fmt(totals.delivery) }}</span>
              </div>
              <div class="flex items-center justify-between border-t border-slate-200 pt-2 font-semibold text-slate-900 dark:border-slate-800 dark:text-slate-100">
                <span>Итого</span>
                <span>{{ fmt(totals.total) }}</span>
              </div>
            </div>
          </div>
          <label class="text-sm text-slate-700 dark:text-slate-200">Комментарий курьеру
            <textarea
              v-model="form.comment"
              name="comment"
              rows="4"
              enterkeyhint="done"
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400"
              placeholder="Код домофона, пожелания…"
            ></textarea>
          </label>
          <div class="sticky bottom-0 mt-auto flex flex-nowrap items-center gap-3 bg-white pt-3 dark:bg-slate-950">
            <button
              class="flex-1 rounded-xl bg-brand-600 py-3 text-white hover:bg-brand-700 disabled:opacity-50"
              :disabled="!hasItems"
            >
              Подтвердить заказ
            </button>
            <a
              :href="whatsappOrderLink"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-green-600 text-green-600 transition hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-green-500/60 dark:text-green-400 dark:hover:bg-green-900/30"
              :class="{ 'pointer-events-none opacity-60': !hasItems }"
              :aria-disabled="!hasItems"
            >
              <svg
                class="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M12 2.25a9.75 9.75 0 0 0-8.36 14.94l-.96 3.59a1 1 0 0 0 1.22 1.22l3.59-.96A9.75 9.75 0 1 0 12 2.25Zm0 1.5a8.25 8.25 0 1 1-3.96 15.53 1 1 0 0 0-.66-.07l-2.47.66.66-2.47a1 1 0 0 0-.07-.66A8.25 8.25 0 0 1 12 3.75Zm-2.16 4.7a1 1 0 0 0-.73.36 3.34 3.34 0 0 0-.74 2.26 5.71 5.71 0 0 0 1 2.42 9.58 9.58 0 0 0 3.68 3.68 5.7 5.7 0 0 0 2.42 1 3.34 3.34 0 0 0 2.26-.74 1 1 0 0 0 .36-.73 1 1 0 0 0-.28-.74l-1.48-1.48a1 1 0 0 0-.74-.3 1 1 0 0 0-.74.32l-.36.42a.3.3 0 0 1-.28.1 4.52 4.52 0 0 1-2.13-1.18 4.52 4.52 0 0 1-1.18-2.13.3.3 0 0 1 .1-.28l.42-.36a1 1 0 0 0 .32-.74 1 1 0 0 0-.3-.74l-1.48-1.48a1 1 0 0 0-.74-.28Z"
                />
              </svg>
              <span class="sr-only">Отправить в WhatsApp</span>
            </a>
          </div>
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

interface Settings {
  cafeName: string
  whatsapp: string
  deliveryFee: number
}

interface Props {
  isOpen: boolean
  settings: Settings
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:is-open', value: boolean): void }>()

const cartStore = useCartStore()
const { fmt } = useDate()

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
