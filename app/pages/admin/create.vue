<template>
  <div :style="adminThemeStyles.page" class="min-h-screen">
    <LayoutAdminHeader />

    <section :style="adminThemeStyles.hero" class="border-b">
      <div class="mx-auto container-capped px-4 py-10">
        <div class="mb-8">
          <BackButton fallback="/admin" />
        </div>
        <div class="max-w-3xl space-y-4">
          <p class="text-sm uppercase tracking-[0.2em]" :style="adminThemeStyles.kicker">{{ headerKicker }}</p>
          <h1 class="text-3xl md:text-4xl font-extrabold" :style="adminThemeStyles.heading">
            {{ headerTitle }}
          </h1>
          <p class="text-base" :style="adminThemeStyles.muted">
            {{ headerDescription }}
          </p>
        </div>
      </div>
    </section>

    <section class="border-t" :style="adminThemeStyles.stage">
      <div class="mx-auto container-capped px-4 py-10">
      <div
        v-if="prefillError"
        class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {{ prefillError }}
      </div>
      <div
        v-if="isPrefilling"
        class="mb-8 inline-flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"
      >
        <span class="h-2 w-2 animate-ping rounded-full bg-brand-500"></span>
        <span>Загружаем данные меню…</span>
      </div>
      <form
        class="grid gap-10 lg:grid-cols-[2fr_1fr]"
        :aria-busy="isPrefilling"
        :class="{ 'pointer-events-none opacity-60': isPrefilling }"
        @submit.prevent="handleSubmit"
      >
        <div class="space-y-8">
          <Tabs
            v-model="activeTab"
            :items="tabs"
            :style="adminThemeStyles.tabs"
          >
            <template #general>
              <div class="space-y-8">
                <div class="rounded-2xl border p-6 shadow-soft" :style="adminThemeStyles.surface">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-xl font-semibold" :style="adminThemeStyles.heading">Контакты и витрина</h2>
                      <p class="mt-1 text-sm" :style="adminThemeStyles.muted">
                        Укажите данные, которые увидят гости на странице меню.
                      </p>
                    </div>
                    <div class="grid gap-4 md:grid-cols-2">
                      <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                        Название кафе
                        <input
                          v-model="cafeForm.cafeName"
                          type="text"
                          :class="formControlClass" :style="adminThemeStyles.input"
                          placeholder="Например, Кафе «Солнечное»"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Телефон для звонков
                        <input
                          v-model="cafeForm.phone"
                          type="tel"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="+996 555 123 456"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        WhatsApp
                        <input
                          v-model="cafeForm.whatsapp"
                          type="tel"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="+996555123456"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Минимальный заказ, KGS
                        <input
                          v-model.number="cafeForm.minOrder"
                          type="number"
                          min="0"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="0"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Доставка, KGS
                        <input
                          v-model.number="cafeForm.deliveryFee"
                          type="number"
                          min="0"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="150"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                        Адрес
                        <input
                          v-model="cafeForm.address"
                          type="text"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="г. Бишкек, пр. Чуй, 123"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                        Анонс или приветствие
                        <textarea
                          v-model="cafeForm.announcement"
                          rows="3"
                          :class="formControlClass"
                          :style="adminThemeStyles.textarea"
                          placeholder="Расскажите о спецпредложениях или преимуществах"
                          enterkeyhint="done"
                        ></textarea>
                      </label>
                    </div>
                    <div class="grid gap-4 md:grid-cols-3">
                      <label class="text-sm md:col-span-3" :style="adminThemeStyles.label">
                        Баннер — ссылка на изображение
                        <input
                          v-model="cafeForm.bannerImage"
                          type="url"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="https://..."
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                        Заголовок баннера
                        <input
                          v-model="cafeForm.bannerTitle"
                          type="text"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="Горячие обеды · Быстро и вкусно"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Подзаголовок баннера
                        <input
                          v-model="cafeForm.bannerSubtitle"
                          type="text"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="Доставка 30–45 минут"
                          enterkeyhint="done"
                        >
                      </label>
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border p-6 shadow-soft" :style="adminThemeStyles.surface">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-xl font-semibold" :style="adminThemeStyles.heading">Режим работы</h2>
                      <p class="mt-1 text-sm" :style="adminThemeStyles.muted">
                        Опишите, когда гости могут сделать заказ или забрать самовывоз.
                      </p>
                    </div>
                    <div class="grid gap-4">
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Кратко о графике
                        <input
                          v-model="cafeForm.openHours"
                          type="text"
                          :class="formControlClass"
                          :style="adminThemeStyles.input"
                          placeholder="Ежедневно 10:00–22:00"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm" :style="adminThemeStyles.label">
                        Детальное расписание
                        <textarea
                          v-model="cafeForm.scheduleDetails"
                          rows="4"
                          :class="formControlClass"
                          :style="adminThemeStyles.textarea"
                          placeholder="Пн–Пт: 10:00–22:00\nСб–Вс: 11:00–23:00"
                          enterkeyhint="done"
                        ></textarea>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template #menu>
              <div class="space-y-4">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 class="text-xl font-semibold">Позиции меню</h2>
                    <p class="mt-1 text-sm" :style="adminThemeStyles.muted">
                      Добавляйте блюда, указывайте категории, цену и дополнительные опции.
                </p>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                :style="adminThemeStyles.primaryButton"
                @click="addMenuItem()"
              >
                <span aria-hidden="true" class="text-lg leading-none">＋</span>
                Новое блюдо
              </button>
            </div>

            <MenuCategoryManager
              :categories="categories"
              :is-loading="areCategoriesLoading"
              :load-error="categoriesLoadError"
              :is-creating="isCreatingCategory"
              :updating-category-id="updatingCategoryId"
              :deleting-category-id="deletingCategoryId"
              :on-reload="loadCategories"
              :on-create-category="requestCategoryCreation"
              :on-update-category="requestCategoryUpdate"
              :on-delete-category="requestCategoryDeletion"
            />

            <div class="grid gap-6">
              <div
                v-for="(item, index) in menuItems"
                :key="item.id"
                class="rounded-2xl border p-6 shadow-soft"
                :style="adminThemeStyles.surface"
              >
                <div class="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-start md:justify-between" :style="adminThemeStyles.divider">
                  <div>
                    <div class="text-sm font-semibold uppercase tracking-[0.2em]" :style="adminThemeStyles.kicker">Блюдо {{ index + 1 }}</div>
                    <h3 class="text-lg font-semibold" :style="adminThemeStyles.heading">
                      {{ item.name || 'Без названия' }}
                    </h3>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      :style="adminThemeStyles.chip"
                      @click="duplicateMenuItem(index)"
                    >
                      Дублировать
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      :disabled="menuItems.length === 1"
                      :class="{ 'opacity-60 cursor-not-allowed': menuItems.length === 1 }"
                      :style="adminThemeStyles.destructive"
                      @click="removeMenuItem(index)"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                <div class="mt-4 grid gap-4 md:grid-cols-2">
                  <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                    Название блюда
                    <input
                      v-model="item.name"
                      type="text"
                      :class="formControlClass" :style="adminThemeStyles.input"
                      placeholder="Пицца Маргарита"
                      required
                      enterkeyhint="done"
                    >
                  </label>
                  <label class="text-sm" :style="adminThemeStyles.label">
                    Категория
                    <select
                      v-model="item.category"
                      :class="selectControlClass" :style="adminThemeStyles.input"
                    >
                      <option value="">Без категории</option>
                      <option
                        v-for="category in categories"
                        :key="category.id"
                        :value="category.name"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                    <p v-if="!categories.length" class="mt-1 text-xs" :style="adminThemeStyles.helper">Создайте категорию выше, чтобы выбрать её для блюда.</p>
                  </label>
                  <label class="text-sm" :style="adminThemeStyles.label">
                    Цена, KGS
                    <input
                      v-model.number="item.price"
                      type="number"
                      min="0"
                      :class="formControlClass" :style="adminThemeStyles.input"
                      placeholder="320"
                      enterkeyhint="done"
                    >
                  </label>
                  <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                    Изображение (URL)
                    <input
                      v-model="item.img"
                      type="url"
                      :class="formControlClass" :style="adminThemeStyles.input"
                      placeholder="https://images.unsplash.com/..."
                      enterkeyhint="done"
                    >
                  </label>
                  <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                    Теги (через запятую)
                    <input
                      v-model="item.tags"
                      type="text"
                      :class="formControlClass" :style="adminThemeStyles.input"
                      placeholder="Хит, Острый"
                      enterkeyhint="done"
                    >
                  </label>
                  <label class="text-sm md:col-span-2" :style="adminThemeStyles.label">
                    Описание
                    <textarea
                      v-model="item.description"
                      rows="3"
                      :class="formControlClass"
                      :style="adminThemeStyles.textarea"
                      placeholder="Расскажите о составе или способе приготовления"
                      enterkeyhint="done"
                    ></textarea>
                  </label>
                </div>

                <div class="mt-6 space-y-6">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold uppercase tracking-[0.2em]" :style="adminThemeStyles.kicker">Размеры</h4>
                      <button
                        type="button"
                        class="rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        :style="adminThemeStyles.chip"
                        @click="addOption(index, 'sizes')"
                      >
                        Добавить размер
                      </button>
                    </div>
                    <div
                      v-if="!item.options.sizes.length"
                      class="rounded-xl border border-dashed p-4 text-sm"
                      :style="{ borderColor: adminThemeStyles.divider.borderColor, color: adminThemeStyles.helper.color }"
                    >
                      Укажите варианты размеров, если цена зависит от порции.
                    </div>
                    <div class="grid gap-4" v-else>
                      <div
                        v-for="(size, sizeIndex) in item.options.sizes"
                        :key="size.id"
                        class="rounded-xl border p-4"
                        :style="adminThemeStyles.surface"
                      >
                        <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                          <label class="text-sm" :style="adminThemeStyles.label">
                            Название размера
                            <input
                              v-model="size.label"
                              type="text"
                              :class="formControlClass" :style="adminThemeStyles.input"
                              placeholder="Стандарт"
                              enterkeyhint="done"
                            >
                          </label>
                          <div class="flex items-end justify-between gap-3 md:block">
                            <label class="text-sm" :style="adminThemeStyles.label">
                              Наценка, KGS
                              <input
                                v-model.number="size.add"
                                type="number"
                                :class="formControlClass" :style="adminThemeStyles.input"
                                placeholder="0"
                                enterkeyhint="done"
                              >
                            </label>
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                              :style="adminThemeStyles.destructive"
                              @click="removeOption(index, 'sizes', sizeIndex)"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <h4 class="text-sm font-semibold uppercase tracking-[0.2em]" :style="adminThemeStyles.kicker">Дополнения</h4>
                      <button
                        type="button"
                        class="rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        :style="adminThemeStyles.chip"
                        @click="addOption(index, 'extras')"
                      >
                        Добавить дополнение
                      </button>
                    </div>
                    <div
                      v-if="!item.options.extras.length"
                      class="rounded-xl border border-dashed p-4 text-sm"
                      :style="{ borderColor: adminThemeStyles.divider.borderColor, color: adminThemeStyles.helper.color }"
                    >
                      Добавьте соусы, топпинги или дополнительные ингредиенты.
                    </div>
                    <div class="grid gap-4" v-else>
                      <div
                        v-for="(extra, extraIndex) in item.options.extras"
                        :key="extra.id"
                        class="rounded-xl border p-4"
                        :style="adminThemeStyles.surface"
                      >
                        <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                          <label class="text-sm" :style="adminThemeStyles.label">
                            Название дополнения
                            <input
                              v-model="extra.label"
                              type="text"
                              :class="formControlClass" :style="adminThemeStyles.input"
                              placeholder="Сыр моцарелла"
                              enterkeyhint="done"
                            >
                          </label>
                          <div class="flex items-end justify-between gap-3 md:block">
                            <label class="text-sm" :style="adminThemeStyles.label">
                              Наценка, KGS
                              <input
                                v-model.number="extra.add"
                                type="number"
                                :class="formControlClass" :style="adminThemeStyles.input"
                                placeholder="70"
                                enterkeyhint="done"
                              >
                            </label>
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                              :style="adminThemeStyles.destructive"
                              @click="removeOption(index, 'extras', extraIndex)"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                <div class="flex flex-col-reverse gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between" :style="adminThemeStyles.divider">
                  <button
                    type="button"
                    class="rounded-xl border px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    :style="adminThemeStyles.chip"
                    @click="addMenuItem(menuItems[menuItems.length - 1])"
                  >
                    Дублировать последнее блюдо
                  </button>
                  <button
                    type="submit"
                    class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-soft transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
                    :style="adminThemeStyles.primaryButton"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="h-2 w-2 animate-ping rounded-full"></span>
                    Сохранить меню
                  </button>
                </div>
              </div>
            </template>

            <template #theme>
              <MenuThemeEditor
                v-model:theme="themeForm"
                :preview-theme="previewTheme"
                :preview-menu-items="previewMenuItems"
                :preview-cafe="previewCafe"
                :presets="themePresets"
                :font-options="themeFontOptions"
                :validation="themeValidation"
                :warnings="themeWarnings"
                :is-disabled="isSubmitting"
                @reset="resetThemeToDefault"
              />
            </template>
          </Tabs>
        </div>

        <aside class="space-y-6">
          <div class="rounded-2xl border p-6 shadow-soft" :style="adminThemeStyles.surface">
            <h3 class="text-lg font-semibold" :style="adminThemeStyles.heading">Подсказки</h3>
            <ul class="mt-4 space-y-3 text-sm" :style="adminThemeStyles.helper">
              <li class="flex gap-3">
                <span aria-hidden="true" class="mt-0.5 text-lg">💡</span>
                <span>Указывайте реальные ссылки на фотографии — так блюда будут выглядеть привлекательно.</span>
              </li>
              <li class="flex gap-3">
                <span aria-hidden="true" class="mt-0.5 text-lg">🏷️</span>
                <span>Используйте теги, чтобы выделить хиты, острые позиции или новинки.</span>
              </li>
              <li class="flex gap-3">
                <span aria-hidden="true" class="mt-0.5 text-lg">🕒</span>
                <span>Добавьте детальное расписание, чтобы гости знали о перерывах и праздничных часах.</span>
              </li>
            </ul>
          </div>
          <div class="rounded-2xl border p-6 shadow-soft" :style="adminThemeStyles.surface">
            <h3 class="text-lg font-semibold" :style="adminThemeStyles.heading">Предпросмотр</h3>
            <div class="mt-4 space-y-3 text-sm">
              <div class="font-medium" :style="adminThemeStyles.heading">{{ cafeForm.cafeName || 'Название кафе' }}</div>
              <div :style="adminThemeStyles.helper">Телефон: <span class="font-medium" :style="adminThemeStyles.heading">{{ cafeForm.phone || '—' }}</span></div>
              <div :style="adminThemeStyles.helper">WhatsApp: <span class="font-medium" :style="adminThemeStyles.heading">{{ cafeForm.whatsapp || '—' }}</span></div>
              <div :style="adminThemeStyles.helper">График: <span class="font-medium" :style="adminThemeStyles.heading">{{ cafeForm.openHours || '—' }}</span></div>
              <div class="pt-3 text-xs uppercase tracking-[0.2em]" :style="adminThemeStyles.kicker">Позиций</div>
              <div class="text-2xl font-semibold" :style="adminThemeStyles.heading">{{ menuItems.length }}</div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  </section>

  <LayoutAdminFooter />
