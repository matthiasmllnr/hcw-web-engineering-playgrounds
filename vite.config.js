import { defineConfig } from 'vite'

export default defineConfig({
  base: '/hcw-web-engineering-playgrounds/',
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
