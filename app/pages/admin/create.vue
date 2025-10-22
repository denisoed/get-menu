<template>
  <LayoutAdminHeader />

  <section class="bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
    <div class="mx-auto container-capped px-4 py-10">
      <div class="mb-8">
        <BackButton fallback="/admin" />
      </div>
      <div class="max-w-3xl space-y-4">
        <p class="text-sm uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">{{ headerKicker }}</p>
        <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          {{ headerTitle }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-300">
          {{ headerDescription }}
        </p>
      </div>
    </div>
  </section>

  <section class="bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800">
    <div class="mx-auto container-capped px-4 py-10">
      <div
        v-if="prefillError"
        class="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-200"
      >
        {{ prefillError }}
      </div>
      <div
        v-if="isPrefilling"
        class="mb-8 inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
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
          >
            <template #general>
              <div class="space-y-8">
                <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Контакты и витрина</h2>
                      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Укажите данные, которые увидят гости на странице меню.
                      </p>
                    </div>
                    <div class="grid gap-4 md:grid-cols-2">
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Название кафе
                        <input
                          v-model="cafeForm.cafeName"
                          type="text"
                          :class="formControlClass"
                          placeholder="Например, Кафе «Солнечное»"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Телефон для звонков
                        <input
                          v-model="cafeForm.phone"
                          type="tel"
                          :class="formControlClass"
                          placeholder="+996 555 123 456"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        WhatsApp
                        <input
                          v-model="cafeForm.whatsapp"
                          type="tel"
                          :class="formControlClass"
                          placeholder="+996555123456"
                          required
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Минимальный заказ, KGS
                        <input
                          v-model.number="cafeForm.minOrder"
                          type="number"
                          min="0"
                          :class="formControlClass"
                          placeholder="0"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Доставка, KGS
                        <input
                          v-model.number="cafeForm.deliveryFee"
                          type="number"
                          min="0"
                          :class="formControlClass"
                          placeholder="150"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Адрес
                        <input
                          v-model="cafeForm.address"
                          type="text"
                          :class="formControlClass"
                          placeholder="г. Бишкек, пр. Чуй, 123"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Анонс или приветствие
                        <textarea
                          v-model="cafeForm.announcement"
                          rows="3"
                          :class="formControlClass"
                          placeholder="Расскажите о спецпредложениях или преимуществах"
                          enterkeyhint="done"
                        ></textarea>
                      </label>
                    </div>
                    <div class="grid gap-4 md:grid-cols-3">
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-3">
                        Баннер — ссылка на изображение
                        <input
                          v-model="cafeForm.bannerImage"
                          type="url"
                          :class="formControlClass"
                          placeholder="https://..."
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Заголовок баннера
                        <input
                          v-model="cafeForm.bannerTitle"
                          type="text"
                          :class="formControlClass"
                          placeholder="Горячие обеды · Быстро и вкусно"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Подзаголовок баннера
                        <input
                          v-model="cafeForm.bannerSubtitle"
                          type="text"
                          :class="formControlClass"
                          placeholder="Доставка 30–45 минут"
                          enterkeyhint="done"
                        >
                      </label>
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Режим работы</h2>
                      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Опишите, когда гости могут сделать заказ или забрать самовывоз.
                      </p>
                    </div>
                    <div class="grid gap-4">
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Кратко о графике
                        <input
                          v-model="cafeForm.openHours"
                          type="text"
                          :class="formControlClass"
                          placeholder="Ежедневно 10:00–22:00"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Детальное расписание
                        <textarea
                          v-model="cafeForm.scheduleDetails"
                          rows="4"
                          :class="formControlClass"
                          placeholder="Пн–Пт: 10:00–22:00
Сб–Вс: 11:00–23:00"
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
                    <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Позиции меню</h2>
                    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Добавляйте блюда, указывайте категории, цену и дополнительные опции.
                    </p>
                  </div>
                  <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:bg-brand-500 dark:hover:bg-brand-400"
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
                    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div class="flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Блюдо {{ index + 1 }}</div>
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          {{ item.name || 'Без названия' }}
                        </h3>
                      </div>
                      <div class="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                          @click="duplicateMenuItem(index)"
                        >
                          Дублировать
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                          :disabled="menuItems.length === 1"
                          @click="removeMenuItem(index)"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>

                    <div class="mt-4 grid gap-4 md:grid-cols-2">
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Название блюда
                        <input
                          v-model="item.name"
                          type="text"
                          :class="formControlClass"
                          placeholder="Например, Бургер «Классик»"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Категория
                        <select
                          v-model="item.category"
                          :class="selectControlClass"
                        >
                          <option disabled value="">Выберите категорию</option>
                          <option v-for="category in categories" :key="category.id" :value="category.name">
                            {{ category.name }}
                          </option>
                        </select>
                        <p v-if="!categories.length" class="mt-1 text-xs text-slate-500 dark:text-slate-400">Создайте категорию выше, чтобы выбрать её для блюда.</p>
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Стоимость, KGS
                        <input
                          v-model.number="item.price"
                          type="number"
                          min="0"
                          :class="formControlClass"
                          placeholder="290"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Метки (через запятую)
                        <input
                          v-model="item.tags"
                          type="text"
                          :class="formControlClass"
                          placeholder="Хит, Острый, Вегетарианский"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Ссылка на фото
                        <input
                          v-model="item.img"
                          type="url"
                          :class="formControlClass"
                          placeholder="https://..."
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Краткое описание
                        <textarea
                          v-model="item.description"
                          rows="3"
                          :class="formControlClass"
                          placeholder="Расскажите, из чего состоит блюдо и что в нём особенного"
                          enterkeyhint="done"
                        ></textarea>
                      </label>
                    </div>

                    <div class="mt-6 space-y-4">
                      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Размеры</h4>
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                          @click="addOption(index, 'sizes')"
                        >
                          Добавить размер
                        </button>
                      </div>

                      <div
                        v-if="!item.options.sizes.length"
                        class="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"
                      >
                        Если у блюда есть разные порции, добавьте их здесь.
                      </div>

                      <div class="space-y-3">
                        <div
                          v-for="(size, sizeIndex) in item.options.sizes"
                          :key="size.id"
                          class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"
                        >
                          <div class="grid gap-3 md:grid-cols-[1fr_140px]">
                            <label class="text-sm text-slate-700 dark:text-slate-200">
                              Название размера
                              <input
                                v-model="size.label"
                                type="text"
                                :class="formControlClass"
                                placeholder="Стандарт"
                                enterkeyhint="done"
                              >
                            </label>
                            <label class="text-sm text-slate-700 dark:text-slate-200">
                              Наценка, KGS
                              <input
                                v-model.number="size.add"
                                type="number"
                                min="0"
                                :class="formControlClass"
                                placeholder="40"
                                enterkeyhint="done"
                              >
                            </label>
                          </div>
                          <div class="mt-3 flex justify-end">
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                              @click="removeOption(index, 'sizes', sizeIndex)"
                            >
                              Удалить
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="mt-6 space-y-4">
                      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Дополнения</h4>
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                          @click="addOption(index, 'extras')"
                        >
                          Добавить доп.
                        </button>
                      </div>

                      <div
                        v-if="!item.options.extras.length"
                        class="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"
                      >
                        Здесь можно указать дополнения — соусы, гарниры или топпинги.
                      </div>

                      <div class="space-y-3">
                        <div
                          v-for="(extra, extraIndex) in item.options.extras"
                          :key="extra.id"
                          class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60"
                        >
                          <div class="grid gap-3 md:grid-cols-[1fr_140px]">
                            <label class="text-sm text-slate-700 dark:text-slate-200">
                              Название дополнения
                              <input
                                v-model="extra.label"
                                type="text"
                                :class="formControlClass"
                                placeholder="Бекон"
                                enterkeyhint="done"
                              >
                            </label>
                            <label class="text-sm text-slate-700 dark:text-slate-200">
                              Наценка, KGS
                              <input
                                v-model.number="extra.add"
                                type="number"
                                min="0"
                                :class="formControlClass"
                                placeholder="70"
                                enterkeyhint="done"
                              >
                            </label>
                          </div>
                          <div class="mt-3 flex justify-end">
                            <button
                              type="button"
                              class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
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

                <div class="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
                  <button
                    type="button"
                    class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                    @click="addMenuItem(menuItems[menuItems.length - 1])"
                  >
                    Дублировать последнее блюдо
                  </button>
                  <button
                    type="submit"
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="h-2 w-2 animate-ping rounded-full bg-white"></span>
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
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Подсказки</h3>
            <ul class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
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
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Предпросмотр</h3>
            <div class="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <div class="font-medium text-slate-900 dark:text-slate-100">{{ cafeForm.cafeName || 'Название кафе' }}</div>
              <div>Телефон: <span class="font-medium text-slate-900 dark:text-slate-100">{{ cafeForm.phone || '—' }}</span></div>
              <div>WhatsApp: <span class="font-medium text-slate-900 dark:text-slate-100">{{ cafeForm.whatsapp || '—' }}</span></div>
              <div>График: <span class="font-medium text-slate-900 dark:text-slate-100">{{ cafeForm.openHours || '—' }}</span></div>
              <div class="pt-3 text-xs uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Позиций</div>
              <div class="text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ menuItems.length }}</div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  </section>

  <LayoutAdminFooter />
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
import { resolveMenuTheme, validateMenuTheme } from '~/utils/theme'

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

const formControlClass = 'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500'
const selectControlClass = `${formControlClass} text-sm`
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