</div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useHead, useRoute, useNuxtApp } from '#imports'
import { useMenuCategories } from '~/composables/useMenuCategories'
import MenuCategoryManager from '~/components/admin/MenuCategoryManager.vue'
import MenuThemeEditor from '~/components/admin/MenuThemeEditor.vue'
import BackButton from '~/components/ui/BackButton.vue'
import Tabs from '~/components/ui/Tabs.vue'
import type { AdminMenuDetails } from '~/types/admin-menu'
import type {
  CafeForm,
  EditableMenuItem,
  OptionType,
  EditableMenuTheme,
} from '~/types/admin-menu-editor'
import { DEFAULT_MENU_THEME, MENU_THEME_PRESETS, MENU_THEME_FONT_OPTIONS } from '~/config/menuThemes'
import { resolveMenuTheme, validateMenuTheme, buildThemeCssVariables, hexToRgba } from '~/utils/theme'

const DEFAULT_PREFILL_ERROR = 'Failed to load menu data. Try refreshing the page.'

const route = useRoute()
const editMenuIdQuery = route.query.edit
const editMenuId = typeof editMenuIdQuery === 'string' ? editMenuIdQuery : null

const nuxtApp = useNuxtApp()
const request =
  nuxtApp?.$fetch ??
  (globalThis as unknown as { $fetch?: typeof $fetch }).$fetch

