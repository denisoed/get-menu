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
              @keydown="dismissOnDoneKey"
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
              @keydown="dismissOnDoneKey"
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
              @keydown="dismissOnDoneKey"
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
            <textarea v-model="form.comment" name="comment" rows="4" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400" placeholder="Код домофона, пожелания…"></textarea>
          </label>
          <button class="rounded-xl bg-brand-600 text-white py-2.5 hover:bg-brand-700 disabled:opacity-50" :disabled="!hasItems">
            Подтвердить заказ
          </button>
          <a
            :href="whatsappOrderLink"
            target="_blank"
            class="rounded-xl border border-green-600 text-green-700 py-2 text-center hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900/40"
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
import { handleDoneKey } from '~/utils/keyboard'

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

const dismissOnDoneKey = handleDoneKey

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
