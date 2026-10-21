import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import postcss from 'postcss'
import cascadeLayers from '@csstools/postcss-cascade-layers'
import { transform } from 'lightningcss'

// Oldest browsers the stylesheet should still work in (major << 16).
const CSS_TARGETS = {
  safari: 12 << 16,
  ios_saf: 12 << 16,
  chrome: 80 << 16,
  edge: 80 << 16,
  firefox: 78 << 16,
}

// Tailwind 4 puts every style inside cascade layers (@layer) and uses modern
// colour functions (oklch, color-mix). Safari before 15.4, common on older Macs
// that can no longer update, ignores layered styles completely and shows the
// site unstyled. After the build, flatten the layers and add rgb fallbacks.
function legacyCss(): Plugin {
  return {
    name: 'legacy-css',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_options, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.css')) continue
        const flat = await postcss([cascadeLayers()]).process(String(file.source), { from: undefined })
        const { code } = transform({
          filename: file.fileName,
          code: Buffer.from(flat.css),
          minify: true,
          targets: CSS_TARGETS,
        })
        file.source = code.toString()
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), legacyCss()],
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    // Same browsers as the CSS: Vite's default (Safari 14+) leaves syntax such as
    // optional chaining in place, which blanks the page on older Macs.
    target: ['es2017', 'safari12', 'chrome80', 'edge80', 'firefox78'],
  }
})
