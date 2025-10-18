import { createError } from 'h3'
import type { MenuItem } from '~/types/menu'

const MENUS: Record<string, MenuItem[]> = {
  'main-menu': [
    { id: '1', name: 'Бургер «Классик»', price: 290, category: 'Бургеры', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop', tags: ['Хит'], options: { sizes: [{ label: 'Мал', add: 0 }, { label: 'Стд', add: 40 }, { label: 'Больш', add: 80 }], extras: [{ label: 'Сыр', add: 40 }, { label: 'Бекон', add: 70 }] } },
    { id: '2', name: 'Бургер «Острый»', price: 320, category: 'Бургеры', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop', tags: ['Острый'] },
    { id: '3', name: 'Картофель фри', price: 120, category: 'Закуски', img: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?q=80&w=1200&auto=format&fit=crop', tags: ['Веган'], options: { sizes: [{ label: 'Мал', add: 0 }, { label: 'Больш', add: 50 }] } },
    { id: '4', name: 'Салат «Цезарь»', price: 260, category: 'Салаты', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop', tags: [] },
    { id: '5', name: 'Лимонад домашний', price: 110, category: 'Напитки', img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop', tags: [], options: { sizes: [{ label: '300 мл', add: 0 }, { label: '500 мл', add: 30 }] } },
    { id: '6', name: 'Пицца Маргарита', price: 490, category: 'Пицца', img: 'https://images.unsplash.com/photo-1548365328-9f547fb095c3?q=80&w=1200&auto=format&fit=crop', tags: ['Хит'], options: { sizes: [{ label: '25 см', add: 0 }, { label: '30 см', add: 120 }, { label: '35 см', add: 220 }], extras: [{ label: 'Пепперони', add: 120 }, { label: 'Сыр Моцарелла', add: 90 }] } },
    { id: '7', name: 'Паста Карбонара', price: 380, category: 'Паста', img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop', tags: [] },
    { id: '8', name: 'Чизкейк Нью-Йорк', price: 220, category: 'Десерты', img: 'https://images.unsplash.com/photo-1505253216365-9b094d542965?q=80&w=1200&auto=format&fit=crop', tags: ['Новинка'] }
  ],
  'letnee-menu': [
    { id: '1', name: 'Гаспачо арбузный', price: 240, category: 'Холодные супы', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', tags: ['Сезон'], options: { extras: [{ label: 'Креветки', add: 120 }] } },
    { id: '2', name: 'Салат с клубникой и шпинатом', price: 290, category: 'Салаты', img: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1200&auto=format&fit=crop', tags: ['Веган'] },
    { id: '3', name: 'Сэндвич с курицей и манго', price: 310, category: 'Закуски', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop', tags: ['Новинка'] },
    { id: '4', name: 'Лимонад с маракуйей', price: 180, category: 'Напитки', img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop', tags: ['Хит'], options: { sizes: [{ label: '350 мл', add: 0 }, { label: '500 мл', add: 40 }] } },
    { id: '5', name: 'Мороженое с базиликом и лаймом', price: 210, category: 'Десерты', img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop', tags: [] }
  ],
  'corporate-packages': [
    { id: '1', name: 'Сет «Офисный»', price: 4900, category: 'Наборы', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop', tags: ['Для команды'] },
    { id: '2', name: 'Сет «Фуршет»', price: 7200, category: 'Наборы', img: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1200&auto=format&fit=crop', tags: ['Премиум'] },
    { id: '3', name: 'Кофе-брейк «Утро»', price: 2600, category: 'Напитки и десерты', img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop', tags: [], options: { extras: [{ label: 'Фрукты', add: 600 }] } },
    { id: '4', name: 'Ланч-боксы персональные', price: 540, category: 'Персональные наборы', img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?q=80&w=1200&auto=format&fit=crop', tags: ['Популярно'], options: { sizes: [{ label: 'Стандарт', add: 0 }, { label: 'Расширенный', add: 180 }] } }
  ]
}

export default defineEventHandler((event) => {
  const slug = event.context.params?.slug
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню'
    })
  }

  const menu = MENUS[slug]

  if (!menu) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено'
    })
  }

  return menu
})
