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
                        Придумайте человеко-понятное имя сабдомена — ссылка будет вида <span class="font-medium text-slate-700 dark:text-slate-200">example{{ SUBDOMAIN_SUFFIX }}</span>.
                      </p>
                    </div>

                    <div v-if="isEditing" class="space-y-3">
                      <label class="block text-sm text-slate-700 dark:text-slate-200">
                        Сабдомен меню
                        <div class="relative mt-1">
                          <input
                            :value="subdomainValue"
                            type="text"
                            readonly
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-36 text-sm font-medium text-slate-700 shadow-inner-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:focus:ring-brand-500"
                          >
                          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                            {{ SUBDOMAIN_SUFFIX }}
                          </span>
                        </div>
                      </label>
                      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p class="text-sm text-slate-500 dark:text-slate-400">
                          Полная ссылка:
                          <span class="font-medium text-slate-900 dark:text-slate-100">{{ subdomainUrl || '—' }}</span>
                        </p>
                        <button
                          type="button"
                          class="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:opacity-60 dark:bg-brand-500 dark:hover:bg-brand-400"
                          :disabled="!subdomainUrl"
                          @click="copySubdomain"
                        >
                          <span aria-hidden="true">📋</span>
                          Скопировать ссылку
                        </button>
                      </div>
                      <p
                        v-if="copyFeedbackMessage"
                        class="text-sm"
                        :class="copyFeedbackToneClass"
                        aria-live="polite"
                      >
                        {{ copyFeedbackMessage }}
                      </p>
                    </div>

                    <div v-else>
                      <label class="block text-sm text-slate-700 dark:text-slate-200" :for="subdomainFieldId">
                        Сабдомен меню
                        <div class="relative mt-1">
                          <input
                            :id="subdomainFieldId"
                            v-model="subdomainValue"
                            type="text"
                            class="w-full rounded-xl border px-3 py-2 pr-36 shadow-inner-sm focus:ring-2 dark:bg-slate-950 dark:text-slate-100"
                            :class="shouldShowSubdomainError
                              ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-500 dark:focus:ring-red-500'
                              : 'border-slate-200 focus:border-brand-500 focus:ring-brand-200 dark:border-slate-700 dark:focus:ring-brand-500'"
                            placeholder="Например, super-restaurant"
                            autocomplete="off"
                            autocapitalize="none"
                            spellcheck="false"
                            maxlength="30"
                            enterkeyhint="done"
                            :aria-invalid="shouldShowSubdomainError ? 'true' : 'false'"
                            :aria-describedby="subdomainHelperId"
                            @input="handleSubdomainInput"
                            @blur="handleSubdomainBlur"
                          >
                          <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-slate-500 dark:text-slate-400">
                            {{ SUBDOMAIN_SUFFIX }}
                          </span>
                        </div>
                      </label>
                      <p
                        :id="subdomainHelperId"
                        class="mt-2 text-sm"
                        :class="subdomainHelperToneClass"
                        aria-live="polite"
                      >
                        {{ subdomainHelperMessage }}
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
                      class="flex cursor-pointer flex-col gap-3 md:flex-row md:items-start md:justify-between"
                      :class="item.isCollapsed ? '' : 'border-b border-slate-200 pb-4 dark:border-slate-800'"
                      role="button"
                      tabindex="0"
                      @click="toggleMenuItemCollapse(index)"
                      @keydown.enter.prevent="toggleMenuItemCollapse(index)"
                      @keydown.space.prevent="toggleMenuItemCollapse(index)"
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
                          @click.stop="toggleMenuItemCollapse(index)"
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
                                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
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
                                    class="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
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
                          class="inline-flex items-center justify-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-brand-500 hover:text-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand-400 dark:hover:text-brand-300 md:hidden"
                          @click="collapseMenuItem(index)"
                        >
                          Свернуть
                        </button>
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

  <MenuQuickEdit
    v-if="isEditing"
    :quick-edit="quickEdit"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { useHead, useRoute } from '#imports'
