export const QUICK_EDIT_PROMPT_TEMPLATE = `Ты — ассистент для менеджера меню кафе. Получишь текстовую инструкцию с просьбами изменить блюда (цену, описание, теги).

1. Найди упоминания блюд, сопоставь с текущим списком по названию (регистр не важен).
2. Для каждого блюда сформируй изменения: цена (в KGS, число), теги (массив строк), описание (строка).
3. Игнорируй поля, которые не удалось распознать однозначно, добавь предупреждение.
4. Ответь строго в JSON по схеме, без пояснений.`

export const QUICK_EDIT_RESPONSE_SCHEMA = `{
  "summary": string,
  "items": Array<{
    "id": string,
    "name": string,
    "confidence": "exact" | "fuzzy" | "unknown",
    "reason": string,
    "changes": Array<{
      "field": "price" | "tags" | "description",
      "value": number | string | string[],
      "confidence": "high" | "medium" | "low"
    }>,
    "warnings": string[]
  }>,
  "warnings": string[]
}`
