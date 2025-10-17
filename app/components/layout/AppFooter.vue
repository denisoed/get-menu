<template>
  <footer id="footer" class="mt-8 bg-white border-t dark:bg-slate-950 dark:border-slate-800">
    <div class="mx-auto container-capped px-4 pt-6 pb-[96px] md:pb-6 text-sm text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div>
        <strong id="fCafe">{{ settings.cafeName }}</strong> • <span id="fAddr">{{ settings.address }}</span> •
        <a id="fCall" class="underline" :href="callHref" @click="handleCallClick">{{ settings.phone }}</a>
      </div>
      <div class="flex gap-2">
        <button @click="printPage" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">🖨️ Печать QR/меню</button>
        <button id="darkToggleBottom" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700" @click="toggleTheme">🌗 Тёмная тема</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '~/composables/useTheme'
import { useTelegram } from '~/composables/useTelegram'

interface Props {
  settings: {
    cafeName: string
    address: string
    phone: string
  }
}

const props = defineProps<Props>()
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

function printPage () {
  if (!process.client) return
  window.print()
}
</script>
