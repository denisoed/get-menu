import { defineConfig } from 'vitest/config'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.ts'],
    environmentMatchGlobs: [['tests/components/**', 'jsdom']]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './app'),
      '~/': path.resolve(__dirname, './app/'),
      '@/': path.resolve(__dirname, './app/')
    }
  }
})
