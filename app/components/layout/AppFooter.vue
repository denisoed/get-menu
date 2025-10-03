<template>
  <footer id="footer" class="mt-8 bg-white border-t">
    <div class="mx-auto container-capped px-4 py-6 text-sm text-slate-600 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
      <div>
        <strong id="fCafe">{{ settings.cafeName }}</strong> • <span id="fAddr">{{ settings.address }}</span> •
        <a id="fCall" class="underline" :href="callHref">{{ settings.phone }}</a>
      </div>
      <div class="flex gap-2">
        <button @click="printPage" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200">🖨️ Печать QR/меню</button>
        <button id="darkToggleBottom" class="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200" @click="toggleTheme">🌗 Тёмная тема</button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '~/composables/useTheme'

interface Props {
  settings: {
    cafeName: string
    address: string
    phone: string
  }
}

const props = defineProps<Props>()
const { toggleTheme } = useTheme()

const callHref = computed(() => {
  const digits = props.settings.phone.replace(/\s+/g, '')
  return `tel:${digits}`
})

function printPage () {
  if (!process.client) return
  window.print()
}
</script>
