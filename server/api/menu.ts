export default defineEventHandler(() => {
  return [
    { id: '1', name: 'Бургер «Классик»', price: 290, category: 'Бургеры', img: 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_1280.jpg', tags: ['Хит'], options: { sizes: [{label:'Мал', add:0},{label:'Стд', add:40},{label:'Больш', add:80}], extras: [{label:'Сыр', add:40}, {label:'Бекон', add:70}] } },
    { id: '2', name: 'Бургер «Острый»', price: 320, category: 'Бургеры', img: 'https://cdn.pixabay.com/photo/2017/02/15/10/39/burger-2068860_1280.jpg', tags: ['Острый'] },
    { id: '3', name: 'Картофель фри', price: 120, category: 'Закуски', img: 'https://cdn.pixabay.com/photo/2016/11/23/15/24/food-1853305_1280.jpg', tags: ['Веган'], options: { sizes: [{label:'Мал', add:0},{label:'Больш', add:50}] } },
    { id: '4', name: 'Салат «Цезарь»', price: 260, category: 'Салаты', img: 'https://cdn.pixabay.com/photo/2016/12/26/17/28/salad-1932467_1280.jpg', tags: [] },
    { id: '5', name: 'Лимонад домашний', price: 110, category: 'Напитки', img: 'https://cdn.pixabay.com/photo/2015/07/02/20/58/lemonade-828389_1280.jpg', tags: [], options: { sizes: [{label:'300 мл', add:0},{label:'500 мл', add:30}] } },
    { id: '6', name: 'Пицца Маргарита', price: 490, category: 'Пицца', img: 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_1280.jpg', tags: ['Хит'], options: { sizes: [{label:'25 см', add:0},{label:'30 см', add:120},{label:'35 см', add:220}], extras: [{label:'Пепперони', add:120},{label:'Сыр Моцарелла', add:90}] } },
    { id: '7', name: 'Паста Карбонара', price: 380, category: 'Паста', img: 'https://cdn.pixabay.com/photo/2016/12/26/16/38/spaghetti-1932466_1280.jpg', tags: [] },
    { id: '8', name: 'Чизкейк Нью-Йорк', price: 220, category: 'Десерты', img: 'https://cdn.pixabay.com/photo/2020/03/12/07/31/cheesecake-4920670_1280.jpg', tags: ['Новинка'] },
  ];
})
