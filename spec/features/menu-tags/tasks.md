# Tasks

**Context:** Добавить управляемые теги в редакторе меню: CRUD-интерфейс в админке, хранение в Supabase и выбор тегов в блюдах.

## Main directions

### База данных и схемы

- [ ] Подготовить миграцию Supabase для таблицы `tags` и обновления таблицы блюд (`tag_ids uuid[]`), учесть триггер обновления `updated_at`.
- [ ] Обновить Zod-схемы в `~/schemas` для тегов и меню, синхронизировать с типами в `~/types`.
- [ ] Обновить фикстуры/seed'ы, если используются в тестовой среде.

### Backend API и сервисы

- [ ] Создать сервис `~/server/services/tags.ts` с функциями CRUD и интеграцией Supabase.
- [ ] Реализовать REST endpoints в `app/server/api/admin/tags` (GET/POST/PATCH/DELETE) с проверкой прав и обработкой ошибок.
- [ ] Дополнить обработчики меню, чтобы принимать и сохранять массив `tag_ids`, а при удалении тега очищать ссылки.

### Frontend и UX редактора меню

- [ ] Создать компонент `MenuTagManager.vue` в `app/components/admin` и встроить его под секцию категорий на странице `app/pages/admin/create.vue`.
- [ ] Добавить composable `useMenuTags` для загрузки и управления тегами, подключить его к новой секции.
- [ ] Обновить карточки блюд для выбора заранее созданных тегов (мультивыбор), включить массив тегов в submit-пэйлоад.
- [ ] Обеспечить отображение ошибок/состояний загрузки и соответствие визуальному стилю.

## Supporting tasks

- [ ] Documentation: update relevant instructions and descriptions.
- [ ] Observability: add or clarify metrics, alerts, and/or logging.
- [ ] Code review and PR: prepare changes for review and accompanying information.

## Definition of Done

- [ ] All tasks are completed and tested.
- [ ] Relevant unit/e2e/integration tests pass successfully.
- [ ] Documentation and operational instructions are updated.
- [ ] `/spec/core/verify.md` is executed after completing all tasks to verify the task list.
