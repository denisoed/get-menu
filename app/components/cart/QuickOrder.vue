<template>
  <div
    id="quickOrder"
    class="fixed inset-0 items-end md:items-center justify-center z-50"
    :class="{ hidden: !isOpen || !hasItems, flex: isOpen && hasItems }"
  >
    <div class="absolute inset-0 bg-black/50" @click="close"></div>
    <div class="w-full md:w-[720px] bg-white rounded-t-2xl md:rounded-2xl p-5 max-h-[90vh] overflow-y-auto shadow-soft z-50 dark:bg-slate-950 dark:text-slate-100">
      <div class="flex items-start justify-between gap-4">
        <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Оформление заказа</h3>
        <button class="text-slate-500 dark:text-slate-400" @click="close">✕</button>
      </div>
      <form class="mt-4 grid md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
        <div class="grid gap-3">
          <label class="text-sm text-slate-700 dark:text-slate-200">Имя
            <input v-model="form.name" name="name" required class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400" placeholder="Ваше имя"/>
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200">Телефон
            <input v-model="form.phone" name="phone" required class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400" placeholder="+996..."/>
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200">Способ получения
            <select v-model="form.type" name="type" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100">
              <option value="delivery">Доставка</option>
              <option value="pickup">Самовывоз</option>
            </select>
          </label>
          <label class="text-sm text-slate-700 dark:text-slate-200" v-show="requiresAddress">Адрес (для доставки)
            <input v-model="form.address" name="address" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400" placeholder="Улица, дом, подъезд"/>
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
          <div class="p-3 rounded-xl bg-slate-50 text-sm dark:bg-slate-900/80">
            <div class="font-medium text-slate-800 dark:text-slate-100">Состав заказа</div>
            <div class="mt-1 whitespace-pre-wrap text-slate-700 dark:text-slate-200">{{ orderSummary }}</div>
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
import { buildCartLines, calculateCartTotals, composeOrderMessage, groupCartItems } from '~/utils/cart'

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
const orderSummary = computed(() => quickOrderLines.value.join('\n'))

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

function handleSubmit () {
  if (!hasItems.value) return
  if (process.client) {
    window.open(whatsappOrderLink.value, '_blank')
  }
  close()
}
</script>
