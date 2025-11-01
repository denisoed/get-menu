# API быстрых правок меню

## POST `/api/menu/ai-diff`
Генерирует список изменений на основе свободного текста.

### Тело запроса
```json
{
  "menuId": "main-menu",
  "instructions": "Для блюда Бургер «Классик» подними цену до 350"
}
```

### Ответ
```json
{
  "requestId": "qe_xxx",
  "auditId": "audit_xxx",
  "menuId": "main-menu",
  "generatedAt": "2024-06-10T10:15:30.000Z",
  "promptTemplate": "...",
  "schemaDefinition": "...",
  "summary": "Найдено 1 блюдо...",
  "instructionsEcho": "...",
  "items": [
    {
      "id": "qe_xxx:dish-1",
      "itemId": "dish-1",
      "itemName": "Бургер «Классик»",
      "confidence": "exact",
      "canApply": true,
      "reason": "Совпадение по названию блюда",
      "changes": [
        { "id": "price:dish-1", "field": "price", "label": "Цена", "previousValue": 290, "nextValue": 350, "unit": "KGS" }
      ],
      "warnings": []
    }
  ],
  "globalWarnings": []
}
```

### Ошибки
- `400` — невалидное тело запроса.
- `404` — меню не найдено.
- `422` — AI не смог распознать изменения.
- `429` — превышен лимит запросов (не более 5 в минуту).

## POST `/api/menu/apply-diff`
Применяет выбранные изменения к меню.

### Тело запроса
```json
{
  "menuId": "main-menu",
  "requestId": "qe_xxx",
  "items": [
    {
      "itemId": "dish-1",
      "changes": [
        { "field": "price", "value": 350 },
        { "field": "tags", "value": "Хит, Новинка" }
      ]
    }
  ]
}
```

### Ответ
```json
{
  "menuId": "main-menu",
  "requestId": "qe_xxx",
  "auditId": "audit_xxx",
  "appliedCount": 1,
  "updatedItems": [
    {
      "id": "dish-1",
      "name": "Бургер «Классик»",
      "price": 350,
      "tagIds": ["tag-hit", "tag-new"],
      "tags": ["Хит", "Новинка"],
      "description": "..."
    }
  ],
  "warnings": []
}
```

### Ошибки
- `400` — некорректное тело запроса.
- `404` — сессия быстрого редактирования не найдена (нужно повторно вызвать `/ai-diff`).
- `404` — меню не найдено.

## Наблюдаемость
- Все запросы логируются в `console` с префиксами `[api][menu][ai-diff]` и `[api][menu][apply-diff]`.
- Журнал аудита доступен через `app/server/data/menu-quick-edit-audit.ts` и хранит статус (`diff_generated`, `applied`, `failed`).
- При ошибках статуса `failed` в журнал сохраняется сообщение об ошибке.
