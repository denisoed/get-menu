<template>
  <div class="space-y-0" :style="themeStyles.root">
    <!-- Header / Hero -->
    <header id="hero" class="rounded-b-3xl" :style="themeStyles.hero">
      <div class="mx-auto container-capped px-4 pt-8 pb-10">
        <div class="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div class="mb-5">
              <BackButton />
            </div>
            <h1
              id="cafeName"
              class="text-3xl md:text-4xl font-extrabold leading-tight"
              :style="themeStyles.heading"
            >
              {{ settings.cafeName }}
            </h1>
            <p id="announcement" class="mt-3" :style="themeStyles.muted">{{ settings.announcement }}</p>
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
    <section id="controls" class="sticky top-[46px] z-30 border-b" :style="themeStyles.controls">
      <div class="mx-auto container-capped px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div class="relative w-full md:w-1/2">
          <input
            id="search"
            v-model="searchTerm"
            type="text"
            inputmode="search"
            placeholder="Поиск по меню…"
            enterkeyhint="done"
            class="w-full rounded-xl border px-4 py-2.5 pr-14 outline-none focus:ring-2"
            :style="themeStyles.searchInput"
          />
          <button
            v-if="searchTerm"
            type="button"
            class="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full shadow-md ring-1 transition focus:outline-none"
            :style="themeStyles.searchClear"
            aria-label="Очистить поиск"
            @click="clearSearch"
          >
            <span aria-hidden="true" class="text-base leading-none">✕</span>
          </button>
        </div>
        <div id="categories" class="flex gap-2 overflow-x-auto">
          <button
            v-for="category in categories"
            :key="category"
            class="px-3 py-1.5 rounded-full text-sm border whitespace-nowrap transition-colors flex items-center gap-1.5"
            :style="categoryButtonStyle(category)"
            @click="selectCategory(category)"
          >
            <span
              v-if="category === FAVORITES_CATEGORY"
              aria-hidden="true"
              :style="selectedCategory === FAVORITES_CATEGORY ? themeStyles.favoritesActiveIcon : themeStyles.favoritesIcon"
              class="flex h-4 w-4 items-center justify-center"
            >
              <svg
                class="h-3 w-3"
                :style="selectedCategory === FAVORITES_CATEGORY ? themeStyles.favoritesActiveIcon : themeStyles.favoritesIcon"
                viewBox="0 0 20 20"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.9999 17.083c-.2793 0-.5586-.096-.7832-.2882-3.8682-3.2944-5.8008-5.1288-6.6533-6.395-1.03-1.535-1.1367-3.5485-.2656-5.133C3.1093 3.6849 4.6883 2.917 6.4377 2.917c1.2784 0 2.5763.4727 3.5622 1.3228.9859-.8501 2.2838-1.3228 3.5622-1.3228 1.7494 0 3.3284.7678 4.1399 2.3498.8711 1.5844.7644 3.598-.2656 5.133-1.2383 1.8482-3.3418 3.904-6.6533 6.395a1.0524 1.0524 0 0 1-.78.2882Z"
              />
            </svg>
          </span>
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
        :is-favorite="isFavorite"
        :toggle-favorite="toggleFavorite"
      />

      <!-- Cart Drawer (sticky on desktop) -->
      <CartDrawer
        :delivery-fee="settings.deliveryFee ?? 0"
        :min-order="settings.minOrder ?? 0"
        :whatsapp-phone="settings.whatsapp"
        :cafe-name="settings.cafeName"
        :theme="resolvedTheme"
        @checkout="openQuickOrder"
      />
    </main>

    <CartQuickOrder
      v-model:is-open="isQuickOrderOpen"
      :settings="{
        cafeName: settings.cafeName,
        whatsapp: settings.whatsapp,
        deliveryFee: settings.deliveryFee ?? 0,
      }"
      :theme="resolvedTheme"
    />

    <!-- Mobile Cart Bar -->
    <div class="md:hidden fixed bottom-4 inset-x-0 z-40 px-4">
      <div class="shadow-soft rounded-2xl px-4 py-2 flex items-center justify-between border" :style="themeStyles.cartBar">
        <div>
          <div class="text-xs" :style="themeStyles.muted">Итого</div>
          <div id="cartTotalMobile" class="font-semibold">{{ fmt(totals.total) }}</div>
        </div>
        <button
          class="rounded-xl px-4 py-2 disabled:opacity-50"
          :style="themeStyles.primaryButton"
          :disabled="!groupedCart.length || !meetsMinOrder"
          @click="openQuickOrder"
        >
          Оформить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { resolveMenuTheme, buildThemeCssVariables, hexToRgba } from '~/utils/theme'
