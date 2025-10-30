import { createError } from 'h3'
import type { MenuItem } from '~/types/menu'

const MENUS: Record<string, MenuItem[]> = {
  'main-menu': [
    {
      id: '1',
      name: 'Бургер «Классик»',
      price: 290,
      category: 'Бургеры',
      img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop',
      tags: ['Хит'],
      description: 'Сочный говяжий котлет, фирменный соус и свежие овощи внутри мягкой булочки.',
      options: {
        sizes: [
          { label: 'Мал', add: 0 },
          { label: 'Стд', add: 40 },
          { label: 'Больш', add: 80 },
        ],
        extras: [
          { label: 'Сыр', add: 40 },
          { label: 'Бекон', add: 70 },
        ],
      },
    },
    {
      id: '2',
      name: 'Бургер «Острый»',
      price: 320,
      category: 'Бургеры',
      img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop',
      tags: ['Острый'],
      description: 'Пикантный бургер с халапеньо, острым соусом и двойной порцией сыра.',
    },
    {
      id: '3',
      name: 'Картофель фри',
      price: 120,
      category: 'Закуски',
      img: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?q=80&w=1200&auto=format&fit=crop',
      tags: ['Веган'],
      description: 'Хрустящий картофель, обжаренный во фритюре до золотистой корочки.',
      options: {
        sizes: [
          { label: 'Мал', add: 0 },
          { label: 'Больш', add: 50 },
        ],
      },
    },
    {
      id: '4',
      name: 'Салат «Цезарь»',
      price: 260,
      category: 'Салаты',
      img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop',
      tags: [],
      description: 'Классический салат с соусом цезарь, курицей и пармезаном.',
    },
    {
      id: '5',
      name: 'Лимонад домашний',
      price: 110,
      category: 'Напитки',
      img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop',
      tags: [],
      description: 'Освежающий напиток с лимоном, мятой и лёгкой кислинкой.',
      options: {
        sizes: [
          { label: '300 мл', add: 0 },
          { label: '500 мл', add: 30 },
        ],
      },
    },
    {
      id: '6',
      name: 'Пицца Маргарита',
      price: 490,
      category: 'Пицца',
      img: 'https://images.unsplash.com/photo-1548365328-9f547fb095c3?q=80&w=1200&auto=format&fit=crop',
      tags: ['Хит'],
      description: 'Тонкое тесто, томатный соус, моцарелла и свежий базилик.',
      options: {
        sizes: [
          { label: '25 см', add: 0 },
          { label: '30 см', add: 120 },
          { label: '35 см', add: 220 },
        ],
        extras: [
          { label: 'Пепперони', add: 120 },
          { label: 'Сыр Моцарелла', add: 90 },
        ],
      },
    },
    {
      id: '7',
      name: 'Паста Карбонара',
      price: 380,
      category: 'Паста',
      img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop',
      tags: [],
      description: 'Классическая паста с беконом, сливочным соусом и пармезаном.',
    },
    {
      id: '8',
      name: 'Чизкейк Нью-Йорк',
      price: 220,
      category: 'Десерты',
      img: 'https://images.unsplash.com/photo-1505253216365-9b094d542965?q=80&w=1200&auto=format&fit=crop',
      tags: ['Новинка'],
      description: 'Нежный сливочный чизкейк на песочной основе с ванилью.',
    },
    {
      id: '9',
      name: 'Том-ям с креветками',
      price: 360,
      category: 'Супы',
      img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1200&auto=format&fit=crop',
      tags: ['Пикантно'],
      description: 'Ароматный тайский суп с кокосовым молоком, креветками и лимонграссом.',
      options: {
        extras: [
          { label: 'Дополнительные креветки', add: 90 },
          { label: 'Рис жасмин', add: 70 },
        ],
      },
    },
    {
      id: '10',
      name: 'Боул с лососем и киноа',
      price: 420,
      category: 'Боулы',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop',
      tags: ['Полезно'],
      description: 'Питательный боул с маринованным лососем, киноа и свежими овощами.',
    },
    {
      id: '11',
      name: 'Круассан с ветчиной и сыром',
      price: 210,
      category: 'Завтраки',
      img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1200&auto=format&fit=crop',
      tags: ['Утром'],
      description: 'Слоёный круассан с сочной ветчиной, сыром и сливочным соусом.',
    },
    {
      id: '12',
      name: 'Матча латте',
      price: 190,
      category: 'Кофе и чай',
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
      tags: ['Без сахара'],
      description: 'Кремовый латте на основе матча с миндальным молоком.',
      options: {
        sizes: [
          { label: '250 мл', add: 0 },
          { label: '400 мл', add: 40 },
        ],
        extras: [
          { label: 'Сироп ваниль', add: 30 },
          { label: 'Взбитые сливки', add: 40 },
        ],
      },
    },
  ],
  'letnee-menu': [
    {
      id: '1',
      name: 'Гаспачо арбузный',
      price: 240,
      category: 'Холодные супы',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      tags: ['Сезон'],
      description: 'Лёгкий холодный суп из арбуза, томатов и огурцов с каплей оливкового масла.',
      options: {
        extras: [
          { label: 'Креветки', add: 120 },
        ],
      },
    },
    {
      id: '2',
      name: 'Салат с клубникой и шпинатом',
      price: 290,
      category: 'Салаты',
      img: 'https://images.unsplash.com/photo-1463740839922-2d3b7e426a56?q=80&w=1200&auto=format&fit=crop',
      tags: ['Веган'],
      description: 'Свежая клубника, шпинат и фета с лёгкой цитрусовой заправкой.',
    },
    {
      id: '3',
      name: 'Сэндвич с курицей и манго',
      price: 310,
      category: 'Закуски',
      img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1200&auto=format&fit=crop',
      tags: ['Новинка'],
      description: 'Тёплый сэндвич с курицей, манго и пикантным соусом карри.',
    },
    {
      id: '4',
      name: 'Лимонад с маракуйей',
      price: 180,
      category: 'Напитки',
      img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop',
      tags: ['Хит'],
      description: 'Искристый лимонад с мякотью маракуйи и ароматом мяты.',
      options: {
        sizes: [
          { label: '350 мл', add: 0 },
          { label: '500 мл', add: 40 },
        ],
      },
    },
    {
      id: '5',
      name: 'Мороженое с базиликом и лаймом',
      price: 210,
      category: 'Десерты',
      img: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=1200&auto=format&fit=crop',
      tags: [],
      description: 'Домашнее мороженое с нотами базилика и лаймовой свежести.',
    },
    {
      id: '6',
      name: 'Овощи гриль с халлуми',
      price: 330,
      category: 'Гриль',
      img: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?q=80&w=1200&auto=format&fit=crop',
      tags: ['Лето'],
      description: 'Тёплая тарелка из цуккини, перца и халлуми с соусом песто.',
    },
    {
      id: '7',
      name: 'Смузи «Тропический бриз»',
      price: 260,
      category: 'Смузи',
      img: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?q=80&w=1200&auto=format&fit=crop',
      tags: ['Освежает'],
      description: 'Смузи из ананаса, манго и кокосовой воды с мятой.',
      options: {
        extras: [
          { label: 'Чиа', add: 25 },
          { label: 'Протеин', add: 45 },
        ],
      },
    },
  ],
  'corporate-packages': [
    {
      id: '1',
      name: 'Сет «Офисный»',
      price: 4900,
      category: 'Наборы',
      img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      tags: ['Для команды'],
      description: 'Готовый обед для команды до десяти человек с горячими блюдами и закусками.',
    },
    {
      id: '2',
      name: 'Сет «Фуршет»',
      price: 7200,
      category: 'Наборы',
      img: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=1200&auto=format&fit=crop',
      tags: ['Премиум'],
      description: 'Ассорти канапе, мини-десертов и напитков для статусных мероприятий.',
    },
    {
      id: '3',
      name: 'Кофе-брейк «Утро»',
      price: 2600,
      category: 'Напитки и десерты',
      img: 'https://images.unsplash.com/photo-1495744472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
      tags: [],
      description: 'Горячий кофе, выпечка и лёгкие десерты для продуктивного утра.',
      options: {
        extras: [
          { label: 'Фрукты', add: 600 },
        ],
      },
    },
    {
      id: '4',
      name: 'Ланч-боксы персональные',
      price: 540,
      category: 'Персональные наборы',
      img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?q=80&w=1200&auto=format&fit=crop',
      tags: ['Популярно'],
      description: 'Индивидуальные наборы с горячим блюдом, гарниром и салатом.',
      options: {
        sizes: [
          { label: 'Стандарт', add: 0 },
          { label: 'Расширенный', add: 180 },
        ],
      },
    },
    {
      id: '5',
      name: 'Фуршет «Вечер в городе»',
      price: 8900,
      category: 'Праздничные наборы',
      img: 'https://images.unsplash.com/photo-1547919307-1ecb10702e11?q=80&w=1200&auto=format&fit=crop',
      tags: ['Событие'],
      description: 'Разнообразные мини-бургеры, тарталетки и десерты для вечерних мероприятий.',
      options: {
        extras: [
          { label: 'Официант на мероприятие', add: 2500 },
        ],
      },
    },
    {
      id: '6',
      name: 'Десертный стол «Sweet Break»',
      price: 3600,
      category: 'Десерты',
      img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop',
      tags: ['Для кофе-брейка'],
      description: 'Набор из пирожных, маффинов и фруктов для уютного перерыва.',
    },
  ],
}

export default defineEventHandler((event) => {
  const slug = event.context.params?.slug
  if (!slug || typeof slug !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Неверный идентификатор меню',
    })
  }

  const menu = MENUS[slug]

  if (!menu) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Меню не найдено',
    })
  }

  return menu
})