import { useMenuCategories } from '~/composables/useMenuCategories'
import { useMenuQuickEdit } from '~/composables/useMenuQuickEdit'
import MenuCategoryManager from '~/components/admin/MenuCategoryManager.vue'
import BackButton from '~/components/ui/BackButton.vue'
import Tabs from '~/components/ui/Tabs.vue'
import MenuQuickEdit from '~/components/admin/MenuQuickEdit.vue'
import type { AdminMenuDetails } from '~/types/admin-menu'
import type {
  CafeForm,
  EditableMenuItem,
  OptionType,
} from '~/types/admin-menu-editor'

const DEFAULT_PREFILL_ERROR = 'Failed to load menu data. Try refreshing the page.'

const route = useRoute()
const editMenuIdQuery = route.query.edit
const editMenuId = typeof editMenuIdQuery === 'string' ? editMenuIdQuery : null

const isEditing = computed(() => editMenuId !== null)
const isPrefilling = ref(false)
const prefillError = ref<string | null>(null)
const editingMenuTitle = ref('')
const isPublished = ref(false)

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

const SUBDOMAIN_SUFFIX = '.get-menu.com'
const subdomainFieldId = 'menu-subdomain'
const subdomainHelperId = 'menu-subdomain-helper'

type HelperTone = 'muted' | 'error' | 'success'

const subdomainValue = ref('')
const isSubdomainDirty = ref(false)
const isSubdomainBlurred = ref(false)
const isCheckingSubdomain = ref(false)
const isSubdomainAvailable = ref<boolean | null>(null)
const availabilityError = ref<string | null>(null)
const reservedSubdomain = ref<string | null>(null)

const subdomainFormatError = computed(() => validateSubdomain(subdomainValue.value))
const shouldShowSubdomainError = computed(
  () => (isSubdomainDirty.value || isSubdomainBlurred.value) && Boolean(subdomainFormatError.value || availabilityError.value)
)
const subdomainErrorMessage = computed(() => {
  if (subdomainFormatError.value) {
    return subdomainFormatError.value
  }

  if (availabilityError.value) {
    return availabilityError.value
  }

  return ''
})
const canShowSubdomainSuccess = computed(
  () =>
    (isSubdomainDirty.value || isSubdomainBlurred.value) && !subdomainFormatError.value && isSubdomainAvailable.value === true
)
const subdomainHelper = computed<{ message: string; tone: HelperTone }>(() => {
  if (shouldShowSubdomainError.value) {
    return { message: subdomainErrorMessage.value, tone: 'error' }
  }

  if (isCheckingSubdomain.value) {
    return { message: 'Проверяем доступность…', tone: 'muted' }
  }

  if (canShowSubdomainSuccess.value) {
    return { message: 'Адрес свободен — можно использовать.', tone: 'success' }
  }

  return {
    message: 'Используйте латинские буквы, цифры и дефис. Длина — 3–30 символов.',
    tone: 'muted',
  }
})
const subdomainHelperMessage = computed(() => subdomainHelper.value.message)
const subdomainHelperToneClass = computed(() => {
  switch (subdomainHelper.value.tone) {
    case 'error':
      return 'text-red-600 dark:text-red-400'
    case 'success':
      return 'text-emerald-600 dark:text-emerald-400'
    default:
      return 'text-slate-500 dark:text-slate-400'
  }
})

const subdomainHostname = computed(() => (subdomainValue.value ? `${subdomainValue.value}${SUBDOMAIN_SUFFIX}` : ''))
const subdomainUrl = computed(() => (subdomainHostname.value ? `https://${subdomainHostname.value}` : ''))