import useDate from '~/composables/useDate'
import { useFavorites } from '~/composables/useFavorites'
import { useCartStore } from '~/store/cart'
import BackButton from '~/components/ui/BackButton.vue'
import type { MenuCafeSettings, MenuItem } from '~/types/menu'
import type { MenuThemeConfig } from '~/types/theme'
import type { CartEntry } from '~/types/cart'
import { calculateCartTotals, groupCartItems } from '~/utils/cart'

interface Props {
  menu: MenuItem[]
  settings: MenuCafeSettings
  theme: MenuThemeConfig
}

const props = defineProps<Props>()

const resolvedTheme = computed(() => resolveMenuTheme(props.theme))
const themeStyles = computed(() => {
  const palette = resolvedTheme.value.palette
  const background = resolvedTheme.value.background
  const cssVars = buildThemeCssVariables(resolvedTheme.value)
  const style: Record<string, string> = {
    ...cssVars,
    color: palette.text,
    backgroundColor: palette.background,
    fontFamily: resolvedTheme.value.fonts.body,
  }

  if (background.image) {
    const overlay = hexToRgba(background.color, background.overlayOpacity)
    style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url(${background.image})`
    style.backgroundSize = 'cover'
    style.backgroundAttachment = 'fixed'
    style.backgroundPosition = 'center'
  }

  return {
    root: style,
    hero: {
      backgroundColor: palette.surface,
      color: palette.text,
    },
    heading: {
      fontFamily: resolvedTheme.value.fonts.heading,
      color: palette.text,
    },
    muted: {
      color: palette.muted,
    },
    controls: {
      backgroundColor: hexToRgba(palette.surface, 0.9),
      color: palette.text,
      borderBottomColor: palette.border,
    },
    primaryBadge: {
      backgroundColor: palette.primary,
      color: palette.primaryContent,
    },
    searchInput: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      color: palette.text,
    },
    searchClear: {
      backgroundColor: palette.surface,
      color: palette.muted,
      borderColor: palette.border,
    },
    categoryActive: {
      backgroundColor: palette.primary,
      color: palette.primaryContent,
      borderColor: palette.primary,
    },
    categoryInactive: {
      backgroundColor: palette.surface,
      color: palette.muted,
      borderColor: palette.border,
    },
    favoritesIcon: {
      color: palette.primary,
      fill: palette.primary,
    },
    favoritesActiveIcon: {
      color: palette.primaryContent,
      fill: palette.primaryContent,
    },
    mainSurface: {
      backgroundColor: palette.surface,
      color: palette.text,
      borderColor: palette.border,
    },
    highlight: {
      backgroundColor: palette.subtle,
      color: palette.text,
    },
    primaryButton: {
      backgroundColor: palette.primary,
      color: palette.primaryContent,
    },
    secondaryButton: {
      backgroundColor: palette.surface,
      color: palette.text,
      borderColor: palette.border,
    },
    cartBar: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      color: palette.text,
    },
  }
})

const settings = computed(() => props.settings)
const { fmt } = useDate()
const cartStore = useCartStore()

const searchTerm = ref('')

const FAVORITES_CATEGORY = 'Избранное'
const ALL_CATEGORY = 'Все'

const selectedCategory = ref(ALL_CATEGORY)

const { isFavorite, toggleFavorite } = useFavorites()

function clearSearch () {
  searchTerm.value = ''
}

const categories = computed(() => {
  const uniqueCategories = Array.from(new Set(props.menu.map(item => item.category)))
  return [
    FAVORITES_CATEGORY,
    ALL_CATEGORY,
    ...uniqueCategories.filter(category => category !== ALL_CATEGORY && category !== FAVORITES_CATEGORY),
  ]
})

const filteredMenu = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  return props.menu.filter((item) => {
    const inCategory = selectedCategory.value === ALL_CATEGORY
      ? true
      : selectedCategory.value === FAVORITES_CATEGORY
        ? isFavorite(item.id)
        : item.category === selectedCategory.value
    const matchesQuery = !query || item.name.toLowerCase().includes(query)
    return inCategory && matchesQuery
  })
})

function selectCategory (category: string) {
  selectedCategory.value = category
}

function categoryButtonStyle (category: string) {
  return selectedCategory.value === category
    ? themeStyles.value.categoryActive
    : themeStyles.value.categoryInactive
}

const cartItems = computed(() => cartStore.cart as CartEntry[])
const groupedCart = computed(() => groupCartItems(cartItems.value))
const totals = computed(() => calculateCartTotals(groupedCart.value, settings.value.deliveryFee ?? 0))
const meetsMinOrder = computed(() => {
  const minOrder = settings.value.minOrder ?? 0
  return totals.value.total >= minOrder
})

const isQuickOrderOpen = ref(false)

const whatsappGreetingLink = computed(() => {
  const phone = settings.value.whatsapp.replace(/\D/g, '')
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
