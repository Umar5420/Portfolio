import { defineConfig } from 'vite'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve, relative } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
// Link previews (WhatsApp, LinkedIn) need absolute image URLs, so rewrite them at build time.
const seoHtml = () => ({
  name: 'seo-absolute-urls',
  transformIndexHtml(html) {
    if (!/^https:\/\//i.test(siteUrl)) return html
    return html
      .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")\/(images\/[^"]+")/g, `$1${siteUrl}/$2`)
      .replace('</head>', `    <meta property="og:url" content="${siteUrl}/" />\n    <link rel="canonical" href="${siteUrl}/" />\n  </head>`)
  }
})

const serviceWorkerPrecache = () => ({
  name: 'portfolio-service-worker-precache',
  apply: 'build',
  async closeBundle() {
    const dist = resolve('dist')
    const collect = async (dir) => {
      const entries = await readdir(dir, { withFileTypes: true })
      const found = []
      for (const entry of entries) {
        const full = resolve(dir, entry.name)
        if (entry.isDirectory()) found.push(...await collect(full))
        else if (/\.(?:js|css|woff2?)$/i.test(entry.name)) found.push('/' + relative(dist, full).replaceAll('\\', '/'))
      }
      return found
    }
    const assets = await collect(dist)
    const swPath = resolve(dist, 'sw.js')
    const source = await readFile(swPath, 'utf8')
    if (!source.includes('const BUILD_ASSETS = [];')) throw new Error('Service worker precache marker is missing.')
    await writeFile(swPath, source.replace('const BUILD_ASSETS = [];', `const BUILD_ASSETS = ${JSON.stringify(assets)};`))
  }
})

export default defineConfig({
  plugins: [react(), tailwindcss(), seoHtml(), serviceWorkerPrecache()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    sourcemap: true
  }
})