const copyState = ref<'idle' | 'success' | 'error'>('idle')
const copyFeedbackMessage = computed(() => {
  if (copyState.value === 'success') {
    return 'Ссылка скопирована.'
  }

  if (copyState.value === 'error') {
    return 'Не удалось скопировать ссылку. Скопируйте вручную.'
  }

  return ''
})
const copyFeedbackToneClass = computed(() => {
  if (copyState.value === 'error') {
    return 'text-red-600 dark:text-red-400'
  }

  if (copyState.value === 'success') {
    return 'text-emerald-600 dark:text-emerald-400'
  }

  return 'text-slate-500 dark:text-slate-400'
})

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
const quickEdit = useMenuQuickEdit({ menuId: computed(() => editMenuId), menuTitle: editingMenuTitle, menuItems })
const isSubmitting = ref(false)
const isSubmitDisabled = computed(() => {
  if (isSubmitting.value) {
    return true
  }

  if (isEditing.value) {
    return false
  }

  if (!subdomainValue.value) {
    return true
  }

  if (subdomainFormatError.value) {
    return true
  }

  if (isCheckingSubdomain.value) {
    return true
  }

  return isSubdomainAvailable.value !== true
})

let availabilityCheckTimeout: ReturnType<typeof setTimeout> | null = null
let availabilityCheckToken = 0
let copyFeedbackTimeout: ReturnType<typeof setTimeout> | null = null

interface SubdomainAvailabilityResponse {
  available: boolean
  message?: string
}

watch(subdomainValue, (value) => {
  if (isEditing.value) {
    return
  }

  if (!isSubdomainDirty.value && !isSubdomainBlurred.value) {
    availabilityError.value = null
    return
  }

  resetAvailabilityState()

  if (!subdomainFormatError.value && value) {
    availabilityCheckTimeout = setTimeout(() => {
      verifySubdomainAvailability(value)
    }, 400)
  }
})

onBeforeUnmount(() => {
  if (availabilityCheckTimeout) {
    clearTimeout(availabilityCheckTimeout)
    availabilityCheckTimeout = null
  }

  if (copyFeedbackTimeout) {
    clearTimeout(copyFeedbackTimeout)
    copyFeedbackTimeout = null
  }
})

function resetAvailabilityState () {
  if (availabilityCheckTimeout) {
    clearTimeout(availabilityCheckTimeout)
    availabilityCheckTimeout = null
  }

  availabilityCheckToken++
  availabilityError.value = null
  isSubdomainAvailable.value = null
  isCheckingSubdomain.value = false
}

function handleSubdomainInput () {
  if (isEditing.value) {
    return
  }

  isSubdomainDirty.value = true

  const sanitized = subdomainValue.value.toLowerCase().replace(/\s+/g, '-')

  if (sanitized !== subdomainValue.value) {
    subdomainValue.value = sanitized
  }
}

function handleSubdomainBlur () {
  if (isEditing.value) {
    return
  }

  if (!isSubdomainDirty.value) {
    isSubdomainDirty.value = true
  }

  isSubdomainBlurred.value = true

  if (!subdomainFormatError.value && subdomainValue.value && isSubdomainAvailable.value !== true) {
    resetAvailabilityState()
    verifySubdomainAvailability(subdomainValue.value)
  }
}

function validateSubdomain (value: string): string | null {
  if (!value) {
    return 'Укажите адрес меню.'
  }

  if (value.length < 3 || value.length > 30) {
    return 'Длина адреса — от 3 до 30 символов.'
  }

  if (!/^[a-z]/.test(value)) {
    return 'Адрес должен начинаться с латинской буквы.'
  }

  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Используйте только латинские буквы, цифры и дефис.'
  }

  if (value.endsWith('-')) {
    return 'Адрес не может заканчиваться дефисом.'
  }

  return null
}

function setCopyState (state: 'idle' | 'success' | 'error') {
  copyState.value = state

  if (copyFeedbackTimeout) {
    clearTimeout(copyFeedbackTimeout)
    copyFeedbackTimeout = null
  }

  if (state !== 'idle') {
    copyFeedbackTimeout = setTimeout(() => {
      copyState.value = 'idle'
      copyFeedbackTimeout = null
    }, 2000)
  }
}

