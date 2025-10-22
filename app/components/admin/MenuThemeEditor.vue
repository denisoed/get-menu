<template>
  <div class="grid gap-6 xl:grid-cols-[3fr_2fr]" :style="styles.root">
    <div class="space-y-6">
      <section class="rounded-2xl border p-6 shadow-soft" :style="styles.surface">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 class="text-xl font-semibold" :style="styles.heading">Предустановки</h2>
            <p class="text-sm" :style="styles.helper">Выберите готовое оформление как отправную точку и отредактируйте детали.</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :style="styles.reset"
            :disabled="isDisabled"
            @click="emitReset"
          >
            Сбросить к дефолту
          </button>
        </div>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <button
            v-for="preset in presetThemes"
            :key="preset.id"
            type="button"
            class="relative rounded-2xl border p-4 text-left shadow-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            :style="presetButtonStyle(preset.id)"
            :aria-pressed="preset.id === theme.presetId"
            :disabled="isDisabled"
            @click="applyPreset(preset.id)"
          >
            <div class="text-sm font-semibold" :style="styles.heading">{{ preset.name }}</div>
            <p class="mt-1 text-xs" :style="styles.helper">{{ preset.description }}</p>
            <div class="mt-4 flex gap-2">
              <span
                v-for="swatch in preset.swatches"
                :key="swatch"
                class="h-6 w-6 rounded-full border"
                :style="{ backgroundColor: swatch, borderColor: styles.divider.borderColor }"
              />
            </div>
            <span
              v-if="preset.id === theme.presetId"
              class="absolute right-4 top-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold"
              :style="styles.selected"
            >
              ✓
            </span>
          </button>
        </div>
      </section>

      <section class="rounded-2xl border p-6 shadow-soft" :style="styles.surface">
        <h2 class="text-xl font-semibold" :style="styles.heading">Шрифты</h2>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <label class="text-sm font-medium" :style="styles.heading">
            Заголовки
            <select
              :value="theme.fonts.heading"
              :class="controlClass"
              :style="styles.input"
              :disabled="isDisabled"
              @change="handleFontEvent('heading', $event)"
            >
              <option
                v-for="option in fontOptions"
                :key="option.id"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
          <label class="text-sm font-medium" :style="styles.heading">
            Основной текст
            <select
              :value="theme.fonts.body"
              :class="controlClass"
              :style="styles.input"
              :disabled="isDisabled"
              @change="handleFontEvent('body', $event)"
            >
              <option
                v-for="option in fontOptions"
                :key="option.id"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
        </div>
      </section>

      <section class="rounded-2xl border p-6 shadow-soft" :style="styles.surface">
        <h2 class="text-xl font-semibold" :style="styles.heading">Фон страницы</h2>
        <div class="mt-4 space-y-6">
          <fieldset class="flex flex-wrap gap-2">
            <legend class="sr-only">Тип фона</legend>
            <label
              v-for="option in backgroundTypes"
              :key="option.value"
              class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition"
              :style="backgroundTypeStyle(option.value === theme.background.type)"
            >
              <input
                type="radio"
                class="sr-only"
                name="background-type"
                :value="option.value"
                :checked="theme.background.type === option.value"
                :disabled="isDisabled"
                @change="handleBackgroundTypeEvent($event)"
              >
              {{ option.label }}
            </label>
          </fieldset>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="flex flex-col gap-3 text-sm font-medium" :style="styles.heading">
              Цвет фона
              <div class="flex items-center gap-3">
                <input
                  type="color"
                  class="h-10 w-10 cursor-pointer rounded-full border"
                  :value="theme.background.color"
                  :style="styles.colorControl"
                  :disabled="isDisabled"
                  @input="handleBackgroundColorEvent($event)"
                >
                <input
                  type="text"
                  :value="theme.background.color"
                  :class="controlClass"
                  :style="styles.input"
                  :disabled="isDisabled"
                  placeholder="#f8fafc"
                  @input="handleBackgroundColorEvent($event)"
                >
              </div>
            </label>

            <label
              v-if="theme.background.type === 'image'"
              class="flex flex-col gap-3 text-sm font-medium md:col-span-2"
              :style="styles.heading"
            >
              Ссылка на изображение
              <input
                type="url"
                :value="theme.background.image ?? ''"
                :class="controlClass"
                :style="styles.input"
                :disabled="isDisabled"
                placeholder="https://images.unsplash.com/..."
                @input="handleBackgroundImageEvent($event)"
              >
            </label>
          </div>

          <label class="flex flex-col gap-3 text-sm font-medium" :style="styles.heading">
            Прозрачность оверлея ({{ Math.round(theme.background.overlayOpacity * 100) }}%)
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="theme.background.overlayOpacity"
              class="w-full"
              :style="styles.range"
              :disabled="isDisabled"
              @input="handleOverlayEvent($event)"
            >
          </label>
        </div>
      </section>
    </div>

    <div class="space-y-6">
      <MenuThemePreview
        :theme="previewTheme"
        :menu-items="previewMenuItems"
        :cafe="previewCafe"
      />

      <div v-if="validation.errors.length" class="rounded-2xl border-2 p-5 text-sm" :style="styles.error">
        <div class="font-semibold">Проблемы доступности</div>
        <ul class="mt-2 space-y-2 list-disc pl-5">
          <li v-for="error in validation.errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <div v-else-if="warnings.length" class="rounded-2xl border p-5 text-sm" :style="styles.warning">
        <div class="font-semibold">Рекомендации</div>
        <ul class="mt-2 space-y-2 list-disc pl-5">
          <li v-for="warning in warnings" :key="warning">{{ warning }}</li>
        </ul>
      </div>
      <p class="text-xs" :style="styles.helper">Данные темы сохраняются вместе с меню. Ошибки необходимо исправить перед публикацией.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MenuThemePreview from '~/components/admin/MenuThemePreview.vue'
