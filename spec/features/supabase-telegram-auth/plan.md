# Implementation Plan

**Plan:** Настроить единый поток авторизации Telegram Mini App: сервер Nuxt валидирует `initData`, Supabase Edge Function создаёт или находит пользователя и выдаёт токены, клиент Nuxt устанавливает сессию и повторно использует её при последующих открытиях.

## Data sources / schemas

- Проверить структуру Supabase Auth: использовать стандартные таблицы `auth.users` и `auth.sessions` без дополнительных миграций.
- Убедиться, что Edge Function имеет доступ к Supabase Admin API и переменным окружения (`SUPABASE_SERVICE_ROLE_KEY`, `TELEGRAM_BOT_TOKEN`).
- Сохранять в профиле пользователя (таблица `public.profiles`, если используется) идентификатор Telegram и имя для будущих интеграций.
- На стороне Nuxt не хранить токены в БД, только кэшировать в памяти при установке сессии.

## Contracts and interfaces

- Создать серверный маршрут Nuxt `POST /api/auth/telegram`:
  - Вход: JSON с `initData` и опциональным `fingerprint` для аналитики.
  - Валидируемая ошибка: 400 с кодом `invalid_init_data`.
  - При успешной валидации вызывать Edge Function.
- Edge Function `telegram-auth` в Supabase:
  - Вход: JSON `{ initData: string }`.
  - Ответ 200: `{ access_token, refresh_token, user }`.
  - Ошибки: 401 `invalid_user`, 500 `supabase_error`.
- Клиентский composable `useTelegramAuth`:
  - Метод `ensureSession()` проверяет текущую сессию и вызывает API только при её отсутствии.
  - Обрабатывает ошибки и формирует UI-состояния (загрузка, ошибка, успех).

## Architecture / Components

- Nuxt сервер:
  - Использовать `@telegram-apps/init-data-node` для проверки подписи и срока действия.
  - После валидации отправлять запрос к Edge Function через Supabase client (`createClient` с `service_role` ключом или `fetch`).
  - Логировать запросы и ответы (без токенов) через существующий логгер.
- Supabase Edge Function:
  - Парсит `initData` с помощью `@telegram-apps/init-data-node` (валидация на сервере Nuxt, но повторная проверка для надёжности).
  - Находит пользователя по `telegram_user_id`; при отсутствии создаёт нового в `auth.admin.createUser` с `user_metadata`.
  - Генерирует токены через `supabase.auth.api.createSession` или `auth.admin.generateLink` (в зависимости от доступного API).
  - Возвращает объект `user` и токены.
- Nuxt клиент:
  - При запуске Mini App читает сохранённую сессию (`supabase.auth.getSession()`).
  - Если нет, обращается к `useTelegramAuth.ensureSession()`, получает токены и вызывает `supabase.auth.setSession()`.
  - Обновляет глобальное состояние пользователя (`useSupabaseUser`, Pinia/Composables).

## Risks

- Недоступность Edge Function: предусмотреть повторные попытки и fallback сообщение пользователю.
- Несоответствие времени между Telegram и сервером вызывает ошибку подписи — требуется проверка `auth_date` и допуска дрейфа.
- Утечка сервисного ключа Supabase при неправильной конфигурации: хранить ключ только в переменных окружения Edge Function.
- Ограничения Telegram WebApp (размер `initData`) — проверять длину и отклонять слишком большие payload.

## Assumptions

- Публичный хост Mini App уже зарегистрирован в BotFather и настроен на HTTPS.
- Команда согласовала UX отображения ошибок и загрузочных состояний.
- В проекте уже настроен Supabase клиент для server-side вызовов (или будет добавлен вместе с задачей).
