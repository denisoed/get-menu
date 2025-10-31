<template>
  <LayoutAdminHeader />

  <section class="bg-white dark:bg-slate-950">
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
                <div
                  v-if="isEditing"
                  class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
                >
                  <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Публикация меню</h2>
                      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {{ publicationHelperText }}
                      </p>
                    </div>
                    <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <button
                        type="button"
                        role="switch"
                        class="relative inline-flex h-9 w-16 flex-shrink-0 items-center rounded-full border border-transparent transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                        :class="isPublished ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'"
                        :aria-checked="isPublished"
                        @click="togglePublication"
                        @keydown.enter.prevent="togglePublication"
                        @keydown.space.prevent="togglePublication"
                      >
                        <span class="sr-only">Переключить статус публикации</span>
                        <span
                          class="inline-block h-7 w-7 transform rounded-full bg-white shadow-sm transition dark:bg-slate-900"
                          :class="isPublished ? 'translate-x-7' : 'translate-x-1'"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                  <div class="space-y-6">
                    <div>
                      <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">Адрес меню</h2>
                      <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Выберите короткое имя, которое станет частью ссылки вида
                        <span class="font-semibold text-slate-900 dark:text-slate-100">{{ fullMenuUrlDisplay }}</span>.
                      </p>
                    </div>
                    <div class="space-y-4">
                      <div class="flex flex-col gap-3 md:flex-row md:items-end">
                        <label class="flex-1 text-sm text-slate-700 dark:text-slate-200">
                          Сабдомен
                          <div class="mt-1">
                            <div :class="subdomainWrapperClasses">
                              <input
                                :value="subdomain"
                                :readonly="isEditing"
                                type="text"
                                autocomplete="off"
                                spellcheck="false"
                                inputmode="lowercase"
                                class="w-full flex-1 bg-transparent p-0 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
                                placeholder="super-restaurant"
                                @input="onSubdomainInput(($event.target as HTMLInputElement).value)"
                                @blur="markSubdomainTouched"
                              >
                              <span class="inline-flex items-center border-l border-slate-200 pl-3 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                                {{ SUBDOMAIN_SUFFIX }}
                              </span>
                            </div>
                          </div>
                        </label>
                        <button
                          v-if="isEditing"
                          type="button"
                          class="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                          :class="copyButtonStateClasses"
                          :disabled="isCopyDisabled"
                          @click="copyMenuLink"
                        >
                          <span v-if="copyState === 'success'" aria-hidden="true">✔</span>
                          <span v-else-if="copyState === 'error'" aria-hidden="true">!</span>
                          <span>{{ copyButtonLabel }}</span>
                        </button>
                      </div>
                      <p
                        class="text-sm"
                        :class="subdomainMessageClass"
                        aria-live="polite"
                      >
                        <span v-if="isCheckingSubdomain" class="mr-2 inline-flex h-2 w-2 animate-ping rounded-full bg-brand-500"></span>
                        {{ subdomainMessage }}
                      </p>
                      <p class="text-sm text-slate-500 dark:text-slate-400">
                        Итоговая ссылка: <span class="font-medium text-slate-900 dark:text-slate-100">{{ fullMenuUrlDisplay }}</span>
                      </p>
                    </div>
                  </div>
                </div>

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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                          placeholder="150"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Адрес
                        <input
                          v-model="cafeForm.address"
                          type="text"
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                          placeholder="г. Бишкек, пр. Чуй, 123"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Анонс или приветствие
                        <textarea
                          v-model="cafeForm.announcement"
                          rows="3"
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                          placeholder="https://..."
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                        Заголовок баннера
                        <input
                          v-model="cafeForm.bannerTitle"
                          type="text"
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                          placeholder="Горячие обеды · Быстро и вкусно"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Подзаголовок баннера
                        <input
                          v-model="cafeForm.bannerSubtitle"
                          type="text"
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                          placeholder="Ежедневно 10:00–22:00"
                          enterkeyhint="done"
                        >
                      </label>
                      <label class="text-sm text-slate-700 dark:text-slate-200">
                        Детальное расписание
                        <textarea
                          v-model="cafeForm.scheduleDetails"
                          rows="4"
                          class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                    <div
                      class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                      :class="item.isCollapsed ? '' : 'border-b border-slate-200 pb-4 dark:border-slate-800'"
                    >
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
                          :aria-expanded="!item.isCollapsed"
                          :aria-label="item.isCollapsed ? 'Развернуть карточку блюда' : 'Свернуть карточку блюда'"
                          @click="toggleMenuItemCollapse(index)"
                        >
                          <span>{{ item.isCollapsed ? 'Развернуть' : 'Свернуть' }}</span>
                          <span aria-hidden="true" class="text-base leading-none">{{ item.isCollapsed ? '↓' : '↑' }}</span>
                        </button>
                      </div>
                    </div>

                    <div
                      v-if="!item.isCollapsed"
                      class="mt-4 space-y-6"
                    >
                      <div class="grid gap-4 md:grid-cols-2">
                        <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                          Название блюда
                          <input
                            v-model="item.name"
                            type="text"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                            placeholder="Пицца Маргарита"
                            required
                            enterkeyhint="done"
                          >
                        </label>
                        <label class="text-sm text-slate-700 dark:text-slate-200">
                          Категория
                          <select
                            v-model="item.category"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
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
                          <p v-if="!categories.length" class="mt-1 text-xs text-slate-500 dark:text-slate-400">Создайте категорию выше, чтобы выбрать её для блюда.</p>
                        </label>
                        <label class="text-sm text-slate-700 dark:text-slate-200">
                          Цена, KGS
                          <input
                            v-model.number="item.price"
                            type="number"
                            min="0"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                            placeholder="320"
                            enterkeyhint="done"
                          >
                        </label>
                        <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                          Изображение (URL)
                          <input
                            v-model="item.img"
                            type="url"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                            placeholder="https://images.unsplash.com/..."
                            enterkeyhint="done"
                          >
                        </label>
                        <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                          Теги (через запятую)
                          <input
                            v-model="item.tags"
                            type="text"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                            placeholder="Хит, Острый"
                            enterkeyhint="done"
                          >
                        </label>
                        <label class="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
                          Описание
                          <textarea
                            v-model="item.description"
                            rows="3"
                            class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                            placeholder="Расскажите о составе или способе приготовления"
                            enterkeyhint="done"
                          ></textarea>
                        </label>
                      </div>

                      <div class="space-y-6">
                        <div class="space-y-3">
                          <div class="flex items-center justify-between">
                            <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Размеры</h4>
                            <button
                              type="button"
                              class="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                              @click="addOption(index, 'sizes')"
                            >
                              Добавить размер
                            </button>
                          </div>
                          <div
                            v-if="!item.options.sizes.length"
                            class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
                          >
                            Укажите варианты размеров, если цена зависит от порции.
                          </div>
                          <div
                            v-else
                            class="grid gap-4"
                          >
                            <div
                              v-for="(size, sizeIndex) in item.options.sizes"
                              :key="size.id"
                              class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                            >
                              <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                                <label class="text-sm text-slate-700 dark:text-slate-200">
                                  Название размера
                                  <input
                                    v-model="size.label"
                                    type="text"
                                    class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                                    placeholder="Стандарт"
                                    enterkeyhint="done"
                                  >
                                </label>
                                <div class="flex items-end justify-between gap-3 md:block">
                                  <label class="text-sm text-slate-700 dark:text-slate-200">
                                    Наценка, KGS
                                    <input
                                      v-model.number="size.add"
                                      type="number"
                                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                                      placeholder="0"
                                      enterkeyhint="done"
                                    >
                                  </label>
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
                        </div>

                        <div class="space-y-3">
                          <div class="flex items-center justify-between">
                            <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-300">Дополнения</h4>
                            <button
                              type="button"
                              class="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                              @click="addOption(index, 'extras')"
                            >
                              Добавить дополнение
                            </button>
                          </div>
                          <div
                            v-if="!item.options.extras.length"
                            class="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"
                          >
                            Добавьте соусы, топпинги или дополнительные ингредиенты.
                          </div>
                          <div
                            v-else
                            class="grid gap-4"
                          >
                            <div
                              v-for="(extra, extraIndex) in item.options.extras"
                              :key="extra.id"
                              class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                            >
                              <div class="grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
                                <label class="text-sm text-slate-700 dark:text-slate-200">
                                  Название дополнения
                                  <input
                                    v-model="extra.label"
                                    type="text"
                                    class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                                    placeholder="Сыр моцарелла"
                                    enterkeyhint="done"
                                  >
                                </label>
                                <div class="flex items-end justify-between gap-3 md:block">
                                  <label class="text-sm text-slate-700 dark:text-slate-200">
                                    Наценка, KGS
                                    <input
                                      v-model.number="extra.add"
                                      type="number"
                                      class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-brand-500"
                                      placeholder="70"
                                      enterkeyhint="done"
                                    >
                                  </label>
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

                      <div class="flex flex-col-reverse gap-3 pt-4 md:flex-row md:items-center md:justify-between">
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
                          :disabled="menuItems.length === 1"
                          :class="{ 'opacity-60 cursor-not-allowed': menuItems.length === 1 }"
                          @click="removeMenuItem(index)"
                        >
                          Удалить
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300"
                          @click="duplicateMenuItem(index)"
                        >
                          Дублировать
                        </button>
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
                    :disabled="isSubmitDisabled"
                  >
                    <span v-if="isSubmitting" class="h-2 w-2 animate-ping rounded-full bg-white"></span>
                    Сохранить меню
                  </button>
                </div>
              </div>
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
              <div>Телефон: <span class="font-medium">{{ cafeForm.phone || '—' }}</span></div>
              <div>WhatsApp: <span class="font-medium">{{ cafeForm.whatsapp || '—' }}</span></div>
              <div>График: <span class="font-medium">{{ cafeForm.openHours || '—' }}</span></div>
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
import { computed, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { useHead, useRoute, useNuxtApp } from '#imports'
import { useMenuCategories } from '~/composables/useMenuCategories'
import { useNotifications } from '~/composables/useNotifications'
import MenuCategoryManager from '~/components/admin/MenuCategoryManager.vue'
import BackButton from '~/components/ui/BackButton.vue'
import Tabs from '~/components/ui/Tabs.vue'
import type { AdminMenuDetails } from '~/types/admin-menu'
import type {
  CafeForm,
  EditableMenuItem,
  OptionType,
} from '~/types/admin-menu-editor'

const DEFAULT_PREFILL_ERROR = 'Failed to load menu data. Try refreshing the page.'
const SUBDOMAIN_SUFFIX = '.get-menu.com'
const SUBDOMAIN_MIN_LENGTH = 3
const SUBDOMAIN_MAX_LENGTH = 32
const BASE_SUBDOMAIN_HINT = 'Используйте латинские буквы, цифры и дефисы. Например, super-restaurant.'

const route = useRoute()
const nuxtApp = useNuxtApp()
const request =
  nuxtApp?.$fetch ??
  (globalThis as unknown as { $fetch?: typeof $fetch }).$fetch

if (!request) {
  throw new Error('Nuxt $fetch instance is not available.')
}

const notifications = useNotifications()

const editMenuIdQuery = route.query.edit
const editMenuId = typeof editMenuIdQuery === 'string' ? editMenuIdQuery : null

const isEditing = computed(() => editMenuId !== null)
const isPrefilling = ref(false)
const prefillError = ref<string | null>(null)
const editingMenuTitle = ref('')
const isPublished = ref(false)

const subdomain = ref('')
const subdomainTouched = ref(false)
const subdomainErrors = ref<string[]>([])
const isCheckingSubdomain = ref(false)
const isSubdomainAvailable = ref<boolean | null>(null)
const subdomainCheckError = ref<string | null>(null)
const lastCheckedSubdomain = ref<string | null>(null)

const copyState = ref<'idle' | 'success' | 'error'>('idle')

let availabilityDebounceTimer: ReturnType<typeof setTimeout> | null = null
let availabilityAbortController: AbortController | null = null
let copyResetTimer: ReturnType<typeof setTimeout> | null = null

const headerKicker = computed(() => (isEditing.value ? 'Редактирование' : 'Новое меню'))
const headerTitle = computed(() => (isEditing.value ? `Меню «${editingMenuTitle.value || '…'}»` : 'Создание меню'))
const headerDescription = computed(() =>
  isEditing.value
    ? 'Обновите контактные данные, расписание и блюда, чтобы актуализировать ссылку.'
    : 'Заполните контактные данные, рабочий график и добавьте блюда. Вы сможете опубликовать меню и поделиться ссылкой сразу после сохранения.'
)

const publicationHelperText = computed(() =>
  isPublished.value
    ? 'Меню будет доступно гостям по ссылке. Отключите, чтобы скрыть его и внести правки.'
    : 'Черновик виден только вам. Включите публикацию, когда будете готовы поделиться меню.'
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

const normalizedSubdomain = computed(() => subdomain.value.trim().toLowerCase())
const hasSubdomainValue = computed(() => normalizedSubdomain.value.length > 0)
const fullMenuUrlDisplay = computed(() =>
  hasSubdomainValue.value
    ? `https://${normalizedSubdomain.value}${SUBDOMAIN_SUFFIX}`
    : `https://ваше-меню${SUBDOMAIN_SUFFIX}`
)
const isCopyDisabled = computed(() => !hasSubdomainValue.value)

const copyButtonLabel = computed(() => {
  if (copyState.value === 'success') {
    return 'Скопировано'
  }

  if (copyState.value === 'error') {
    return 'Не удалось скопировать'
  }

  return 'Копировать ссылку'
})

const copyButtonStateClasses = computed(() => {
  if (copyState.value === 'success') {
    return 'border-emerald-400 text-emerald-600 dark:border-emerald-500 dark:text-emerald-400'
  }

  if (copyState.value === 'error') {
    return 'border-red-300 text-red-600 dark:border-red-500/60 dark:text-red-300'
  }

  return ''
})

const displayedSubdomainError = computed(() => (subdomainTouched.value ? subdomainErrors.value[0] ?? null : null))
const hasConflict = computed(() => subdomainTouched.value && isSubdomainAvailable.value === false)
const hasNetworkIssue = computed(() => subdomainTouched.value && isSubdomainAvailable.value === null && !!subdomainCheckError.value)
const showSuccess = computed(
  () =>
    subdomainTouched.value &&
    hasSubdomainValue.value &&
    subdomainErrors.value.length === 0 &&
    isSubdomainAvailable.value === true &&
    !isCheckingSubdomain.value
)

const subdomainMessage = computed(() => {
  if (displayedSubdomainError.value) {
    return displayedSubdomainError.value
  }

  if (hasConflict.value) {
    return subdomainCheckError.value || 'Этот адрес уже занят. Попробуйте другой вариант.'
  }

  if (hasNetworkIssue.value) {
    return subdomainCheckError.value
  }

  if (isCheckingSubdomain.value) {
    return 'Проверяем доступность…'
  }

  if (isEditing.value) {
    return 'Адрес закреплён за меню. Скопируйте ссылку и поделитесь с гостями.'
  }

  if (showSuccess.value) {
    return 'Адрес свободен. После публикации меню будет доступно по этой ссылке.'
  }

  return BASE_SUBDOMAIN_HINT
})

const subdomainMessageClass = computed(() => {
  if (displayedSubdomainError.value || hasConflict.value) {
    return 'text-red-600 dark:text-red-400'
  }

  if (hasNetworkIssue.value) {
    return 'text-amber-600 dark:text-amber-400'
  }

  if (showSuccess.value) {
    return 'text-emerald-600 dark:text-emerald-400'
  }

  if (isCheckingSubdomain.value) {
    return 'text-brand-600 dark:text-brand-300'
  }

  return 'text-slate-500 dark:text-slate-400'
})

const subdomainWrapperClasses = computed(() => {
  const base =
    'flex items-center gap-3 rounded-xl border px-3 py-2 shadow-inner-sm transition focus-within:ring-2 focus-within:ring-brand-200 dark:bg-slate-950 dark:focus-within:ring-brand-500'

  if (displayedSubdomainError.value || hasConflict.value) {
    return `${base} border-red-300 focus-within:ring-red-200 dark:border-red-500/70 dark:focus-within:ring-red-500/40`
  }

  if (showSuccess.value) {
    return `${base} border-emerald-400 focus-within:ring-emerald-200 dark:border-emerald-500 dark:focus-within:ring-emerald-500/40`
  }

  return `${base} border-slate-200 dark:border-slate-800`
})

const isSubmitDisabled = computed(() => {
  if (isSubmitting.value) {
    return true
  }

  if (isEditing.value) {
    return !hasSubdomainValue.value
  }

  if (!hasSubdomainValue.value) {
    return true
  }

  if (subdomainErrors.value.length > 0) {
    return true
  }

  if (isCheckingSubdomain.value) {
    return true
  }

  if (hasNetworkIssue.value) {
    return true
  }

  return isSubdomainAvailable.value !== true
})

function sanitizeSubdomainInput(value: string) {
  return value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

function validateSubdomain(value: string) {
  const trimmed = value.trim()
  const errors: string[] = []

  if (!trimmed) {
    errors.push('Укажите название сабдомена.')
  } else {
    if (trimmed.length < SUBDOMAIN_MIN_LENGTH) {
      errors.push(`Сабдомен должен содержать не менее ${SUBDOMAIN_MIN_LENGTH} символов.`)
    }

    if (trimmed.length > SUBDOMAIN_MAX_LENGTH) {
      errors.push(`Сабдомен не может быть длиннее ${SUBDOMAIN_MAX_LENGTH} символов.`)
    }

    if (!/^[a-z0-9-]+$/.test(trimmed)) {
      errors.push('Допустимы только латинские буквы, цифры и дефисы.')
    }

    if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
      errors.push('Сабдомен не может начинаться или заканчиваться дефисом.')
    }
  }

  subdomainErrors.value = errors
  return errors
}

function onSubdomainInput(value: string) {
  subdomainTouched.value = true
  subdomain.value = sanitizeSubdomainInput(value)
}

function markSubdomainTouched() {
  subdomainTouched.value = true
  validateSubdomain(subdomain.value)
}

function scheduleAvailabilityCheck(value: string) {
  if (availabilityDebounceTimer) {
    clearTimeout(availabilityDebounceTimer)
    availabilityDebounceTimer = null
  }

  availabilityDebounceTimer = setTimeout(() => {
    checkSubdomainAvailability(value).catch(() => {})
  }, 500)
}

async function checkSubdomainAvailability(value: string, options: { force?: boolean } = {}) {
  if (isEditing.value) {
    isSubdomainAvailable.value = true
    subdomainCheckError.value = null
    return true
  }

  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    isSubdomainAvailable.value = null
    subdomainCheckError.value = null
    return false
  }

  if (
    !options.force &&
    lastCheckedSubdomain.value === normalized &&
    isSubdomainAvailable.value !== null &&
    !subdomainCheckError.value
  ) {
    return isSubdomainAvailable.value
  }

  if (availabilityAbortController) {
    availabilityAbortController.abort()
  }

  const controller = new AbortController()
  availabilityAbortController = controller

  isCheckingSubdomain.value = true
  subdomainCheckError.value = null

  try {
    const response = await request('/api/admin/menu/subdomain/check', {
      method: 'GET',
      query: { value: normalized },
      signal: controller.signal
    }) as { isAvailable?: boolean }

    const available = Boolean(response?.isAvailable)

    isSubdomainAvailable.value = available
    subdomainCheckError.value = available ? null : 'Этот адрес уже занят. Попробуйте другой вариант.'
    lastCheckedSubdomain.value = normalized

    return available
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return false
    }

    console.error('[client][subdomain] Failed to check availability', error)

    isSubdomainAvailable.value = null
    subdomainCheckError.value = 'Не удалось проверить уникальность. Попробуйте ещё раз.'

    return false
  } finally {
    if (availabilityAbortController === controller) {
      availabilityAbortController = null
    }

    isCheckingSubdomain.value = false
  }
}

