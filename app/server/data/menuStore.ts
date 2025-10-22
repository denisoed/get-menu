import { DEFAULT_MENU_THEME, MENU_THEME_PRESETS } from '~/config/menuThemes'
import type { AdminMenuDetails } from '~/types/admin-menu'
import type { MenuItem } from '~/types/menu'
import type { MenuThemeConfig } from '~/types/theme'
import type { UserMenu } from '~/types/user-menu'

interface MenuMeta {
  isPublished: boolean
  itemsCount: number
  lastUpdated: string
}

interface MenuRecord {
  details: AdminMenuDetails
  meta: MenuMeta
}

const globalKey = '__get_menu_store__'

function cloneTheme (theme: MenuThemeConfig) {
  return JSON.parse(JSON.stringify(theme)) as MenuThemeConfig
}

function cloneDetails (details: AdminMenuDetails) {
  return JSON.parse(JSON.stringify(details)) as AdminMenuDetails
}

function createInitialData (): Map<string, MenuRecord> {
  const presets = Object.fromEntries(MENU_THEME_PRESETS.map(preset => [preset.id, preset.config]))
  const store = new Map<string, MenuRecord>()

  const mainMenu: MenuRecord = {
    details: {
      id: 'main-menu',
      slug: 'main-menu',
      title: 'Основное меню',
      description: 'Базовое меню с популярными блюдами кафе.',
      cafe: {
        cafeName: 'Кафе «Солнечное»',
        phone: '+996 555 123 456',
        whatsapp: '+996555123456',
        minOrder: 0,
        deliveryFee: 150,
        address: 'г. Бишкек, пр. Чуй, 123',
        announcement: 'Доставка горячих блюд и напитков за 45 минут.',
        bannerImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
        bannerTitle: 'Горячие обеды · Быстро и вкусно',
        bannerSubtitle: 'Скидка 10% на самовывоз',
        openHours: 'Ежедневно 10:00–22:00',
        scheduleDetails: 'Пн–Пт: 10:00–22:00\nСб–Вс: 11:00–23:00',
      },
      items: [
        {
          id: 'dish-1',
          name: 'Бургер «Классик»',
          category: 'Бургеры',
          price: 290,
          img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
          tags: ['Хит'],
          description: 'Сочное мясо, маринованные огурцы и фирменный соус.',
          options: {
            sizes: [
              { id: 'size-1', label: 'Малый', add: 0 },
              { id: 'size-2', label: 'Стандарт', add: 40 },
              { id: 'size-3', label: 'Большой', add: 80 },
            ],
            extras: [
              { id: 'extra-1', label: 'Сыр Чеддер', add: 40 },
              { id: 'extra-2', label: 'Бекон', add: 70 },
            ],
          },
        },
        {
          id: 'dish-2',
          name: 'Салат «Цезарь»',
          category: 'Салаты',
          price: 260,
          img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
          tags: ['Популярно'],
          description: 'Классический рецепт с соусом собственного приготовления.',
          options: { sizes: [], extras: [] },
        },
        {
          id: 'dish-3',
          name: 'Лимонад домашний',
          category: 'Напитки',
          price: 110,
          img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
          tags: ['Лето'],
          description: 'Освежающий напиток с лимоном и мятой.',
          options: {
            sizes: [
              { id: 'size-4', label: '300 мл', add: 0 },
              { id: 'size-5', label: '500 мл', add: 30 },
            ],
            extras: [],
          },
        },
      ],
      theme: cloneTheme(DEFAULT_MENU_THEME),
    },
    meta: {
      isPublished: true,
      itemsCount: 42,
      lastUpdated: '2024-05-30T10:30:00.000Z',
    },
  }

  const summerMenu: MenuRecord = {
    details: {
      id: 'summer-special',
      slug: 'letnee-menu',
      title: 'Летнее сезонное меню',
      description: 'Сезонные блюда и напитки для жарких дней.',
      cafe: {
        cafeName: 'Летний бар',
        phone: '+996 700 987 654',
        whatsapp: '+996700987654',
        minOrder: 500,
        deliveryFee: 200,
        address: 'г. Бишкек, ул. Абдрахманова, 45',
        announcement: 'Освежающие лимонады и легкие блюда каждый день.',
        bannerImage: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
        bannerTitle: 'Лето в каждом глотке',
        bannerSubtitle: 'Бесплатная доставка от 1000 KGS',
        openHours: 'Пн–Вс 11:00–23:00',
        scheduleDetails: 'Пн–Чт: 11:00–22:00\nПт–Вс: 11:00–23:00',
      },
      items: [
        {
          id: 'season-1',
          name: 'Гаспачо арбузный',
          category: 'Холодные супы',
          price: 240,
          img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
          tags: ['Сезон'],
          description: 'Легкий суп с арбузом и свежими овощами.',
          options: { sizes: [], extras: [{ id: 'season-extra-1', label: 'Креветки', add: 120 }] },
        },
        {
          id: 'season-2',
          name: 'Салат с клубникой и шпинатом',
          category: 'Салаты',
          price: 290,
          img: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1200&auto=format&fit=crop',
          tags: ['Веган'],
          description: 'Сладкая клубника, шпинат и сыр фета.',
          options: { sizes: [], extras: [] },
        },
      ],
      theme: cloneTheme(presets['garden-party'] ?? DEFAULT_MENU_THEME),
    },
    meta: {
      isPublished: false,
      itemsCount: 18,
      lastUpdated: '2024-05-20T08:15:00.000Z',
    },
  }

  const corporateMenu: MenuRecord = {
    details: {
      id: 'corporate-packages',
      slug: 'corporate-packages',
      title: 'Корпоративные наборы',
      description: 'Решения для офисов и мероприятий.',
      cafe: {
        cafeName: 'Get Menu Catering',
        phone: '+996 770 555 000',
        whatsapp: '+996770555000',
        minOrder: 2500,
        deliveryFee: 0,
        address: 'г. Бишкек, ул. Киевская, 210',
        announcement: 'Доставим еду для вашей команды точно ко времени.',
        bannerImage: 'https://images.unsplash.com/photo-1521302080490-404edff86804?q=80&w=1200&auto=format&fit=crop',
        bannerTitle: 'Готовые решения для мероприятий',
        bannerSubtitle: 'Персональные меню под ваш запрос',
        openHours: 'Пн–Пт 09:00–19:00',
        scheduleDetails: 'Сб–Вс: по предварительному заказу',
      },
      items: [
        {
          id: 'corp-1',
          name: 'Сет «Офисный»',
          category: 'Наборы',
          price: 4900,
          img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
          tags: ['Для команды'],
          description: 'Сытный набор для команды до 10 человек.',
          options: { sizes: [], extras: [] },
        },
        {
          id: 'corp-2',
          name: 'Кофе-брейк «Утро»',
          category: 'Напитки и десерты',
          price: 2600,
          img: 'https://images.unsplash.com/photo-1495744472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
          tags: ['Популярно'],
          description: 'Кофе, мини-десерты и свежие фрукты.',
          options: {
            sizes: [
              { id: 'corp-size-1', label: 'Стандарт', add: 0 },
              { id: 'corp-size-2', label: 'Расширенный', add: 180 },
            ],
            extras: [],
          },
        },
      ],
      theme: cloneTheme(presets['night-market'] ?? DEFAULT_MENU_THEME),
    },
    meta: {
      isPublished: true,
      itemsCount: 9,
      lastUpdated: '2024-04-28T17:45:00.000Z',
    },
  }

  store.set(mainMenu.details.id, mainMenu)
  store.set(summerMenu.details.id, summerMenu)
  store.set(corporateMenu.details.id, corporateMenu)

  return store
}

