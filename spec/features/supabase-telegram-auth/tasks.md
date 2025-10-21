# Tasks

**Context:** Настроить поток авторизации Telegram Mini App с валидацией `initData` на сервере Nuxt, интеграцией Supabase Edge Function и установкой сессии на клиенте без повторной авторизации при последующих открытиях.

## Main directions

### Nuxt серверная авторизация
- [ ] Реализовать маршрут `POST /api/auth/telegram` с валидацией `initData` через `@telegram-apps/init-data-node`; покрыть unit-тестом сценарии валидного и невалидного пакета (`tests/server/auth-telegram.spec.ts`).
- [ ] Добавить защиту от повторных запросов с просроченным `auth_date` и чрезмерным размером payload; протестировать с помощью unit-теста и ручной проверкой в dev-режиме.
- [ ] Настроить логирование успешных и неуспешных авторизаций с маскированием чувствительных данных; убедиться через локальные логи.

### Supabase Edge Function
- [ ] Создать Edge Function `telegram-auth`, которая принимает валидированный `initData`, находит или создаёт пользователя через Admin API и возвращает `access_token`, `refresh_token`, `user`; протестировать локально через `supabase functions serve` и интеграционный тест вызова.
- [ ] Обработать ошибки Supabase (создание пользователя, генерация токенов) с корректными кодами ответа; проверить через симулированные ошибки (подставные ключи/пользователь уже существует).

### Nuxt клиентская интеграция
- [ ] Реализовать composable `useTelegramAuth` с методом `ensureSession()` и состояниями загрузки/ошибки; покрыть unit-тестом на логику пропуска авторизации при активной сессии.
- [ ] Подключить composable в точке входа Mini App (например, `app/pages/index.vue`) и обеспечить вызов `supabase.auth.setSession()` при получении токенов; протестировать e2e-скриптом или ручным тестом в Telegram WebApp.
- [ ] Добавить пользовательские сообщения об ошибках и индикатор загрузки в UI с Tailwind-классами, убедиться в корректном отображении в светлой/тёмной теме.

### Наблюдаемость и безопасность
- [ ] Настроить трассировку/корреляционные ID для цепочки запросов (Nuxt API → Edge Function) и убедиться, что чувствительные значения не логируются; проверить через локальные логи.
- [ ] Обновить конфигурацию окружения (`.env`, Supabase secrets) с необходимыми ключами и добавить инструкции по их установке в README или существующий документ; проверить загрузку переменных при билде.

## Supporting tasks

- [ ] Documentation: update relevant instructions and descriptions (раздел интеграции Mini App и Supabase).
- [ ] Observability: add or clarify metrics, alerts, and/or logging.
- [ ] Code review and PR: prepare changes for review and accompanying information.

## Definition of Done

- [ ] All tasks are completed and tested.
- [ ] Relevant unit/e2e/integration tests pass successfully.
- [ ] Documentation and operational instructions are updated.
- [ ] `/spec/core/verify.md` is executed after completing all tasks to verify the task list.
