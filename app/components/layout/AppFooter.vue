<template>
  <footer
    id="footer"
    class="mt-8 border-t"
    :style="footerStyle"
  >
    <div class="mx-auto container-capped px-4 pt-6 pb-[96px] md:pb-6 text-sm flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div>
        <strong id="fCafe" :style="headingStyle">{{ settings.cafeName }}</strong> •
        <span id="fAddr" :style="mutedTextStyle">{{ settings.address }}</span> •
        <a id="fCall" class="underline" :style="linkStyle" :href="callHref" @click="handleCallClick">{{ settings.phone }}</a>
      </div>
      <div class="flex gap-2">
        <button @click="printPage" class="px-3 py-1.5 rounded-lg transition hover:opacity-90" :style="mutedButtonStyle">🖨️ Печать QR/меню</button>
        <button id="darkToggleBottom" class="px-3 py-1.5 rounded-lg transition hover:opacity-90" :style="mutedButtonStyle" @click="toggleTheme">🌗 Тёмная тема</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useTelegram } from '~/composables/useTelegram'
import { DEFAULT_MENU_THEME } from '~/config/menuThemes'
import { resolveMenuTheme } from '~/utils/theme'
import type { MenuThemeConfig } from '~/types/theme'

interface Props {
  settings: {
    cafeName: string
    address: string
    phone: string
  }
  theme?: MenuThemeConfig
}

const props = defineProps<Props>()
const { toggleTheme } = useTheme()
const { isTelegram, openLink } = useTelegram()

const resolvedTheme = computed(() => resolveMenuTheme(props.theme ?? DEFAULT_MENU_THEME))

const footerStyle = computed(() => ({
  backgroundColor: resolvedTheme.value.palette.surface,
  color: resolvedTheme.value.palette.text,
  borderTopColor: resolvedTheme.value.palette.border,
}))

const headingStyle = computed(() => ({
  color: resolvedTheme.value.palette.text,
}))

const mutedTextStyle = computed(() => ({
  color: resolvedTheme.value.palette.muted,
}))

const linkStyle = computed(() => ({
  color: resolvedTheme.value.palette.primary,
}))

const mutedButtonStyle = computed(() => ({
  backgroundColor: resolvedTheme.value.palette.subtle,
  color: resolvedTheme.value.palette.text,
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

function printPage () {
  if (!process.client) return
  window.print()
}
</script>
