import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').trim().replace(/\/$/, '')
const robotsPath = resolve('public/robots.txt')
let robots = 'User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n'

if (siteUrl && /^https:\/\//i.test(siteUrl)) {
  const lastmod = new Date().toISOString().slice(0, 10)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>\n  <url><loc>${siteUrl}/cv</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>\n`
  await writeFile(resolve('public/sitemap.xml'), sitemap)
  robots += `Sitemap: ${siteUrl}/sitemap.xml\n`
  console.log(`SEO sitemap generated for ${siteUrl}`)
} else {
  console.warn('SITE_URL is not configured with an https:// URL. Sitemap generation skipped; set SITE_URL in your production build environment.')
}
await writeFile(robotsPath, robots)
