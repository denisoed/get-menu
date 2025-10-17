export default defineEventHandler(() => {
  return [
    {
      id: 'main-menu',
      title: 'Основное меню',
      description: 'Базовое меню кафе с актуальными позициями и ценами.',
      itemsCount: 42,
      isPublished: true,
      lastUpdated: '2024-05-30T10:30:00.000Z'
    },
    {
      id: 'summer-special',
      title: 'Летнее сезонное меню',
      description: 'Лимонады, холодные супы и десерты для летних промо.',
      itemsCount: 18,
      isPublished: false,
      lastUpdated: '2024-05-20T08:15:00.000Z'
    },
    {
      id: 'corporate-packages',
      title: 'Корпоративные наборы',
      description: 'Подборка сетов для мероприятий и кейтеринга.',
      itemsCount: 9,
      isPublished: true,
      lastUpdated: '2024-04-28T17:45:00.000Z'
    }
  ]
})