function fallbackCopy (value: string): boolean {
  if (typeof document === 'undefined') {
    return false
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  const result = document.execCommand('copy')
  document.body.removeChild(textarea)
  return result
}

async function copySubdomain () {
  if (!subdomainUrl.value || import.meta.server) {
    return
  }

  try {
    await navigator.clipboard.writeText(subdomainUrl.value)
    setCopyState('success')
  } catch (error) {
    const fallbackResult = fallbackCopy(subdomainUrl.value)
    setCopyState(fallbackResult ? 'success' : 'error')
  }
}

async function verifySubdomainAvailability (value: string) {
  if (!value) {
    return
  }

  if (reservedSubdomain.value && value === reservedSubdomain.value) {
    availabilityError.value = null
    isSubdomainAvailable.value = true
    return
  }

  const currentToken = ++availabilityCheckToken
  isCheckingSubdomain.value = true

  try {
    const { data, error } = await useFetch<SubdomainAvailabilityResponse>(`/api/admin/subdomain/${value}`)

    if (currentToken !== availabilityCheckToken) {
      return
    }

    if (error.value) {
      availabilityError.value = error.value.statusMessage || 'Не удалось проверить доступность. Попробуйте позже.'
      isSubdomainAvailable.value = null
      return
    }

    const result = data.value

    if (!result) {
      availabilityError.value = 'Не удалось проверить доступность. Попробуйте позже.'
      isSubdomainAvailable.value = null
      return
    }

    if (!result.available) {
      availabilityError.value = result.message || 'Этот адрес уже занят. Попробуйте другое имя.'
      isSubdomainAvailable.value = false
      return
    }

    availabilityError.value = null
    isSubdomainAvailable.value = true
  } catch (error) {
    if (currentToken !== availabilityCheckToken) {
      return
    }

    console.error('Failed to verify subdomain availability', error)
    availabilityError.value = 'Не удалось проверить доступность. Попробуйте позже.'
    isSubdomainAvailable.value = null
  } finally {
    if (currentToken === availabilityCheckToken) {
      isCheckingSubdomain.value = false
    }
  }
}

async function ensureSubdomainReady () {
  if (isEditing.value) {
    return true
  }

  isSubdomainDirty.value = true
  isSubdomainBlurred.value = true

  if (subdomainFormatError.value) {
    return false
  }

  if (!subdomainValue.value) {
    availabilityError.value = null
    return false
  }

  if (isSubdomainAvailable.value === true) {
    return true
  }

  resetAvailabilityState()
  await verifySubdomainAvailability(subdomainValue.value)

  return isSubdomainAvailable.value === true
}

function createId () {
  return Math.random().toString(36).slice(2, 10)
}

function createMenuItem (base?: EditableMenuItem): EditableMenuItem {
  if (base) {
    const clone: EditableMenuItem = JSON.parse(JSON.stringify(base))
    clone.id = createId()
    clone.sourceId = base.sourceId
    clone.options.sizes = clone.options.sizes.map(option => ({ ...option, id: createId() }))
    clone.options.extras = clone.options.extras.map(option => ({ ...option, id: createId() }))
    clone.isCollapsed = true
    return clone
  }

  return {
    id: createId(),
    sourceId: null,
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

function collapseMenuItem (index: number) {
  menuItems.value[index].isCollapsed = true
}

function applyMenuDetails (details: AdminMenuDetails) {
  editingMenuTitle.value = details.title
  isPublished.value = details.isPublished
  reservedSubdomain.value = details.subdomain
  subdomainValue.value = details.subdomain
  availabilityError.value = null
  isSubdomainDirty.value = false
  isSubdomainBlurred.value = false
  isSubdomainAvailable.value = true
  setCopyState('idle')
  Object.assign(cafeForm, details.cafe)

  const hydratedItems = details.items.map((item) => ({
    id: createId(),
    sourceId: item.id,
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
  const canSubmit = await ensureSubdomainReady()

  if (!canSubmit) {
    return
  }

  try {
    isSubmitting.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    console.info('Submitting menu', {
      mode: isEditing.value ? 'update' : 'create',
      menuId: editMenuId,
      isPublished: isPublished.value,
      subdomain: subdomainValue.value,
      subdomainUrl: subdomainUrl.value,
      cafeForm,
      categories: categories.value,
      menuItems: menuItems.value,
    })
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