if (!request) {
  throw new Error('Nuxt $fetch instance is not available.')
}

const isEditing = computed(() => editMenuId !== null)
const isPrefilling = ref(false)
const prefillError = ref<string | null>(null)
const editingMenuTitle = ref('')
const editingMenuDetails = ref<AdminMenuDetails | null>(null)

const headerKicker = computed(() => (isEditing.value ? 'Редактирование' : 'Новое меню'))
const headerTitle = computed(() => (isEditing.value ? `Меню «${editingMenuTitle.value || '…'}»` : 'Создание меню'))
const headerDescription = computed(() =>
  isEditing.value
    ? 'Обновите контактные данные, расписание и блюда, чтобы актуализировать ссылку.'
    : 'Заполните контактные данные, рабочий график и добавьте блюда. Вы сможете опубликовать меню и поделиться ссылкой сразу после сохранения.'
)

const tabs = [
  {
    value: 'general',
    label: 'Основное',
    description: 'Контакты, адрес и режим работы',
  },
  {
    value: 'menu',
    label: 'Список блюд',
    description: 'Позиции и настройки меню',
  },
  {
    value: 'theme',
    label: 'Оформление',
    description: 'Цвета, шрифты и предпросмотр меню',
  },
]

const activeTab = ref(tabs[0].value)