async function ensureSubdomainAvailability(options: { force?: boolean } = {}) {
  if (isEditing.value) {
    return true
  }

  const errors = validateSubdomain(subdomain.value)

  if (errors.length > 0) {
    return false
  }

  return checkSubdomainAvailability(subdomain.value, { force: options.force })
}

watch(
  () => subdomain.value,
  (value) => {
    const errors = validateSubdomain(value)

    if (availabilityDebounceTimer) {
      clearTimeout(availabilityDebounceTimer)
      availabilityDebounceTimer = null
    }

    if (isEditing.value) {
      isSubdomainAvailable.value = true
      subdomainCheckError.value = null
      return
    }

    if (!subdomainTouched.value) {
      return
    }

    if (!value.trim() || errors.length > 0) {
      isSubdomainAvailable.value = null
      subdomainCheckError.value = null
      isCheckingSubdomain.value = false
      return
    }

    isSubdomainAvailable.value = null
    subdomainCheckError.value = null

    scheduleAvailabilityCheck(value)
  },
  { immediate: true }
)

watch(
  () => cafeForm.cafeName,
  (name) => {
    if (isEditing.value || subdomainTouched.value || subdomain.value.trim().length > 0) {
      return
    }

    subdomain.value = sanitizeSubdomainInput(name)
  }
)

