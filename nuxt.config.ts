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
      // Мета-теги ниже синхронизируют фон статус-бара Safari и WebView
      // с активной цветовой схемой приложения. Без них верхняя панель на iOS
      // оставалась светлой даже при включенной темной теме.
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Онлайн-меню с быстрым заказом для кафе и ресторанов' },
        { name: 'color-scheme', content: 'light dark' },
        {
          id: 'theme-color-dark',
          name: 'theme-color',
          media: '(prefers-color-scheme: dark)',
          content: '#0f172a'
        },
        {
          id: 'theme-color-light',
          name: 'theme-color',
          media: '(prefers-color-scheme: light)',
          content: '#f8fafc'
        },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' }
      ]
    }
  },

  typescript: {
    typeCheck: false
  }
})