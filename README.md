# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Supabase configuration

1. Copy `.env.example` to `.env` and fill in the Supabase project URL and service role key.
2. The service role key is used only on the server. Do not expose it in client-side code or commit it to the repository.
3. After setting the variables, restart the Nuxt development server so that the runtime configuration is refreshed.
4. В Supabase создайте таблицу `menus`, которая описывает коллекции блюд (например, "Летнее меню"). Таблица должна содержать, как минимум, поля `id`, `name`, `slug`, `description`, `is_active`, `position`, временные границы действия и временные метки. Отдельная таблица `dishes` будет ссылаться на `menus.id` для хранения блюд.

The admin menu API is available at `GET /api/admin/menu` once the server is running. It returns an object with `menus` and `error` fields suitable for future admin UI integration.

## Создание меню и выбор сабдомена

- При создании меню в админке сначала выберите адрес меню — сабдомен отображается над блоком «Контакты и витрина» и сразу показывает итоговую ссылку вида `https://example.get-menu.com`.
- Допустимы только строчные латинские буквы, цифры и дефисы, длиной от 3 до 32 символов. Адрес не может начинаться и заканчиваться дефисом.
- Поле автоматически проверяет уникальность с debounce и подсвечивает статус: зелёный — свободно, красный — уже занято, жёлтый — ошибка проверки.
- На странице редактирования меню адрес доступен только для чтения. Рядом есть кнопка «Копировать ссылку», использующая Clipboard API с fallback и уведомлениями об успехе или ошибке.
- В API сохранения (`POST /api/admin/menu` и `PATCH /api/admin/menu/:id`) поле `subdomain` является обязательным. При конфликте сервер возвращает 409 и код ошибки `subdomain_conflict`.