import { buildThemeCssVariables, hexToRgba, resolveMenuTheme } from '~/utils/theme'
import type { MenuThemeConfig, ResolvedMenuTheme } from '~/types/theme'
import type { MenuThemePreset } from '~/config/menuThemes'
import type { ThemeValidationResult } from '~/utils/theme'

type FontKey = keyof MenuThemeConfig['fonts']

type BackgroundType = MenuThemeConfig['background']['type']

type FontOption = {
  id: string
  label: string
  value: string
}

type PreviewMenuItem = {
  id: string
  name: string
  category: string
  price: number
  tags: string[]
}

type PreviewCafe = {
  cafeName: string
  announcement: string
}

interface Props {
  theme: MenuThemeConfig
  previewTheme: ResolvedMenuTheme
  previewMenuItems: PreviewMenuItem[]
  previewCafe: PreviewCafe
  presets: MenuThemePreset[]
  fontOptions: FontOption[]
  validation: ThemeValidationResult
  warnings: string[]
  isDisabled?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:theme': [MenuThemeConfig]
  reset: []
}>()

const controlClass = 'mt-2 w-full rounded-xl border px-3 py-2 text-sm shadow-inner-sm focus:outline-none focus:ring-2 focus:ring-offset-2'

const backgroundTypes: Array<{ value: BackgroundType; label: string }> = [
  { value: 'color', label: 'Цветовой фон' },
  { value: 'image', label: 'Изображение' },
]

const presetThemes = computed(() =>
  props.presets.map((preset) => ({
    ...preset,
    swatches: Object.values(resolveMenuTheme(preset.config).palette).slice(0, 4),
  }))
)

