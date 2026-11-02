import { existsSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const checks = []
const add = (name, ok, detail) => checks.push({ name, ok, detail })
add('package.json exists', existsSync('package.json'), 'Run from the project root.')
add('Worker entry exists', existsSync('worker/index.js'), 'Expected worker/index.js.')
add('Pages API proxy exists', existsSync('functions/api/[[path]].js'), 'Expected same-origin API proxy.')
add('D1 migrations exist', existsSync('migrations/0001_initial.sql') && existsSync('migrations/0002_inquiries.sql') && existsSync('migrations/0003_analytics.sql'), 'Base, inquiry and analytics migrations should be present.')
add('.dev.vars is ignored', existsSync('.gitignore') && readFileSync('.gitignore', 'utf8').split(/\r?\n/).includes('.dev.vars'), 'Ensure .dev.vars is listed in .gitignore.')
add('wrangler API config has a concrete D1 ID', existsSync('wrangler.api.toml') && /database_id\s*=\s*"[0-9a-f-]{36}"/i.test(readFileSync('wrangler.api.toml', 'utf8')), 'Verify this configured ID belongs to the Cloudflare account you intend to deploy.')
add('Pages service binding exists', existsSync('wrangler.toml') && /binding\s*=\s*"PORTFOLIO_API"/.test(readFileSync('wrangler.toml', 'utf8')), 'The Pages Function must reach the API Worker through PORTFOLIO_API.')
add('PWA offline shell exists', existsSync('public/sw.js') && existsSync('public/offline.html') && existsSync('public/site.webmanifest'), 'Service worker, offline fallback and web manifest are required.')
add('Project screenshot set exists', ['dailycarlift-home.png','dailycarlift-service.png','adson-dashboard.png','adson-approvals.png','jarvis-interface.png','royal-landmark-launch.png','sell-cars-marketplace.png'].every(name => existsSync(`public/images/${name}`)), 'The screenshot-backed work cards and gallery must not use unrelated placeholders.')

for (const c of checks) console.log(`${c.ok ? 'PASS' : 'CHECK'}  ${c.name} — ${c.detail}`)
const build = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'build'], { stdio: 'inherit' })
if (build.error) console.error(build.error)
process.exit(checks.every(c => c.ok) && build.status === 0 ? 0 : 1)
