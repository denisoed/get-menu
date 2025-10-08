// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: '~/tailwind.config.js'
  },

  app: {
    head: {
      title: 'Меню • Быстрый заказ',
      // Этот мета-тег используется в useTheme.syncSurfaceColor(), чтобы Safari и WebView
      // окрашивали статус-бар в тот же цвет, что и текущий фон приложения.
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Онлайн-меню с быстрым заказом для кафе и ресторанов' },
        { name: 'color-scheme', content: 'light dark' },
        {
          id: 'theme-color',
          name: 'theme-color',
          content: '#f8fafc'
        }
      ]
    }
  },

  typescript: {
    typeCheck: false
  }
})