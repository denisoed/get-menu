<template>
  <div
    id="topbar"
    class="w-full backdrop-blur sticky top-0 z-40 shadow-soft border-b"
    :style="topbarStyle"
  >
    <div class="mx-auto container-capped px-4 py-2 flex items-center justify-between gap-2">
      <div class="flex items-center gap-3">
        <button
          id="themeToggle"
          class="px-3 py-1 rounded-full text-sm border transition hover:opacity-80"
          :style="toggleButtonStyle"
          @click="toggleTheme"
        >
          🌓 Тема
        </button>
        <span class="hidden sm:inline text-sm" :style="mutedTextStyle">⏰ <span id="openHours">{{ settings.openHours }}</span></span>
        <span class="hidden md:inline text-sm" :style="mutedTextStyle">📍 <span id="address">{{ settings.address }}</span></span>
      </div>
      <div class="flex items-center gap-2">
        <a
          id="callLink"
          class="text-sm px-3 py-1 rounded-full border transition hover:opacity-90"
          :style="callButtonStyle"
          :href="callHref"
          @click="handleCallClick"
        >
          ☎ Позвонить
        </a>
        <button
          id="cartBtn"
          class="relative px-4 py-1 rounded-full font-semibold transition hover:opacity-90 disabled:opacity-60"
          :style="primaryButtonStyle"
          :disabled="!cartCount"
          @click="emit('open-quick-order')"
        >
          Корзина
          <span
            id="cartCount"
            class="min-w-4 min-h-[20px] flex items-center justify-center leading-[normal] absolute -top-2 -right-2 text-[11px] border rounded-full px-1.5"
            :style="cartBadgeStyle"
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
import { DEFAULT_MENU_THEME } from '~/config/menuThemes'
import { resolveMenuTheme } from '~/utils/theme'
import type { MenuThemeConfig } from '~/types/theme'

interface Props {
  settings: {
    address: string
    phone: string
    openHours: string
  }
  theme?: MenuThemeConfig
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'open-quick-order'): void }>()

const cartStore = useCartStore()
const cartCount = computed(() => cartStore.cart.length)
const { toggleTheme } = useTheme()
const { isTelegram, openLink } = useTelegram()

const resolvedTheme = computed(() => resolveMenuTheme(props.theme ?? DEFAULT_MENU_THEME))

const topbarStyle = computed(() => ({
  backgroundColor: resolvedTheme.value.palette.surface,
  color: resolvedTheme.value.palette.text,
  borderBottomColor: resolvedTheme.value.palette.border,
}))

const mutedTextStyle = computed(() => ({
  color: resolvedTheme.value.palette.muted,
}))

const toggleButtonStyle = computed(() => ({
  borderColor: resolvedTheme.value.palette.border,
  color: resolvedTheme.value.palette.text,
  backgroundColor: resolvedTheme.value.palette.subtle,
}))

const callButtonStyle = computed(() => ({
  color: resolvedTheme.value.palette.primary,
  borderColor: resolvedTheme.value.palette.primary,
  backgroundColor: 'transparent',
}))

const primaryButtonStyle = computed(() => ({
  backgroundColor: resolvedTheme.value.palette.primary,
  color: resolvedTheme.value.palette.primaryContent,
}))

const cartBadgeStyle = computed(() => ({
  backgroundColor: resolvedTheme.value.palette.surface,
  color: resolvedTheme.value.palette.primary,
  borderColor: resolvedTheme.value.palette.primary,
}))

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