async function copyMenuLink() {
  if (!hasSubdomainValue.value) {
    return
  }

  if (!process.client) {
    notifications.info('Скопируйте ссылку вручную в браузере.')
    return
  }

  const link = fullMenuUrlDisplay.value

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = link
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      const succeeded = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (!succeeded) {
        throw new Error('Clipboard fallback failed.')
      }
    }

    copyState.value = 'success'
    notifications.success('Ссылка на меню скопирована.')
  } catch (error) {
    console.error('[client][subdomain] Failed to copy link', error)
    copyState.value = 'error'
    notifications.error('Не удалось скопировать ссылку. Скопируйте её вручную.')
  } finally {
    if (copyResetTimer) {
      clearTimeout(copyResetTimer)
    }

    copyResetTimer = setTimeout(() => {
      copyState.value = 'idle'
      copyResetTimer = null
    }, 2000)
  }
}

function normalizeNumeric(value: number | null) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : null
}

function buildMenuPayload() {
  const items = menuItems.value.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: normalizeNumeric(item.price),
    img: item.img,
    tags: item.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    description: item.description,
    options: {
      sizes: item.options.sizes.map((option) => ({
        id: option.id,
        label: option.label,
        add: normalizeNumeric(option.add),
      })),
      extras: item.options.extras.map((option) => ({
        id: option.id,
        label: option.label,
        add: normalizeNumeric(option.add),
      })),
    },
  }))

  const cafePayload = {
    cafeName: cafeForm.cafeName,
    phone: cafeForm.phone,
    whatsapp: cafeForm.whatsapp,
    minOrder: normalizeNumeric(cafeForm.minOrder),
    deliveryFee: normalizeNumeric(cafeForm.deliveryFee),
    address: cafeForm.address,
    announcement: cafeForm.announcement,
    bannerImage: cafeForm.bannerImage,
    bannerTitle: cafeForm.bannerTitle,
    bannerSubtitle: cafeForm.bannerSubtitle,
    openHours: cafeForm.openHours,
    scheduleDetails: cafeForm.scheduleDetails,
  }

  return {
    id: editMenuId ?? undefined,
    subdomain: normalizedSubdomain.value,
    slug: normalizedSubdomain.value,
    title: cafeForm.cafeName || 'Меню без названия',
    description: cafeForm.announcement || '',
    isPublished: isPublished.value,
    cafe: cafePayload,
    items,
  }
}

