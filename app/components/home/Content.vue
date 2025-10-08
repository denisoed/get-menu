<template>
  <!-- Header / Hero -->
  <header id="hero" class="bg-white dark:bg-slate-950">
    <div class="mx-auto container-capped px-4 pt-8 pb-10">
      <div class="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 id="cafeName" class="text-3xl md:text-4xl font-extrabold leading-tight text-slate-900 dark:text-slate-100">{{ settings.cafeName }}</h1>
          <p id="announcement" class="mt-3 text-slate-600 dark:text-slate-300">{{ settings.announcement }}</p>
          <!-- <div class="mt-5 flex gap-3">
            <a href="#controls" class="px-5 py-2.5 rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-soft">Смотреть меню</a>
          </div> -->
        </div>
        <div>
          <div class="relative rounded-2xl overflow-hidden shadow-soft">
            <img
              id="bannerImage"
              class="w-full h-60 object-cover"
              :src="settings.banner.image"
              :alt="settings.banner.title"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="absolute bottom-3 left-3 text-white">
              <div id="bannerTitle" class="text-xl font-semibold">{{ settings.banner.title }}</div>
              <div id="bannerSub" class="opacity-90 text-sm">{{ settings.banner.subtitle }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Controls: Search + Categories -->
  <section id="controls" class="sticky top-[46px] z-30 bg-white/70 backdrop-blur border-b border-slate-100 dark:bg-slate-950/80 dark:border-slate-800">
    <div class="mx-auto container-capped px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div class="flex items-center gap-2 w-full md:w-1/2">
        <input
          id="search"
          v-model="searchTerm"
          type="search"
          placeholder="Поиск по меню…"
          class="w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-300 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-400 dark:focus:ring-brand-500"
        />
      </div>
      <div id="categories" class="flex gap-2 overflow-x-auto">
        <button
          v-for="category in categories"
          :key="category"
          class="px-3 py-1.5 rounded-full text-sm border border-slate-200 hover:bg-slate-50 whitespace-nowrap dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800"
          :class="{
            'bg-brand-600 text-white border-brand-600 dark:border-brand-500': selectedCategory === category,
          }"
          @click="selectCategory(category)"
        >
          {{ category }}
        </button>
      </div>
    </div>
  </section>

  <!-- Menu List -->
  <main id="menu" class="mx-auto container-capped px-4 py-8 grid md:grid-cols-[1fr_360px] gap-6">
    <!-- Items -->
    <HomeListCards
      :menu="filteredMenu"
      :format-price="fmt"
    />

    <!-- Cart Drawer (sticky on desktop) -->
    <CartDrawer
      :delivery-fee="settings.deliveryFee"
      :min-order="settings.minOrder"
      :whatsapp-phone="settings.whatsapp"
      :cafe-name="settings.cafeName"
      @checkout="openQuickOrder"
    />
  </main>

  <CartQuickOrder
    v-model:is-open="isQuickOrderOpen"
    :settings="{
      cafeName: settings.cafeName,
      whatsapp: settings.whatsapp,
      deliveryFee: settings.deliveryFee,
    }"
  />

  <!-- Mobile Cart Bar -->
  <div class="md:hidden fixed bottom-4 inset-x-0 z-40 px-4">
    <div class="bg-white border border-slate-200 shadow-soft rounded-2xl px-4 py-2 flex items-center justify-between dark:bg-slate-950 dark:border-slate-800">
      <div>
        <div class="text-xs text-slate-500 dark:text-slate-400">Итого</div>
        <div id="cartTotalMobile" class="font-semibold text-slate-900 dark:text-slate-100">{{ fmt(totals.total) }}</div>
      </div>
      <button
        class="rounded-xl bg-brand-600 text-white px-4 py-2 disabled:opacity-50"
        :disabled="!groupedCart.length || !meetsMinOrder"
        @click="openQuickOrder"
      >
        Оформить
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { SETTINGS } from '~/config/settings'
import useDate from '~/composables/useDate'
import { useCartStore } from '~/store/cart'
import type { MenuItem } from '~/types/menu'
import type { CartEntry } from '~/types/cart'
import { calculateCartTotals, groupCartItems } from '~/utils/cart'

interface Props {
  menu: MenuItem[]
}

const props = defineProps<Props>()

const settings = SETTINGS
const { fmt } = useDate()
const cartStore = useCartStore()

const searchTerm = ref('')
const selectedCategory = ref('Все')

const categories = computed(() => {
  const uniqueCategories = Array.from(new Set(props.menu.map(item => item.category)))
  return ['Все', ...uniqueCategories]
})

const filteredMenu = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  return props.menu.filter((item) => {
    const inCategory = selectedCategory.value === 'Все' || item.category === selectedCategory.value
    const matchesQuery = !query || item.name.toLowerCase().includes(query)
    return inCategory && matchesQuery
  })
})

function selectCategory (category: string) {
  selectedCategory.value = category
}

const cartItems = computed(() => cartStore.cart as CartEntry[])
const groupedCart = computed(() => groupCartItems(cartItems.value))
const totals = computed(() => calculateCartTotals(groupedCart.value, settings.deliveryFee))
const meetsMinOrder = computed(() => totals.value.total >= settings.minOrder)

const isQuickOrderOpen = ref(false)

const whatsappGreetingLink = computed(() => {
  const phone = settings.whatsapp.replace(/\D/g, '')
  const text = encodeURIComponent('Здравствуйте! Хочу сделать заказ.')
  return `https://wa.me/${phone}?text=${text}`
})

function openQuickOrder () {
  if (!groupedCart.value.length) return
  isQuickOrderOpen.value = true
}

defineExpose({
  openQuickOrder,
})
</script>
