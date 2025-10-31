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
      <div
        v-if="isCompleted"
        class="mt-8 flex h-full flex-col items-center justify-center"
      >
        <div
          class="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-8 text-center shadow-soft backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80"
        >
          <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),_transparent_70%)] dark:bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.22),_transparent_75%)]"
          ></div>
          <div class="relative flex flex-col items-center gap-6">
            <div class="inline-flex items-center justify-center rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-[3px] shadow-lg">
              <div class="grid h-20 w-20 place-items-center rounded-[1.25rem] bg-white text-brand-600 dark:bg-slate-950/80 dark:text-brand-300">
                <svg
                  aria-hidden="true"
                  class="h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
            </div>
            <div class="space-y-2 text-slate-600 dark:text-slate-300">
              <div class="text-2xl font-semibold leading-tight text-slate-900 dark:text-slate-100">Заказ оформлен</div>
              <div class="text-sm">⏳ Отправляем в кафе…</div>
              <div class="text-sm">📩 Подробности придут в чат</div>
            </div>
            <div class="flex w-full flex-nowrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:text-slate-100"
                @click="handleFinish"
              >
                Завершить
              </button>
              <button
                type="button"
                class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
                @click="handleContinue"
              >
                Продолжить
              </button>
            </div>
          </div>
        </div>
      </div>
      <form v-else class="mt-4 grid md:grid-cols-2 gap-4" @submit.prevent="handleSubmit">
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
                        За шт.: <strong class="font-semibold">{{ fmt(entry.item.price) }}</strong>
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-3">
                    <div class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ fmt(entry.lineTotal) }}</div>
                    <UiQuantitySelector
                      :model-value="entry.quantity"
                      class="w-full max-w-[140px]"
                      @update:model-value="value => updateQuantity(entry, value)"
                    />
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
          <div class="sticky bottom-0 mt-auto bg-white dark:bg-slate-950">
            <button
              class="w-full rounded-xl bg-brand-600 py-3 text-white hover:bg-brand-700 disabled:opacity-50"
              :disabled="!hasItems"
            >
              Подтвердить заказ
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import useDate from '~/composables/useDate'
import { useCartStore } from '~/store/cart'
import type { CartEntry, GroupedCartItem } from '~/types/cart'
import { calculateCartTotals, cartEntryDescription, groupCartItems } from '~/utils/cart'

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

const requiresAddress = computed(() => form.type === 'delivery')

const isCompleted = ref(false)

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetCompletion()
    return
  }
  if (!hasItems.value) {
    emit('update:is-open', false)
  }
})

function close () {
  emit('update:is-open', false)
}

function resetCompletion () {
  isCompleted.value = false
}

function resetForm () {
  form.name = ''
  form.phone = ''
  form.type = 'delivery'
  form.address = ''
  form.time = 'asap'
  form.comment = ''
}

function closeMiniApp () {
  if (!process.client) {
    return false
  }

  const webApp = window.Telegram?.WebApp

  if (!webApp) {
    return false
  }

  try {
    webApp.close?.()
    return true
  } catch (error) {
    console.warn('[telegram]', 'Failed to close mini app', error)
  }

  return false
}

function handleFinish () {
  const closed = closeMiniApp()
  if (!closed) {
    close()
  }
}

function handleContinue () {
  resetForm()
  resetCompletion()
  cartStore.cart = []
  close()
}

function updateQuantity (entry: GroupedCartItem, nextQuantity: number) {
  const current = entry.quantity
  const safeNext = Number.isFinite(nextQuantity) ? Math.max(1, Math.floor(nextQuantity)) : current
  if (safeNext === current) return

  if (safeNext > current) {
    const diff = safeNext - current
    cartStore.addToCart({ ...entry.item }, diff)
    return
  }

  removeQuantity(entry.key, current - safeNext)
}

function removeQuantity (key: string, quantity: number) {
  let remaining = Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : Infinity
  if (remaining <= 0) return

  cartStore.cart = cartStore.cart.filter((entry) => {
    const matches = ((entry as CartEntry).cartKey || entry.id) === key
    if (!matches) return true
    if (remaining > 0) {
      remaining -= 1
      return false
    }
    return true
  })
}

function removeFromCart (key: string) {
  removeQuantity(key, Infinity)
}

function handleSubmit () {
  if (!hasItems.value) return
  if (isCompleted.value) return

  isCompleted.value = true
}
</script>