function getStore () {
  const globalStore = globalThis as unknown as { [globalKey]?: Map<string, MenuRecord> }
  if (!globalStore[globalKey]) {
    globalStore[globalKey] = createInitialData()
  }
  return globalStore[globalKey]!
}

function cloneRecord (record: MenuRecord) {
  return {
    details: cloneDetails(record.details),
    meta: { ...record.meta },
  }
}

export function listUserMenus (): UserMenu[] {
  return Array.from(getStore().values()).map((record) => ({
    id: record.details.id,
    slug: record.details.slug,
    title: record.details.title,
    description: record.details.description,
    itemsCount: record.meta.itemsCount,
    isPublished: record.meta.isPublished,
    lastUpdated: record.meta.lastUpdated,
  }))
}

export function getMenuDetailsById (id: string) {
  const record = getStore().get(id)
  return record ? cloneDetails(record.details) : null
}

export function getMenuRecordBySlug (slug: string) {
  const entry = Array.from(getStore().values()).find((record) => record.details.slug === slug)
  return entry ? cloneRecord(entry) : null
}

export function updateMenuDetails (details: AdminMenuDetails) {
  const store = getStore()
  const record = store.get(details.id)
  if (!record) {
    throw new Error(`Menu with id ${details.id} not found`)
  }

  const updatedRecord: MenuRecord = {
    details: cloneDetails(details),
    meta: {
      ...record.meta,
      itemsCount: details.items.length,
      lastUpdated: new Date().toISOString(),
    },
  }

  store.set(details.id, updatedRecord)
  console.info('[menu-store] Menu updated', {
    id: details.id,
    slug: details.slug,
    title: details.title,
    updatedAt: updatedRecord.meta.lastUpdated,
  })

  return cloneDetails(updatedRecord.details)
}

export interface PublicMenuPayload {
  cafe: AdminMenuDetails['cafe']
  menu: MenuItem[]
  theme: MenuThemeConfig
  title: string
  description: string
}

export function getPublicMenuBySlug (slug: string) {
  const record = getMenuRecordBySlug(slug)
  if (!record) {
    return null
  }

  return {
    cafe: record.details.cafe,
    menu: record.details.items as MenuItem[],
    theme: cloneTheme(record.details.theme),
    title: record.details.title,
    description: record.details.description,
  } satisfies PublicMenuPayload
}
