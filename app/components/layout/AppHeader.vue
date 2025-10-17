<template>
  <div id="topbar" class="w-full bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-40 shadow-soft">
    <div class="mx-auto container-capped px-4 py-2 flex items-center justify-between gap-2 text-slate-700 dark:text-slate-200">
      <div class="flex items-center gap-3">
        <button id="themeToggle" class="px-3 py-1 rounded-full text-sm border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" @click="toggleTheme">
          🌓 Тема
        </button>
        <span class="hidden sm:inline text-sm text-slate-600 dark:text-slate-300">⏰ <span id="openHours">{{ settings.openHours }}</span></span>
        <span class="hidden md:inline text-sm text-slate-600 dark:text-slate-300">📍 <span id="address">{{ settings.address }}</span></span>
      </div>
      <div class="flex items-center gap-2">
        <a
          id="callLink"
          class="text-sm px-3 py-1 rounded-full border border-brand-300 text-brand-700 hover:bg-brand-50 dark:border-brand-500 dark:text-brand-200 dark:hover:bg-brand-900/40"
          :href="callHref"
          @click="handleCallClick"
        >
          ☎ Позвонить
        </a>
        <button
          id="cartBtn"
          class="relative px-4 py-1 rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          :disabled="!cartCount"
          @click="emit('open-quick-order')"
        >
          Корзина
          <span
            id="cartCount"
            class="min-w-4 min-h-[20px] flex items-center justify-center leading-[normal] absolute -top-2 -right-2 text-[11px] bg-white text-brand-700 border border-brand-600 rounded-full px-1.5 dark:bg-slate-950 dark:text-brand-200 dark:border-brand-500"
          >
            {{ cartCount }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '~/store/cart'
import { useTheme } from '~/composables/useTheme'
import { useTelegram } from '~/composables/useTelegram'

interface Props {
  settings: {
    address: string
    phone: string
    openHours: string
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'open-quick-order'): void }>()

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.cart.length)
const { toggleTheme } = useTheme()
const { isTelegram, openLink } = useTelegram()

const callHref = computed(() => {
  const digits = props.settings.phone.replace(/\s+/g, '')
  return `tel:${digits}`
})

const handleCallClick = (event: MouseEvent) => {
  if (openLink(callHref.value)) {
    event.preventDefault()
    return
  }

  if (isTelegram.value) {
    event.preventDefault()
    window.location.href = callHref.value
  }
}
</script>
