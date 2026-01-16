import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // <--- Добавь эту строку
  server: {
    open: true,
  },
});
