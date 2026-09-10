import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // CRUCIAL: Forces the compiler to use relative assets paths so it never breaks on Netlify
  build: {
    outDir: 'dist',
  }
})
