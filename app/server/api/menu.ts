export default defineEventHandler(() => {
  return [
    { id: '1', name: 'Бургер «Классик»', price: 290, category: 'Бургеры', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop', tags: ['Хит'], options: { sizes: [{label:'Мал', add:0},{label:'Стд', add:40},{label:'Больш', add:80}], extras: [{label:'Сыр', add:40}, {label:'Бекон', add:70}] } },
    { id: '2', name: 'Бургер «Острый»', price: 320, category: 'Бургеры', img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop', tags: ['Острый'] },
    { id: '3', name: 'Картофель фри', price: 120, category: 'Закуски', img: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?q=80&w=1200&auto=format&fit=crop', tags: ['Веган'], options: { sizes: [{label:'Мал', add:0},{label:'Больш', add:50}] } },
    { id: '4', name: 'Салат «Цезарь»', price: 260, category: 'Салаты', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1200&auto=format&fit=crop', tags: [] },
    { id: '5', name: 'Лимонад домашний', price: 110, category: 'Напитки', img: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop', tags: [], options: { sizes: [{label:'300 мл', add:0},{label:'500 мл', add:30}] } },
    { id: '6', name: 'Пицца Маргарита', price: 490, category: 'Пицца', img: 'https://images.unsplash.com/photo-1548365328-9f547fb095c3?q=80&w=1200&auto=format&fit=crop', tags: ['Хит'], options: { sizes: [{label:'25 см', add:0},{label:'30 см', add:120},{label:'35 см', add:220}], extras: [{label:'Пепперони', add:120},{label:'Сыр Моцарелла', add:90}] } },
    { id: '7', name: 'Паста Карбонара', price: 380, category: 'Паста', img: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2f642?q=80&w=1200&auto=format&fit=crop', tags: [] },
    { id: '8', name: 'Чизкейк Нью-Йорк', price: 220, category: 'Десерты', img: 'https://images.unsplash.com/photo-1505253216365-9b094d542965?q=80&w=1200&auto=format&fit=crop', tags: ['Новинка'] },
  ];
})