const cafeForm = reactive<CafeForm>({
  cafeName: '',
  phone: '',
  whatsapp: '',
  minOrder: null,
  deliveryFee: null,
  address: '',
  announcement: '',
  bannerImage: '',
  bannerTitle: '',
  bannerSubtitle: '',
  openHours: '',
  scheduleDetails: '',
})

const themeForm = reactive<EditableMenuTheme>(JSON.parse(JSON.stringify(DEFAULT_MENU_THEME)))
const themeValidation = computed(() => validateMenuTheme(themeForm))
const previewTheme = computed(() => resolveMenuTheme(themeForm))
const themeHasErrors = computed(() => !themeValidation.value.isValid)
const themeWarnings = computed(() => themeValidation.value.warnings)
const themePresets = MENU_THEME_PRESETS
const themeFontOptions = MENU_THEME_FONT_OPTIONS

const formControlClass = 'mt-1 w-full rounded-xl border px-3 py-2 shadow-inner-sm focus:outline-none focus:ring-2 focus:ring-offset-2'
const selectControlClass = `${formControlClass} text-sm`
const adminThemeStyles = computed(() => {
  const resolved = previewTheme.value
  const palette = resolved.palette
  const cssVars = buildThemeCssVariables(resolved)
  const background = resolved.background
  const root: Record<string, string> = {
    ...cssVars,
    color: palette.text,
    backgroundColor: palette.background,
    fontFamily: resolved.fonts.body,
    minHeight: '100%'
  }

  if (background.image) {
    const overlay = hexToRgba(background.color, background.overlayOpacity)
    root.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url(${background.image})`
    root.backgroundSize = 'cover'
    root.backgroundAttachment = 'fixed'
    root.backgroundPosition = 'center'
  }

  const ringColor = palette.accent

  return {
    page: root,
    hero: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      color: palette.text,
    },
    stage: {
      backgroundColor: hexToRgba(palette.background, 0.85),
      borderColor: palette.border,
    },
    tabs: {
      '--tabs-indicator-color': palette.primary,
      '--tabs-text-color': palette.muted,
      '--tabs-active-text-color': palette.text,
    },
    surface: {
      backgroundColor: palette.surface,
      borderColor: palette.border,
      color: palette.text,
    },
    heading: {
      color: palette.text,
      fontFamily: resolved.fonts.heading,
    },
    kicker: {
      color: palette.accent,
    },
    muted: {
      color: palette.muted,
    },
    label: {
      color: palette.text,
    },
    input: {
      backgroundColor: palette.surface,
      color: palette.text,
      borderColor: palette.border,
      '--tw-ring-color': ringColor,
      '--tw-ring-offset-color': palette.surface,
    },
    textarea: {
      backgroundColor: palette.surface,
      color: palette.text,
      borderColor: palette.border,
      '--tw-ring-color': ringColor,
      '--tw-ring-offset-color': palette.surface,
    },
    helper: {
      color: palette.muted,
    },
    divider: {
      borderColor: palette.border,
    },
    destructive: {
      backgroundColor: hexToRgba('#ef4444', 0.12),
      borderColor: '#ef4444',
      color: '#b91c1c',
    },
    destructiveText: {
      color: '#b91c1c',
    },
    chip: {
      borderColor: palette.border,
      color: palette.muted,
      '--tw-ring-color': ringColor,
      backgroundColor: hexToRgba(palette.surface, 0.65),
    },
    primaryButton: {
      backgroundColor: palette.primary,
      color: resolved.palette.primaryContent,
      '--tw-ring-color': ringColor,
    },
  }
})

const {
  categories,
  isLoading: areCategoriesLoading,
  loadError: categoriesLoadError,
  isCreating: isCreatingCategory,
  updatingCategoryId,
  deletingCategoryId,
  loadCategories,
  createCategory: createRemoteCategory,
  updateCategoryName: updateRemoteCategory,
  deleteCategory: deleteRemoteCategory
} = useMenuCategories()
const menuItems = ref<EditableMenuItem[]>([createMenuItem()])
const isSubmitting = ref(false)

const previewMenuItems = computed(() =>
  menuItems.value.slice(0, 3).map(item => ({
    id: item.id,
    name: item.name || 'Без названия',
    category: item.category || 'Категория',
    price: item.price ?? 0,
    tags: item.tags.split(',').map(tag => tag.trim()).filter(Boolean),
  }))
)

const previewCafe = computed(() => ({
  cafeName: cafeForm.cafeName || 'Название кафе',
  announcement: cafeForm.announcement || 'Анонс или приветствие будет отображаться здесь',
}))

function createId () {
  return Math.random().toString(36).slice(2, 10)
}

function createMenuItem (base?: EditableMenuItem): EditableMenuItem {
  if (base) {
    const clone: EditableMenuItem = JSON.parse(JSON.stringify(base))
    clone.id = createId()
    clone.options.sizes = clone.options.sizes.map(option => ({ ...option, id: createId() }))
    clone.options.extras = clone.options.extras.map(option => ({ ...option, id: createId() }))
    return clone
  }

  return {
    id: createId(),
    name: '',
    category: '',
    price: null,
    img: '',
    tags: '',
    description: '',
    options: {
      sizes: [],
      extras: [],
    },
  }
}

function handleCategoryRenamed ({ previousName, nextName }: { previousName: string; nextName: string }) {
  if (previousName === nextName) return

  menuItems.value.forEach((item) => {
    if (item.category === previousName) {
      item.category = nextName
    }
  })
}

function handleCategoryRemoved ({ name }: { name: string }) {
  menuItems.value.forEach((item) => {
    if (item.category === name) {
      item.category = ''
    }
  })
}

async function requestCategoryCreation (name: string) {
  await createRemoteCategory(name)
}

async function requestCategoryUpdate ({ id, name, updatedAt }: { id: string; name: string; updatedAt: string }) {
  const previous = categories.value.find((category) => category.id === id)

  const updated = await updateRemoteCategory(id, name, updatedAt)

  if (previous && previous.name !== updated.name) {
    handleCategoryRenamed({ previousName: previous.name, nextName: updated.name })
  }
}

async function requestCategoryDeletion ({ id }: { id: string }) {
  const deleted = await deleteRemoteCategory(id)
  handleCategoryRemoved({ name: deleted.name })
}

function addMenuItem (base?: EditableMenuItem) {
  menuItems.value.push(createMenuItem(base))
}

function duplicateMenuItem (index: number) {
  const item = menuItems.value[index]
  addMenuItem(item)
}

function removeMenuItem (index: number) {
  if (menuItems.value.length === 1) return
  menuItems.value.splice(index, 1)
}

function addOption (itemIndex: number, type: OptionType) {
  const target = menuItems.value[itemIndex].options[type]
  target.push({
    id: createId(),
    label: '',
    add: null,
  })
}

function removeOption (itemIndex: number, type: OptionType, optionIndex: number) {
  menuItems.value[itemIndex].options[type].splice(optionIndex, 1)
}

function applyMenuDetails (details: AdminMenuDetails) {
  editingMenuDetails.value = details
  editingMenuTitle.value = details.title
  Object.assign(cafeForm, details.cafe)

  const hydratedItems = details.items.map((item) => ({
    id: createId(),
    name: item.name,
    category: item.category,
    price: item.price,
    img: item.img,
    tags: item.tags.join(', '),
    description: item.description,
    options: {
      sizes: item.options.sizes.map((size) => ({
        id: createId(),
        label: size.label,
        add: size.add,
      })),
      extras: item.options.extras.map((extra) => ({
        id: createId(),
        label: extra.label,
        add: extra.add,
      })),
    },
  }))

  menuItems.value = hydratedItems.length ? hydratedItems : [createMenuItem()]

  Object.assign(themeForm, JSON.parse(JSON.stringify(details.theme)))
}

function resetThemeToDefault () {
  Object.assign(themeForm, JSON.parse(JSON.stringify(DEFAULT_MENU_THEME)))
}

function buildMenuPayload (): AdminMenuDetails {
  const base = editingMenuDetails.value
  const id = base?.id ?? (editMenuId ?? `draft-${createId()}`)
  const slug = base?.slug ?? (base?.title ? base.title.toLowerCase().replace(/\s+/g, '-') : `draft-${createId()}`)
  const title = base?.title ?? (editingMenuTitle.value || cafeForm.cafeName || 'Новое меню')
  const description = base?.description ?? ''

  return {
    id,
    slug,
    title,
    description,
    cafe: {
      cafeName: cafeForm.cafeName,
      phone: cafeForm.phone,
      whatsapp: cafeForm.whatsapp,
      minOrder: cafeForm.minOrder,
      deliveryFee: cafeForm.deliveryFee,
      address: cafeForm.address,
      announcement: cafeForm.announcement,
      bannerImage: cafeForm.bannerImage,
      bannerTitle: cafeForm.bannerTitle,
      bannerSubtitle: cafeForm.bannerSubtitle,
      openHours: cafeForm.openHours,
      scheduleDetails: cafeForm.scheduleDetails,
    },
    items: menuItems.value.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      img: item.img,
      tags: item.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      description: item.description,
      options: {
        sizes: item.options.sizes.map((size) => ({
          id: size.id,
          label: size.label,
          add: size.add,
        })),
        extras: item.options.extras.map((extra) => ({
          id: extra.id,
          label: extra.label,
          add: extra.add,
        })),
      },
    })),
    theme: JSON.parse(JSON.stringify(themeForm)),
  }
}

async function prefillMenu (menuId: string) {
  try {
    isPrefilling.value = true
    prefillError.value = null

    const { data, error } = await useFetch<AdminMenuDetails>(`/api/admin/menu/${menuId}`)

    if (error.value) {
      prefillError.value = error.value.statusMessage || DEFAULT_PREFILL_ERROR
      return
    }

    if (!data.value) {
      prefillError.value = DEFAULT_PREFILL_ERROR
      return
    }

    applyMenuDetails(data.value)
  } catch (error) {
    console.error('Failed to load menu for editing', error)
    prefillError.value = DEFAULT_PREFILL_ERROR
  } finally {
    isPrefilling.value = false
  }
}

async function handleSubmit () {
  try {
    isSubmitting.value = true
    if (themeHasErrors.value) {
      console.warn('Theme validation errors', themeValidation.value.errors)
      activeTab.value = 'theme'
      return
    }
    const payload = buildMenuPayload()

    if (isEditing.value && editMenuId) {
      await request(`/api/admin/menu/${editMenuId}`, {
        method: 'PATCH',
        body: payload,
      })
    } else {
      console.info('Submitting menu draft', {
        payload,
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

await loadCategories().catch(() => {})

if (editMenuId) {
  await prefillMenu(editMenuId)
}

useHead(() => ({
  title: isEditing.value ? 'Редактирование меню — Get Menu' : 'Новое меню — Get Menu',
}))
</script>