const styles = computed(() => {
  const palette = props.previewTheme.palette
  const cssVars = buildThemeCssVariables(props.previewTheme)
  const root: Record<string, string> = {
    ...cssVars,
    color: palette.text,
    fontFamily: props.previewTheme.fonts.body,
  }

  const ringColor = palette.accent

  return {
    surface: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      color: palette.text,
    },
    heading: {
      color: palette.text,
      fontFamily: props.previewTheme.fonts.heading,
    },
    helper: {
      color: palette.muted,
    },
    divider: {
      borderColor: palette.border,
    },
    input: {
      backgroundColor: palette.surface,
      color: palette.text,
      borderColor: palette.border,
      '--tw-ring-color': ringColor,
      '--tw-ring-offset-color': palette.surface,
    },
    range: {
      accentColor: palette.primary,
    },
    colorControl: {
      borderColor: palette.border,
      backgroundColor: palette.surface,
    },
    reset: {
      borderColor: palette.border,
      color: palette.text,
      '--tw-ring-color': ringColor,
      backgroundColor: hexToRgba(palette.surface, 0.6),
    },
    selected: {
      backgroundColor: palette.primary,
      borderColor: palette.primary,
      color: props.previewTheme.palette.primaryContent,
    },
    error: {
      borderColor: '#dc2626',
      backgroundColor: hexToRgba('#fee2e2', 0.9),
      color: '#991b1b',
    },
    warning: {
      borderColor: '#facc15',
      backgroundColor: hexToRgba('#fef3c7', 0.9),
      color: '#92400e',
    },
    root,
  }
})

const theme = computed(() => props.theme)
const warnings = computed(() => props.warnings)
const isDisabled = computed(() => props.isDisabled ?? false)

function emitTheme (next: MenuThemeConfig) {
  emit('update:theme', JSON.parse(JSON.stringify(next)))
}

function applyPreset (presetId: string) {
  if (isDisabled.value) return
  const preset = props.presets.find((item) => item.id === presetId)
  if (!preset) return
  emitTheme({
    ...preset.config,
    presetId: preset.id,
  })
}

function onFontChange (key: FontKey, value: string) {
  const next = { ...theme.value, fonts: { ...theme.value.fonts, [key]: value } }
  emitTheme(next)
}

function onBackgroundTypeChange (type: BackgroundType) {
  if (theme.value.background.type === type) return
  const next = {
    ...theme.value,
    background: {
      ...theme.value.background,
      type,
      image: type === 'image' ? theme.value.background.image ?? '' : null,
    },
  }
  emitTheme(next)
}

function onBackgroundColorInput (value: string) {
  const next = { ...theme.value, background: { ...theme.value.background, color: value } }
  emitTheme(next)
}

function onBackgroundImageInput (value: string) {
  const url = value.trim() || null
  const next = { ...theme.value, background: { ...theme.value.background, image: url } }
  emitTheme(next)
}

function onOverlayChange (value: number) {
  const clamped = Math.min(Math.max(value, 0), 1)
  const next = { ...theme.value, background: { ...theme.value.background, overlayOpacity: clamped } }
  emitTheme(next)
}

function handleBackgroundTypeEvent (event: Event) {
  const target = event.target as HTMLInputElement
  if (!target?.value) return
  onBackgroundTypeChange(target.value as BackgroundType)
}

function handleFontEvent (key: FontKey, event: Event) {
  const target = event.target as HTMLSelectElement
  onFontChange(key, target.value)
}

function handleBackgroundColorEvent (event: Event) {
  const target = event.target as HTMLInputElement
  onBackgroundColorInput(target.value)
}

function handleBackgroundImageEvent (event: Event) {
  const target = event.target as HTMLInputElement
  onBackgroundImageInput(target.value)
}

function handleOverlayEvent (event: Event) {
  const target = event.target as HTMLInputElement
  onOverlayChange(Number(target.value))
}

function backgroundTypeStyle (isActive: boolean) {
  return {
    borderColor: isActive ? props.previewTheme.palette.primary : props.previewTheme.palette.border,
    color: isActive ? props.previewTheme.palette.primaryContent : props.previewTheme.palette.muted,
    backgroundColor: isActive ? props.previewTheme.palette.primary : hexToRgba(props.previewTheme.palette.surface, 0.8),
    '--tw-ring-color': props.previewTheme.palette.accent,
  }
}

function presetButtonStyle (presetId: string) {
  const isActive = presetId === theme.value.presetId
  return {
    borderColor: isActive ? props.previewTheme.palette.primary : props.previewTheme.palette.border,
    backgroundColor: isActive ? hexToRgba(props.previewTheme.palette.primary, 0.08) : hexToRgba(props.previewTheme.palette.surface, 0.9),
    color: props.previewTheme.palette.text,
    '--tw-ring-color': props.previewTheme.palette.accent,
  }
}

function emitReset () {
  emit('reset')
}
</script>