function createId () {
  return Math.random().toString(36).slice(2, 10)
}

function createMenuItem (base?: EditableMenuItem): EditableMenuItem {
  if (base) {
    const clone: EditableMenuItem = JSON.parse(JSON.stringify(base))
    clone.id = createId()
    clone.options.sizes = clone.options.sizes.map(option => ({ ...option, id: createId() }))
    clone.options.extras = clone.options.extras.map(option => ({ ...option, id: createId() }))
    clone.isCollapsed = true
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
    isCollapsed: false,
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

function togglePublication () {
  isPublished.value = !isPublished.value
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

function toggleMenuItemCollapse (index: number) {
  const target = menuItems.value[index]
  target.isCollapsed = !target.isCollapsed
}

function applyMenuDetails (details: AdminMenuDetails) {
  editingMenuTitle.value = details.title
  isPublished.value = details.isPublished
  Object.assign(cafeForm, details.cafe)

  const normalized = details.subdomain.trim().toLowerCase()
  subdomain.value = normalized
  subdomainTouched.value = true
  subdomainErrors.value = []
  isSubdomainAvailable.value = true
  subdomainCheckError.value = null
  lastCheckedSubdomain.value = normalized
  copyState.value = 'idle'

  const hydratedItems = details.items.map((item) => ({
    id: createId(),
    name: item.name,
    category: item.category,
    price: item.price,
    img: item.img,
    tags: item.tags.join(', '),
    description: item.description,
    isCollapsed: true,
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
  if (!isEditing.value) {
    subdomainTouched.value = true
    const errors = validateSubdomain(subdomain.value)

    if (errors.length > 0) {
      notifications.error('Проверьте адрес меню.')
      return
    }

    const available = await ensureSubdomainAvailability({ force: true })

    if (!available) {
      notifications.error(subdomainCheckError.value || 'Этот сабдомен уже занят. Попробуйте другой.')
      return
    }
  } else if (!hasSubdomainValue.value) {
    notifications.error('Сабдомен отсутствует. Обратитесь в поддержку.')
    return
  }

  try {
    isSubmitting.value = true

    const payload = buildMenuPayload()

    await request(isEditing.value ? `/api/admin/menu/${editMenuId}` : '/api/admin/menu', {
      method: isEditing.value ? 'PATCH' : 'POST',
      body: payload
    })

    if (!isEditing.value) {
      lastCheckedSubdomain.value = normalizedSubdomain.value
      isSubdomainAvailable.value = true
    }

    notifications.success(isEditing.value ? 'Меню обновлено.' : 'Меню создано.')
  } catch (error: any) {
    if (error?.data?.error === 'subdomain_conflict') {
      isSubdomainAvailable.value = false
      subdomainCheckError.value = 'Этот адрес уже занят. Попробуйте другой вариант.'
      notifications.error('Этот сабдомен уже занят. Выберите другое имя.')
      return
    }

    if (error?.data?.error === 'validation_error') {
      notifications.error('Проверьте заполненные поля и попробуйте снова.')
      return
    }

    console.error('[client][menu] Failed to submit menu', error)
    notifications.error('Не удалось сохранить меню. Попробуйте ещё раз.')
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

onBeforeUnmount(() => {
  if (availabilityDebounceTimer) {
    clearTimeout(availabilityDebounceTimer)
    availabilityDebounceTimer = null
  }

  if (availabilityAbortController) {
    availabilityAbortController.abort()
    availabilityAbortController = null
  }

  if (copyResetTimer) {
    clearTimeout(copyResetTimer)
    copyResetTimer = null
  }
})
</script>
