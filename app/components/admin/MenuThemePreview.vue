<template>
  <div class="space-y-5">
    <div class="rounded-2xl border shadow-soft overflow-hidden" :style="styles.root">
      <div class="px-5 py-6" :style="styles.hero">
        <div class="text-xs uppercase tracking-[0.25em]" :style="styles.kicker">Превью меню</div>
        <h4 class="mt-3 text-2xl font-bold" :style="styles.heading">{{ cafe.cafeName }}</h4>
        <p class="mt-2 text-sm" :style="styles.muted">{{ cafe.announcement }}</p>
      </div>
      <div>
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="border-t px-5 py-4"
          :style="styles.item"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <div class="font-semibold" :style="styles.heading">{{ item.name }}</div>
              <div class="text-xs uppercase tracking-[0.2em] mt-1" :style="styles.kicker">{{ item.category }}</div>
              <div v-if="item.tags.length" class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="rounded-full border px-2 py-0.5 text-xs"
                  :style="styles.tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-semibold" :style="styles.heading">{{ formatPrice(item.price) }}</div>
              <button
                type="button"
                class="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition"
                :style="styles.cta"
                disabled
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rounded-2xl border px-5 py-4 text-sm" :style="styles.helperCard">
      <div class="font-semibold" :style="styles.heading">Советы по теме</div>
      <p class="mt-2" :style="styles.helper">Проверьте читабельность текста и контраст кнопок перед публикацией.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { buildThemeCssVariables, hexToRgba } from '~/utils/theme'
import type { ResolvedMenuTheme } from '~/types/theme'

interface PreviewMenuItem {
  id: string
  name: string
  category: string
  price: number
  tags: string[]
}

interface PreviewCafe {
  cafeName: string
  announcement: string
}

interface Props {
  theme: ResolvedMenuTheme
  menuItems: PreviewMenuItem[]
  cafe: PreviewCafe
}

const props = defineProps<Props>()

const styles = computed(() => {
  const palette = props.theme.palette
  const background = props.theme.background
  const cssVars = buildThemeCssVariables(props.theme)
  const root: Record<string, string> = {
    ...cssVars,
    color: palette.text,
    backgroundColor: palette.background,
    fontFamily: props.theme.fonts.body,
  }

  if (background.image) {
    const overlay = hexToRgba(background.color, background.overlayOpacity)
    root.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url(${background.image})`
    root.backgroundSize = 'cover'
    root.backgroundPosition = 'center'
  }

  return {
    root,
    hero: {
      backgroundColor: palette.surface,
      color: palette.text,
    },
    kicker: {
      color: palette.accent,
    },
    heading: {
      color: palette.text,
      fontFamily: props.theme.fonts.heading,
    },
    muted: {
      color: palette.muted,
    },
    item: {
      borderColor: palette.border,
      backgroundColor: palette.surface,
      color: palette.text,
    },
    tag: {
      borderColor: palette.border,
      color: palette.muted,
      backgroundColor: palette.subtle,
    },
    cta: {
      backgroundColor: palette.primary,
      color: palette.primaryContent,
    },
    helperCard: {
      borderColor: palette.border,
      backgroundColor: palette.surface,
      color: palette.text,
    },
    helper: {
      color: palette.muted,
    },
  }
})

function formatPrice (price: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'KGS',
    maximumFractionDigits: 0,
  }).format(price)
}
</script>
