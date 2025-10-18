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

The admin menu API is available at `GET /api/admin/menu` once the server is running. It returns an object with `menus` and `error` fields suitable for future admin UI integration.
