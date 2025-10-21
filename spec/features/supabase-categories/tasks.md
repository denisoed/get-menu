# Tasks

**Context:** Подключить форму категорий на странице создания меню к Supabase для чтения и управления категориями.

## Main directions
### Supabase data layer
- [x] Проверить структуру таблицы `categories`, добавить недостающие поля/ограничения и зафиксировать изменения в миграциях Supabase.
- [x] Реализовать модуль доступа к Supabase с методами `fetchCategories`, `createCategory`, `updateCategory`, `deleteCategory`, обрабатывающий коды ошибок.
- [x] Добавить типы/схемы валидации для данных категорий и результаты запросов Supabase.

### UI интеграция
- [x] Обновить форму категорий: загрузка списка из Supabase при открытии страницы, отображение состояния загрузки и ошибок.
- [x] Добавить функциональность создания категории: форма ввода, вызов Supabase, обновление списка и уведомление пользователя.
- [x] Реализовать редактирование существующей категории с обработкой конкурентных изменений.
- [x] Добавить удаление категории с подтверждением и обработкой ошибок (например, при связях с блюдами).
- [x] Настроить повторную загрузку или оптимистичные обновления после операций записи, чтобы UI оставался консистентным.

### Quality & testing
- [x] Написать модульные/интеграционные тесты для сервиса Supabase и компонента формы категорий.
- [x] Проверить обработку сетевых ошибок и неуспешных ответов Supabase, добавить пользовательские уведомления.

## Supporting tasks
- [x] Documentation: update relevant instructions and descriptions.
- [x] Observability: add or clarify metrics, alerts, and/or logging.
- [x] Code review and PR: prepare changes for review and accompanying information.

## Definition of Done
- [x] All tasks are completed and tested.
- [x] Relevant unit/e2e/integration tests pass successfully.
- [x] Documentation and operational instructions are updated.
- [x] `/spec/core/verify.md` is executed after completing all tasks to verify the task list.
