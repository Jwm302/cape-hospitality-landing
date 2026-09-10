import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // CRUCIAL: Forces the compiler to use relative assets paths so it never breaks on Netlify
  build: {
    outDir: 'dist',
  }
})
