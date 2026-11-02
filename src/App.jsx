import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Asterisk, Code2, Layers3, Palette, Megaphone, Search, Smartphone, Globe2, Moon, Sun, Menu, X, Linkedin, Mail, MoveUpRight, Sparkles, ChevronDown, Bot, Command } from 'lucide-react'
import { usePreferences } from './lib/preferences'
import ThemeStudio from './components/ThemeStudio'
import Greeting from './components/Greeting'
import Gallery from './components/Gallery'
import Conversations from './components/Conversations'
import { WalkingMe, AboutPhoto, Ribbon, StudioBand, useHeroParallax } from './components/Motion'
import { AmbientFX, RoleTyper, FloatingChips, StatementBand, MegaName, useAnimatedExtras } from './components/Motion3'
import { Preloader, Cursor, useSmoothScroll, useHoverEffects, useHeroReveal, useTimelineDraw } from './components/Motion2'
import { HowIWork, AlsoOffered, SkillGroups, Faq, CvLink, ContactExtras } from './components/Sections'
import { HeroTerminal, Estimator, ProjectShowcase, useScramble } from './components/Features'
import { Teach } from './components/Teach'
import { CommandPalette } from './components/CommandPalette'
import { SkillOrbit } from './components/SkillOrbit'
import { AvailabilityBadge, availabilityInfo } from './components/Availability'
import { Tilt, Laptop, Shot } from './components/DeviceFrame'
import { api } from './lib/api'
import { PortfolioExtras } from './components/PortfolioExtras'
import './extras.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const fallbackServices = [
  { n: '01', title: 'Web & Software Development', desc: 'Modern websites, web applications, dashboards and custom business platforms.', icon: Code2, tags: ['React', 'Next.js', 'Laravel'] },
  { n: '02', title: 'Mobile Applications', desc: 'Useful, intuitive mobile experiences designed around real business needs.', icon: Smartphone, tags: ['Flutter', 'Android', 'API'] },
  { n: '03', title: 'Business Systems', desc: 'CRMs, ERP, PMS and portals that bring daily operations into one clear workflow.', icon: Layers3, tags: ['CRM', 'ERP', 'PMS'] },
  { n: '04', title: 'Graphic & Visual Design', desc: 'Brand identity, social creatives, promotional posters, banners and thumbnails.', icon: Palette, tags: ['Branding', 'Social', 'Campaigns'] },
  { n: '05', title: 'Digital Marketing', desc: 'Campaign setup, social media management and practical growth support.', icon: Megaphone, tags: ['Ads', 'Social Media', 'Content'] },
  { n: '06', title: 'SEO & Online Presence', desc: 'Search visibility, on-page improvements and Google Business Profile management.', icon: Search, tags: ['SEO', 'Local SEO', 'GBP'] },
]

const fallbackProjects = [
  { id: '01', name: 'DailyCarlift', type: 'Mobility · Transport Website', desc: 'A clear, service-led website for daily car-lift transport between Sharjah and Dubai.', tone: 'lime', mark: 'DC', coverImage: '/images/dailycarlift-home.png', gallery: ['/images/dailycarlift-service.png'], technologies: ['Responsive Web Design', 'JavaScript', 'UI/UX'] },
  { id: '02', name: 'Adson Client Hunter', type: 'Business Software · Client Operations', desc: 'A workflow dashboard for managing client acquisition, approvals and follow-up activity.', tone: 'blue', mark: 'AH', coverImage: '/images/adson-dashboard.png', gallery: ['/images/adson-approvals.png'], technologies: ['Dashboard UI', 'Workflow Automation', 'Web Application'] },
  { id: '03', name: 'J.A.R.V.I.S.', type: 'AI · Interactive Interface', desc: 'An experimental AI assistant interface with a focused, immersive visual experience.', tone: 'violet', mark: 'J', coverImage: '/images/jarvis-interface.png', gallery: [], technologies: ['AI Interface', 'Motion Design', 'Web Experience'] },
  { id: '04', name: 'Royal Landmark Property Management L.L.C.', type: 'Property · Business Website', desc: 'A digital launch experience for Royal Landmark Property Management L.L.C.', tone: 'peach', mark: 'RL', coverImage: '/images/royal-landmark-launch.png', gallery: [], technologies: ['Web Design', 'Brand Experience', 'Responsive Layout'] },
  { id: '05', name: 'SellCarsOnCars', type: 'Automotive · Marketplace', desc: 'A car discovery and marketplace experience for browsing vehicles in Pakistan.', tone: 'violet', mark: 'CAR', coverImage: '/images/sell-cars-marketplace.png', gallery: [], technologies: ['Marketplace UI', 'Search & Filters', 'Responsive Web'] },
]

const fallbackSkills = ['React.js', 'Next.js', 'JavaScript', 'HTML & CSS', 'Tailwind CSS', 'PHP', 'Laravel', 'Flutter', 'Dart', 'MySQL', 'Firebase', 'PostgreSQL', 'REST APIs', 'Git & GitHub', 'Figma', 'SEO']

const fallbackProfile = {
  name: 'Umar Sadiq',
  role: 'Software Engineer & CS Instructor',
  email: 'info@adsondigitals.com',
  location: 'Pakistan · Worldwide',
  availability: 'open',
  availabilityNote: '',
  intro: "I'm Umar — a software engineer who builds useful products for businesses, and a CS instructor who teaches others how to build them."
}
const serviceIcons = [Code2, Smartphone, Layers3, Palette, Megaphone, Search]
const serviceTags = [
  ['React', 'Next.js', 'Laravel'], ['Flutter', 'Android', 'API'],
  ['CRM', 'ERP', 'PMS'], ['Branding', 'Social', 'Campaigns'],
  ['Ads', 'Social Media', 'Content'], ['SEO', 'Local SEO', 'GBP']
]
const projectTones = ['peach', 'blue', 'lime', 'violet']
const projectMarks = ['DC', 'AH', 'J', 'RL', 'CAR']

function screenshotProjectFor(name = '') {
  const value = String(name).trim().toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ')
  if (/^(royal societes pms|royasocietes pms)$/.test(value) || value.startsWith('royal societes pms ') || value.startsWith('royasocietes pms ')) return { remove: true }
  if (/^(cl|carlift|car lift|daily carlift|daily car lift|carlift sharjah to dubai)$/.test(value) || ((value.includes('carlift') || value.includes('car lift')) && value.includes('sharjah'))) return { name: 'DailyCarlift', type: 'Mobility · Transport Website', description: 'A clear, service-led website for daily car-lift transport between Sharjah and Dubai.', coverImage: '/images/dailycarlift-home.png', gallery: ['/images/dailycarlift-service.png'], mark: 'DC' }
  if (/^(sc|sellcarsoncars|sell cars on cars)$/.test(value)) return { name: 'SellCarsOnCars', type: 'Automotive · Marketplace', description: 'A car discovery and marketplace experience for browsing vehicles in Pakistan.', coverImage: '/images/sell-cars-marketplace.png', gallery: [], mark: 'CAR' }
  if (/^(royallandmark|royal landmark|royal landmark property management|royal landmark property management l l c)$/.test(value) || value.startsWith('royal landmark property management ')) return { name: 'Royal Landmark Property Management L.L.C.', type: 'Property · Business Website', description: 'A digital launch experience for Royal Landmark Property Management L.L.C.', coverImage: '/images/royal-landmark-launch.png', gallery: [], mark: 'RL' }
  if (/^adson client hunter$/.test(value)) return { name: 'Adson Client Hunter', type: 'Business Software · Client Operations', description: 'A workflow dashboard for managing client acquisition, approvals and follow-up activity.', coverImage: '/images/adson-dashboard.png', gallery: ['/images/adson-approvals.png'], mark: 'AH' }
  if (/^(j a r v i s|jarvis)$/.test(value)) return { name: 'J.A.R.V.I.S.', type: 'AI · Interactive Interface', description: 'An experimental AI assistant interface with a focused, immersive visual experience.', coverImage: '/images/jarvis-interface.png', gallery: [], mark: 'J' }
  return null
}

/* Shown ONLY in local development so you can see the layout. Never shipped to production:
   real client conversations must be added (with permission) in Admin → Conversations. */
const sampleConversations = [{
  id: 'sample-1', sample: true, approved: true, client: 'Sample Client', role: 'Business owner', project: 'Website project',
  messages: [
    { from: 'client', text: 'Assalam-o-Alaikum Umar! The site just went live and it looks great.' },
    { from: 'me', text: 'Wa Alaikum Assalam! Glad you like it. Let me know if anything needs a tweak.' },
    { from: 'client', text: 'Everything works smoothly, and the team found the new dashboard easy to use.' },
    { from: 'me', text: 'Wonderful. I’m always one message away if you need anything else.' },
    { from: 'client', text: 'Thank you — I’ll definitely reach out for the next phase.' },
  ]
}, {
  id: 'sample-2', sample: true, approved: true, client: 'Another Client', role: 'Startup founder', project: 'Mobile app',
  messages: [
    { from: 'client', text: 'Hi Umar, good evening! Just wanted to say thanks for delivering on time.' },
    { from: 'me', text: 'Good evening! It was a pleasure working on it with you.' },
    { from: 'client', text: 'We’ll be recommending you to others.' },
  ]
}]


function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion()
  return <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: reduce ? 0 : .75, delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>
}

function Header({ isDark, toggle, openStudio, openPalette }) {
  const [open, setOpen] = useState(false)
  const links = [['About', '#about'], ['Teach', '#teach'], ['Services', '#services'], ['Work', '#work'], ['Estimate', '#estimate']]
  return <header className="site-header">
    <a href="#top" className="brand" aria-label="Umar Sadiq home"><span className="brand-symbol">u<span>.</span></span><span className="brand-name">UMAR SADIQ<small>SOFTWARE · DESIGN · DIGITAL</small></span></a>
    <nav className={open ? 'nav-links open' : 'nav-links'}>
      {links.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      <a href="#contact" className="nav-contact" onClick={() => setOpen(false)}>Let's talk <ArrowUpRight size={14}/></a>
    </nav>
    <div className="header-actions">
      <button className="theme-toggle cmdk-trigger" onClick={openPalette} aria-label="Open quick menu (Ctrl K)" title="Quick menu (Ctrl+K)"><Command size={17}/></button>
      <button className="theme-toggle" data-studio-trigger onClick={openStudio} aria-label="Open theme studio" title="Theme studio"><Palette size={17}/></button>
      <button className="theme-toggle" onClick={toggle} aria-label={isDark ? 'Switch to a light mood' : 'Switch to a dark mood'} title={isDark ? 'Light' : 'Dark'}>{isDark ? <Sun size={17}/> : <Moon size={17}/>}</button>
      <button className="menu-toggle" onClick={() => setOpen(v => !v)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    </div>
  </header>
}

function Portrait() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const slides = ['cut-glasses', 'cut-hand', 'cut-formal']
  const alts = ['Umar Sadiq wearing glasses', 'Umar Sadiq adjusting his glasses', 'Umar Sadiq standing in a grey waistcoat']
  const [i, setI] = useState(0)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI(v => (v + 1) % slides.length), 4300)
    return () => clearInterval(t)
  }, [reduce])
  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    const move = (e) => {
      if (!el) return
      el.style.setProperty('--px', ((e.clientX / window.innerWidth - .5) * 2).toFixed(3))
      el.style.setProperty('--py', ((e.clientY / window.innerHeight - .5) * 2).toFixed(3))
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [reduce])
  const onMove = (e) => {
    if (reduce) return
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPos({ x: ((e.clientX - r.left) / r.width - .5) * 9, y: ((e.clientY - r.top) / r.height - .5) * -8 })
  }
  return <div className="portrait-stage" ref={ref} onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}>
    <FloatingChips/><div className="portrait-glare" aria-hidden="true"/><div className="portrait-orbit orbit-one"/><div className="portrait-orbit orbit-two"/>
    <div className="portrait-sticker sticker-top"><Sparkles size={15}/> ENGINEER + INSTRUCTOR</div>
    <div className="portrait-cutout" style={{ transform: `perspective(900px) rotateY(${pos.x}deg) rotateX(${pos.y}deg)` }}>
      <div className="portrait-arch"><span className="portrait-arch-mark" aria-hidden="true">u.</span></div>
      <div className="portrait-cut-layer">
        {slides.map((n, k) => <img key={n} className={`portrait-cut ${k === i ? 'on' : ''}`} src={`/images/${n}.webp`} alt={k === i ? alts[k] : ''} aria-hidden={k !== i} width="800" height="1100" decoding="async" fetchPriority={k === 0 ? 'high' : 'auto'}/>)}
      </div>
    </div>
    <div className="portrait-dots" aria-hidden="true">{slides.map((n, k) => <i key={n} className={k === i ? 'on' : ''}/>)}</div>
    <div className="portrait-sticker sticker-bottom"><span className="status-dot"/> AVAILABLE FOR NEW PROJECTS</div>
    <div className="portrait-cross cross-a">✳</div><div className="portrait-cross cross-b">✳</div>
  </div>
}


const GUIDE_STAGES = [
  { id: 'top', label: 'The introduction', hint: 'A little about what I create.', gesture: 'wave', action: 'Explore the portfolio' },
  { id: 'about', label: 'The person behind it', hint: 'Curiosity is where good work begins.', gesture: 'curious', action: 'A little more about me' },
  { id: 'services', label: 'What I can help with', hint: 'From the first idea to the finished product.', gesture: 'present', action: 'Explore services' },
  { id: 'work', label: 'Selected work', hint: 'A few examples of digital problem-solving.', gesture: 'focus', action: 'View selected work' },
  { id: 'gallery', label: 'The gallery', hint: 'Moments, visuals and work in progress.', gesture: 'present', action: 'Browse the gallery' },
  { id: 'journey', label: 'The journey so far', hint: 'Every experience adds a new perspective.', gesture: 'reflect', action: 'Explore my journey' },
  { id: 'conversations', label: 'Client conversations', hint: 'What happens after a project is delivered.', gesture: 'focus', action: 'Read the conversations' },
  { id: 'contact', label: 'Let’s connect', hint: 'Have something in mind? Let’s talk.', gesture: 'welcome', action: 'Start a conversation' },
]

function JourneyGuide({ refreshKey }) {
  const [activeId, setActiveId] = useState('top')
  const [pos, setPos] = useState(0)
  const [presentIds, setPresentIds] = useState('')
  const count = presentIds ? presentIds.split(',').length : GUIDE_STAGES.length
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [compact, setCompact] = useState(false)
  const [portraitMode, setPortraitMode] = useState(false)
  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      setVisible(y > 280)
      const present = GUIDE_STAGES.filter(stage => document.getElementById(stage.id))
      let current = 0
      present.forEach((stage, i) => {
        if (document.getElementById(stage.id).getBoundingClientRect().top < window.innerHeight * .52) current = i
      })
      setActiveId(present[current]?.id || 'top'); setPos(current); setPresentIds(present.map(x => x.id).join(','))
    }
    const move = (e) => setPointer({
      x: Math.max(-10, Math.min(10, (e.clientX / window.innerWidth - .5) * 20)),
      y: Math.max(-8, Math.min(8, (e.clientY / window.innerHeight - .5) * -16))
    })
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    window.addEventListener('mousemove', move, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      window.removeEventListener('mousemove', move)
    }
  }, [refreshKey])
  const stage = GUIDE_STAGES.find(s => s.id === activeId) || GUIDE_STAGES[0]
  const dots = GUIDE_STAGES.filter(s => presentIds.split(',').includes(s.id))
  const jumpToStage = () => document.getElementById(stage.id)?.scrollIntoView({ behavior: 'smooth' })
  return <aside className={`journey-guide phase6-guide ${visible ? 'is-visible' : ''} ${compact ? 'is-compact' : ''} gesture-${stage.gesture}`} aria-live="polite">
    <button className="guide-character-button" onClick={() => setCompact(v => !v)} aria-label={compact ? 'Expand portfolio guide' : 'Minimize portfolio guide'} title={compact ? 'Expand guide' : 'Minimize guide'}>
      <span className="guide-character" style={{ '--look-x': `${pointer.x}deg`, '--look-y': `${pointer.y}deg` }}>
        <span className="guide-character-glow" />
        <img className="guide-character-photo guide-photo-primary" src="/images/umar-portrait.webp" alt="" width="852" height="1280" loading="lazy" decoding="async" />
        <img className={`guide-character-photo guide-photo-secondary ${portraitMode ? 'show' : ''}`} src="/images/umar-about.webp" alt="" width="854" height="1280" loading="lazy" decoding="async" />
        <span className="guide-character-shine" />
        <span className="guide-character-spark">✳</span>
        <span className="guide-character-orbit orbit-a" />
        <span className="guide-character-orbit orbit-b" />
      </span>
    </button>
    <div className="guide-message">
      <span className="guide-label">YOUR GUIDE · {String(pos + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}</span>
      <strong>{stage.label}</strong>
      <small>{stage.hint}</small>
      <button className="guide-action" onClick={jumpToStage}>{stage.action} <ArrowUpRight size={12}/></button>
    </div>
    <div className="guide-dots">{dots.map((s) => <button key={s.id} className={s.id === activeId ? 'active' : ''} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })} aria-label={`Go to ${s.label}`} />)}</div>
    <button className="guide-view-toggle" onClick={() => setPortraitMode(v => !v)} aria-label="Change character portrait" title="Change portrait"><Sparkles size={13}/></button>
  </aside>
}

function updateSeo({ title, description, image, path, type = 'website', jsonLd }) {
  const origin = window.location.origin
  const canonicalUrl = `${origin}${path || '/'}`
  const absoluteImage = image?.startsWith('http') ? image : `${origin}${image || '/images/og-share.png'}`
  document.title = title
  const setMeta = (selector, attr, value, content) => {
    let node = document.head.querySelector(selector)
    if (!node) { node = document.createElement('meta'); node.setAttribute(attr, value); document.head.appendChild(node) }
    node.setAttribute('content', content)
  }
  setMeta('meta[name="description"]', 'name', 'description', description)
  setMeta('meta[name="robots"]', 'name', 'robots', 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1')
  setMeta('meta[property="og:type"]', 'property', 'og:type', type)
  setMeta('meta[property="og:title"]', 'property', 'og:title', title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', description)
  setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
  setMeta('meta[property="og:image"]', 'property', 'og:image', absoluteImage)
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteImage)
  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
  canonical.href = canonicalUrl
  let structured = document.getElementById('portfolio-structured-data')
  if (!structured) { structured = document.createElement('script'); structured.id = 'portfolio-structured-data'; structured.type = 'application/ld+json'; document.head.appendChild(structured) }
  structured.textContent = JSON.stringify(jsonLd)
}

function App() {
  const prefs = usePreferences()
  const reduceMotion = useReducedMotion()
  const [studioOpen, setStudioOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)
  const [content, setContent] = useState({ profile: fallbackProfile, projects: fallbackProjects, services: fallbackServices, skills: fallbackSkills, blogPosts: [], testimonials: [], gallery: [], conversations: [], design: {} })
  const [contentLoaded, setContentLoaded] = useState(false)
  useTimelineDraw(contentLoaded)
  const progressRef = useRef(null)
  useHeroParallax()
  useSmoothScroll()
  useHoverEffects()
  useHeroReveal()
  useAnimatedExtras(contentLoaded)
  useScramble(contentLoaded)

  useEffect(() => {
    let active = true
    api.getContent()
      .then(remote => {
        if (!active || !remote) return
        setContent({
          profile: { ...fallbackProfile, ...(remote.profile || {}) },
          projects: Array.isArray(remote.projects) && remote.projects.length ? remote.projects : fallbackProjects,
          services: Array.isArray(remote.services) ? remote.services : fallbackServices,
          skills: Array.isArray(remote.skills) ? remote.skills : fallbackSkills,
          blogPosts: Array.isArray(remote.blogPosts) ? remote.blogPosts : [],
          testimonials: Array.isArray(remote.testimonials) ? remote.testimonials : [],
          gallery: Array.isArray(remote.gallery) ? remote.gallery : [],
          conversations: Array.isArray(remote.conversations) ? remote.conversations : [],
          design: remote.design && typeof remote.design === 'object' ? remote.design : {}
        })
      })
      .catch(error => console.warn('Portfolio API unavailable; using built-in content.', error))
      .finally(() => { if (active) setContentLoaded(true) })
    return () => { active = false }
  }, [])

  const profile = content.profile
  useEffect(() => {
    // Admin → Design Studio sets the site's *default* accent/radius. Visitors can still pick any mood/style.
    const root = document.documentElement
    const allowed = ['#ff7655', '#6c63ff', '#168b83', '#d18a22', '#d94f83']
    const accent = content.design?.accent
    if (allowed.includes(accent)) root.style.setProperty('--cms-accent', accent); else root.style.removeProperty('--cms-accent')
    root.style.setProperty('--cms-radius', content.design?.radius === 'sharp' ? '2px' : content.design?.radius === 'rounded' ? '18px' : '8px')
  }, [content.design])
  useEffect(() => { if (!contentLoaded) return; api.trackEvent({ eventType: 'page_view', path: window.location.pathname }).catch(() => {}) }, [contentLoaded])
  const normalizedProjectEntries = content.projects.filter(item => !['Draft', 'Hidden'].includes(item.status)).map(item => {
    const screenshot = screenshotProjectFor(item.name)
    if (screenshot?.remove) return null
    return { ...item, ...(screenshot || {}) }
  }).filter(Boolean)
  const projectSource = [...normalizedProjectEntries]
  fallbackProjects.forEach(fallback => {
    const key = fallback.name.toLowerCase()
    if (!projectSource.some(item => String(item.name || '').toLowerCase() === key)) projectSource.push(fallback)
  })
  const projects = projectSource.map((item, i) => ({
    ...item,
    id: String(item.id ?? i + 1),
    displayId: String(item.id ?? i + 1).replace(/[^a-zA-Z0-9]/g, '').slice(-4).padStart(2, '0'),
    name: item.name || 'Untitled project',
    type: item.type || item.category || 'Selected project',
    desc: item.description || item.desc || '',
    tone: item.tone || projectTones[i % projectTones.length],
    mark: item.mark || projectMarks[i % projectMarks.length],
    coverImage: item.coverImage || null,
    preview: item.coverImage || null,
    previewVideo: item.previewVideo || null,
    previewGif: item.previewGif || null,
    slug: item.slug || `${(item.name || 'project').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(item.id ?? i + 1).slice(-5)}`,
    technologies: Array.isArray(item.technologies) ? item.technologies : [],
    gallery: Array.isArray(item.gallery) ? item.gallery : []
  }))
  const projectSlug = window.location.pathname.match(/^\/projects\/([^/]+)/)?.[1]
  const [projectQuery, setProjectQuery] = useState('')
  const [projectCategory, setProjectCategory] = useState('All')
  const [projectSort, setProjectSort] = useState('featured')
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))]
  const visibleProjects = useMemo(() => {
    const q = projectQuery.trim().toLowerCase()
    return projects.filter(p => (projectCategory === 'All' || p.category === projectCategory) && (!q || [p.name, p.category, p.description, ...(p.technologies || [])].join(' ').toLowerCase().includes(q)))
      .sort((a, b) => projectSort === 'az' ? a.name.localeCompare(b.name) : projectSort === 'za' ? b.name.localeCompare(a.name) : Number(!!b.featured) - Number(!!a.featured))
  }, [projects, projectQuery, projectCategory, projectSort])
  const selectedProject = projects.find(p => p.slug === projectSlug || String(p.id) === projectSlug)

  useEffect(() => {
    const person = {
      '@context': 'https://schema.org', '@type': 'Person', name: profile.name || 'Umar Sadiq',
      jobTitle: profile.role || 'Software Engineer', description: profile.intro || 'Software engineer and digital creative.',
      email: profile.email ? `mailto:${profile.email}` : undefined,
      image: `${window.location.origin}/images/umar-portrait.webp`,
      sameAs: ['https://www.linkedin.com/in/umar-sadiq-a6009122b/'],
      url: window.location.origin
    }
    if (projectSlug && selectedProject) {
      const description = selectedProject.description || `${selectedProject.name} — project case study by ${profile.name || 'Umar Sadiq'}.`
      updateSeo({
        title: `${selectedProject.name} — Project Case Study | ${profile.name || 'Umar Sadiq'}`,
        description: description.slice(0, 155), image: selectedProject.coverImage || '/images/umar-portrait.webp',
        path: window.location.pathname, type: 'article',
        jsonLd: { '@context': 'https://schema.org', '@type': 'CreativeWork', name: selectedProject.name, description, creator: person, url: `${window.location.origin}${window.location.pathname}`, image: selectedProject.coverImage || `${window.location.origin}/images/umar-portrait.webp`, keywords: (selectedProject.technologies || []).join(', ') }
      })
    } else {
      updateSeo({
        title: `${profile.name || 'Umar Sadiq'} — Software Engineer & CS Instructor`,
        description: (profile.intro || 'Software Engineer and CS instructor building real-world digital products and teaching programming.').slice(0, 155),
        path: '/', jsonLd: [person, { '@context': 'https://schema.org', '@type': 'WebSite', name: `${profile.name || 'Umar Sadiq'} Portfolio`, url: window.location.origin }]
      })
    }
  }, [profile.name, profile.role, profile.email, profile.intro, projectSlug, selectedProject])
  const baseServices = content.services.filter(item => !['Draft', 'Hidden'].includes(item.status)).map((item, i) => ({
    title: item.name || item.title,
    desc: item.description || item.desc || '',
    icon: serviceIcons[i % serviceIcons.length],
    tags: serviceTags[i % serviceTags.length]
  }))
  // Python is always offered. It sits just after the three main services, in the "Also offered" row.
  if (!baseServices.some(s => /python/i.test(s.title))) baseServices.splice(Math.min(3, baseServices.length), 0, { title: 'Python, Automation & AI', desc: 'Python back ends, scripts, data tools and AI integrations that remove repetitive work.', icon: Bot, tags: ['Python', 'Automation', 'AI'] })
  const services = baseServices.map((s, i) => ({ ...s, n: String(i + 1).padStart(2, '0') }))
  const skills = (() => {
    if (/python/i.test(content.skills.join(' '))) return content.skills
    const at = content.skills.findIndex(s => /php/i.test(s))
    const list = [...content.skills]; list.splice(at >= 0 ? at + 1 : list.length, 0, 'Python'); return list
  })()

  const galleryItems = useMemo(() => {
    // Preserve the complete original personal gallery. These are the 25
    // personal image assets shipped with Phase 19; project screenshots are
    // shown separately below and never replace these photographs.
    const personalPhotos = [
      ['g-studio-desk', 'Behind the desk', 'At work'],
      ['cut-hand', 'A moment at work', 'At work'],
      ['g-suit-3', 'Formal portrait', 'Style'],
      ['cut-glasses', 'Thinking it through', 'Portraits'],
      ['g-garden-glasses', 'Out in the open', 'Outdoors'],
      ['g-studio-work', 'Deep in the work', 'At work'],
      ['cut-portrait', 'Portrait', 'Portraits'],
      ['g-studio-corner', 'Studio corner', 'At work'],
      ['g-studio-1', 'Inside the studio', 'At work'],
      ['umar-portrait', 'Portrait', 'Portraits'],
      ['g-flowers', 'A quieter moment', 'Lifestyle'],
      ['cut-walker', 'On the move', 'Outdoors'],
      ['g-suit-1', 'Dressed for the room', 'Style'],
      ['g-hand-glasses', 'The thinking pose', 'Portraits'],
      ['g-casual-green', 'Casual look', 'Style'],
      ['g-studio-ceo', 'At work', 'At work'],
      ['g-studio-3', 'Studio workspace', 'At work'],
      ['cut-formal', 'Formal look', 'Style'],
      ['g-winter', 'Winter outdoors', 'Outdoors'],
      ['g-white-garden', 'Garden portrait', 'Outdoors'],
      ['g-podcast-chair', 'Podcast corner', 'Behind the scenes'],
      ['umar-about2', 'Personal portrait', 'Portraits'],
      ['studio-band', 'Studio', 'At work'],
      ['g-suit-2', 'Formal portrait', 'Style'],
      ['umar-about', 'About me', 'Portraits'],
    ].map(([file, title, category], i) => ({
      id: `personal-${i + 1}`, src: `/images/${file}.webp`, title, caption: 'A personal photo from the original portfolio gallery.', category,
    }))

    const blockedProjectLabel = /^(?:sc|cl|royasocietes pms|royal societes pms|royallandmark|royal ?landmark(?: property management(?: l l c)?)?)(?:\b.*)?$/i
    const own = (content.gallery || [])
      .filter(g => g && g.src && g.status !== 'Hidden' && g.status !== 'Draft'
        && !(g.category === 'Projects' && blockedProjectLabel.test(String(g.title || '').toLowerCase().replace(/[._-]+/g, ' ').replace(/\s+/g, ' ').trim())))
      .map((g, i) => ({ id: `g-${g.id ?? i}`, src: g.src, title: g.title || 'Gallery photo', caption: g.caption || '', category: g.category || 'Gallery' }))

    const screenshotGallery = [
      { id: 'shot-dailycarlift-home', src: '/images/dailycarlift-home.png', title: 'DailyCarlift · Homepage', caption: 'Daily car-lift service between Sharjah and Dubai.', category: 'DailyCarlift' },
      { id: 'shot-dailycarlift-service', src: '/images/dailycarlift-service.png', title: 'DailyCarlift · Service page', caption: 'A closer view of the transport service and its offer.', category: 'DailyCarlift' },
      { id: 'shot-adson-dashboard', src: '/images/adson-dashboard.png', title: 'Adson Client Hunter · Dashboard', caption: 'The client operations dashboard.', category: 'Adson Client Hunter' },
      { id: 'shot-adson-approvals', src: '/images/adson-approvals.png', title: 'Adson Client Hunter · Approvals', caption: 'Approval workflow inside the same product.', category: 'Adson Client Hunter' },
      { id: 'shot-jarvis', src: '/images/jarvis-interface.png', title: 'J.A.R.V.I.S. · Interface', caption: 'An immersive assistant interface concept.', category: 'J.A.R.V.I.S.' },
      { id: 'shot-royal-landmark', src: '/images/royal-landmark-launch.png', title: 'Royal Landmark Property Management L.L.C. · Website launch', caption: 'Launch screen for Royal Landmark Property Management L.L.C.', category: 'Royal Landmark Property Management L.L.C.' },
      { id: 'shot-sell-cars', src: '/images/sell-cars-marketplace.png', title: 'SellCarsOnCars · Marketplace', caption: 'Vehicle discovery and search experience.', category: 'SellCarsOnCars' },
    ]

    const fromProjects = projects.flatMap(p => [...new Set([p.coverImage, ...p.gallery].filter(Boolean))]
      .map((src, i) => ({ id: `p-${p.id}-${i}`, src, title: p.name, caption: p.type, category: p.name })))

    // Keep every original personal photograph, then add the supplied project
    // screenshots. Deduplicate only identical image paths.
    const seen = new Set()
    return [...personalPhotos, ...own, ...screenshotGallery, ...fromProjects]
      .filter(item => { if (seen.has(item.src)) return false; seen.add(item.src); return true })
  }, [content.gallery, projects])

  const approved = (content.conversations || []).filter(c => c && c.approved && Array.isArray(c.messages) && c.messages.length)
  const conversations = approved.length ? approved : (import.meta.env.DEV ? sampleConversations : [])
  const publishedPosts = content.blogPosts.filter(post => post.status === 'Published')
  const approvedTestimonials = content.testimonials.filter(item => item.approved)
  const order = ['about', 'teach', 'services', 'process', 'estimate', 'work', galleryItems.length && 'gallery', 'skills', 'journey', conversations.length && 'conversations', publishedPosts.length && 'journal', approvedTestimonials.length && 'testimonials', 'faq', 'contact'].filter(Boolean)
  const num = (id) => String(order.indexOf(id) + 1).padStart(2, '0')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progressRef.current, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .25 } })
      gsap.utils.toArray('.section-kicker').forEach((el) => gsap.fromTo(el, { x: -18, opacity: .3 }, { x: 0, opacity: 1, duration: .7, scrollTrigger: { trigger: el, start: 'top 88%' } }))

      // Give the full Selected Work section a deliberate, coordinated entrance.
      const work = document.querySelector('.work-section')
      if (work && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const heading = work.querySelector('.section-heading-row')
        const grid = work.querySelector('.projects-grid')
        if (heading) gsap.fromTo(heading.children, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: heading, start: 'top 82%', once: true } })
        if (grid) gsap.fromTo(grid.querySelectorAll('.project-card'), { y: 58, opacity: 0, scale: .965, rotateX: 5, transformPerspective: 900 }, { y: 0, opacity: 1, scale: 1, rotateX: 0, duration: .85, stagger: .11, ease: 'power3.out', scrollTrigger: { trigger: grid, start: 'top 84%', once: true } })
        const controls = work.querySelectorAll('.project-controls, .project-filters, .work-note')
        if (controls.length) gsap.fromTo(controls, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .55, stagger: .1, ease: 'power2.out', scrollTrigger: { trigger: controls[0], start: 'top 92%', once: true } })
      }
    })
    return () => ctx.revert()
  }, [contentLoaded])

  if (projectSlug) {
    if (!contentLoaded) return <div className="project-detail-loading">Loading project…</div>
    if (!selectedProject) return <div className="project-detail-page"><a className="project-back-link" href="/#work">← Back to selected work</a><h1>Project not found</h1><p>This project may be unpublished or its link may have changed.</p></div>
    return <><div className="ambient" aria-hidden="true"><i/><i/><i/></div><ProjectDetail project={selectedProject} profile={profile}/><ThemeStudio prefs={prefs} open={studioOpen} setOpen={setStudioOpen}/></>
  }

  return <div className="app-shell">
    <div className="ambient" aria-hidden="true"><i/><i/><i/></div>
    <Preloader/><Cursor/><AmbientFX/>
    <JourneyGuide refreshKey={order.join()}/>
    <WalkingMe refreshKey={order.join()}/>
    <ThemeStudio prefs={prefs} open={studioOpen} setOpen={setStudioOpen}/>
    <div className="scroll-progress"><span ref={progressRef}/></div>
    <Header isDark={prefs.isDark} toggle={prefs.quickToggle} openStudio={() => setStudioOpen(v => !v)} openPalette={() => setPaletteOpen(true)}/>
    <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} toggleTheme={prefs.quickToggle} isDark={prefs.isDark}/>
    <main id="top">
      <section className="hero section-pad">
        <div className="hero-noise"/>
        <div className="hero-copy">
          <Greeting/>
          <AvailabilityBadge profile={profile}/>
          <div className="eyebrow"><span className="eyebrow-line"/> {profile.role.toUpperCase()} <span className="eyebrow-year">{profile.location}</span></div>
          <h1 className="hero-title"><span className="ln"><span className="ln-in">Ideas into</span></span><span className="ln"><span className="ln-in"><span className="headline-outline">digital</span> <span className="headline-italic">reality<span className="headline-dot">.</span></span></span></span></h1>
          <RoleTyper/>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions"><a className="button-primary" href="#contact">Hire me for a project <MoveUpRight size={17}/></a><a className="text-link" href="#work">Explore my work <ArrowUpRight size={16}/></a><a className="text-link" href="#teach">Learn with me <ArrowUpRight size={16}/></a><CvLink/></div>
          <HeroTerminal profile={profile} skills={skills} projects={projects}/>
          <div className="hero-meta"><span>SCROLL TO EXPLORE <ArrowDown size={13}/></span><span className="hero-meta-right">DEVELOPMENT / DESIGN / GROWTH</span></div>
        </div>
        <div className="hero-visual"><Portrait/><div className="hero-side-note">CREATING WITH<br/>CURIOSITY <Asterisk size={17}/></div></div>
        
      </section>

      <Ribbon/>
      <section id="about" className="about-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('about')} / A LITTLE ABOUT ME</span><span className="section-side">THE PERSON BEHIND THE PIXELS</span></div>
        <div className="about-grid">
          <div><Reveal><h2>I build things<br/>that <em>move</em><br/>business forward<span className="accent-dot">.</span></h2></Reveal><AboutPhoto/></div>
          <Reveal delay={.12}><div className="about-copy"><p className="large-copy">{profile.intro}</p><p>My work spans websites, mobile applications, business systems, creative design and digital growth. I enjoy understanding the real problem first — then building the right solution around it.</p><div className="about-facts"><div><strong>BS CS</strong><small>EDUCATION</small></div><div><strong>Multi-disciplinary</strong><small>PROFESSIONAL FOCUS</small></div><div><strong>Pakistan + UAE</strong><small>PROJECT EXPERIENCE</small></div></div><a className="underlined-link" href="https://www.linkedin.com/in/umar-sadiq-a6009122b/" target="_blank" rel="noreferrer">Connect on LinkedIn <ArrowUpRight size={15}/></a></div></Reveal>
        </div>
      </section>

      <Teach n={num('teach')} onCoach={() => { setPrefill({ service: 'Other', budget: '', message: 'Hi Umar, I’d like to ask about coaching / training.\nTopic I’d like to learn: \nMy current level: \n\nA little more: ', ts: Date.now() }); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 60) }}/>

      <section id="services" className="services-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('services')} / WHAT I DO</span><span className="section-side">THOUGHTFUL WORK. REAL-WORLD IMPACT.</span></div>
        <div className="section-heading-row"><h2>Skills with<br/><em>purpose.</em></h2><p>One partner for the digital pieces that help a business work better, look sharper and grow smarter.</p></div>
        <div className="service-grid">{services.slice(0, 3).map((s, i) => { const Icon = s.icon; return <Reveal key={s.n} delay={i * .04}><article className="service-card"><div className="service-card-top"><span>{s.n} / {String(Math.min(3, services.length)).padStart(2, '0')}</span><Icon size={22}/></div><h3>{s.title}</h3><p>{s.desc}</p><div className="tag-row">{s.tags.map(t => <span key={t}>{t}</span>)}</div><ArrowUpRight className="service-arrow" size={19}/></article></Reveal> })}</div>
        <AlsoOffered items={services.slice(3)}/>
      </section>

      <HowIWork n={num('process')}/>

      <Estimator n={num('estimate')} onDone={(d) => { setPrefill({ ...d, ts: Date.now() }); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 60) }}/>

      <StudioBand/>

      <section id="work" className="work-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('work')} / SELECTED WORK</span><span className="section-side">A FEW WORLDS I'VE HELPED BUILD</span></div>
        <div className="section-heading-row"><h2>Made to<br/><em>make a mark.</em></h2><p>A selection of digital products and experiences across property, mobility, automotive and business operations.</p></div>
        <ProjectShowcase projects={projects}/>
        <div className="work-all-label" id="work-all">ALL PROJECTS · SEARCH &amp; FILTER</div>
        <div className="project-controls">
          <label className="project-search"><Search size={16}/><input value={projectQuery} onChange={e => setProjectQuery(e.target.value)} placeholder="Search projects, services or technologies…" aria-label="Search projects"/></label>
          <select value={projectSort} onChange={e => setProjectSort(e.target.value)} aria-label="Sort projects"><option value="featured">Featured first</option><option value="az">Name: A to Z</option><option value="za">Name: Z to A</option></select>
        </div>
        <div className="project-filters" aria-label="Filter projects by category">{categories.map(category => <button key={category} className={projectCategory === category ? 'active' : ''} onClick={() => setProjectCategory(category)}>{category}</button>)}</div>
        <div className="projects-grid">{visibleProjects.map((p, i) => <motion.a
          className={`project-card ${p.tone} project-card-link`} href={`/projects/${p.slug}`} key={p.id}
          data-cursor-label={p.previewVideo || p.previewGif ? 'PLAY' : 'VIEW'}
          aria-label={`View ${p.name} case study`}
          initial={reduceMotion ? false : { opacity: 0, y: 38, rotate: i % 2 ? 1.2 : -1.2, scale: .975 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: .16 }}
          transition={{ duration: .72, delay: Math.min(i % 3, 2) * .09, ease: [.22, 1, .36, 1] }}
          whileHover={reduceMotion ? undefined : { y: -8, scale: 1.012 }}
          onMouseEnter={e=>e.currentTarget.querySelector('video')?.play().catch(()=>{})}
          onMouseLeave={e=>{const v=e.currentTarget.querySelector('video');if(v){v.pause();v.currentTime=0}}}
          onFocus={e=>e.currentTarget.querySelector('video')?.play().catch(()=>{})}
          onBlur={e=>{const v=e.currentTarget.querySelector('video');if(v){v.pause();v.currentTime=0}}}
        ><div className="project-art">{p.preview ? <><img className="project-cover-thumb" src={p.preview} alt={`${p.name} cover`} loading="lazy" decoding="async"/>{p.previewVideo&&<video className="project-hover-video" src={p.previewVideo} muted loop playsInline preload="none" aria-label={`${p.name} preview`}/>}{p.previewGif&&<img className="project-hover-gif" src={p.previewGif} alt="" loading="lazy" decoding="async"/>}</> : <><div className="project-art-grid"/><div className="project-monogram">{p.mark}</div></>}<span className="project-number">PROJECT / {p.displayId}</span><div className="project-art-caption">{p.featured ? 'FEATURED PROJECT' : 'DIGITAL EXPERIENCE'}<br/>CASE STUDY</div><span className="project-asterisk">✳</span></div><div className="project-info"><div><span className="project-type">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p></div><span className="project-link"><ArrowUpRight size={19}/></span></div></motion.a>)}</div>
        {visibleProjects.length === 0 && <div className="projects-empty">No projects match those filters. Try another search or category.</div>}
        <p className="work-note"><Sparkles size={15}/> Select a project to explore its case study, gallery and technologies.</p>
      </section>

      <StatementBand/>

      {galleryItems.length > 0 && <section id="gallery" className="gallery-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('gallery')} / THE GALLERY</span><span className="section-side">MOMENTS, VISUALS &amp; WORK IN PROGRESS</span></div>
        <div className="section-heading-row"><h2>A closer<br/><em>look.</em></h2><p>Real screens from the projects shown above. Each image is grouped with its matching product; tap any screen to view it full size.</p></div>
        <Gallery items={galleryItems}/>
      </section>}

      <section id="skills" className="skills-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('skills')} / THE TOOLKIT</span><span className="section-side">TOOLS ARE ONLY AS GOOD AS THE THINKING</span></div>
        <div className="skills-layout"><h2>Curious by<br/>nature<span className="accent-dot">.</span><br/><em>Technical</em><br/>by craft.</h2><div className="skills-content"><p>I work across the stack — from interface and experience to application logic, data and deployment.</p><SkillOrbit skills={skills}/><SkillGroups skills={skills}/><div className="skills-foot"><Globe2 size={16}/> ALWAYS LEARNING. ALWAYS BUILDING.</div></div></div>
      </section>

      <section id="journey" className="journey-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('journey')} / THE JOURNEY</span><span className="section-side">A PROFESSIONAL PATH, STILL IN MOTION</span></div>
        <div className="journey-heading"><h2>Built through<br/><em>experience.</em></h2><p>Every role, collaboration and project adds another perspective. These are some of the places that have shaped my professional journey.</p></div>
        <div className="timeline"><span className="timeline-line" aria-hidden="true"/>
          {[['Education','BS Information Technology','Building the technical foundation for a career in software and digital work.'],['Aglow Graphics','Professional experience','Creative and visual work as part of a growing digital skill set.'],['Adson Digitals','Professional experience','Working across software, digital solutions and client-focused projects.'],['Info Tech','Professional experience','Further experience in technology and practical digital delivery.']].map((item, i) => <Reveal key={item[0]}><div className="timeline-item"><div className="timeline-marker">{String(i + 1).padStart(2, '0')}</div><div className="timeline-main"><span>{item[0]}</span><h3>{item[1]}</h3><p>{item[2]}</p></div><span className="timeline-date"/></div></Reveal>)}
        </div>
      </section>

      {conversations.length > 0 && <section id="conversations" className="conversations-section section-pad">
        <div className="section-top"><span className="section-kicker">{num('conversations')} / AFTER DELIVERY</span><span className="section-side">WHAT CLIENTS SAY WHEN THE PROJECT IS DONE</span></div>
        <div className="section-heading-row"><h2>Words that<br/><em>stay with me.</em></h2><p>Real messages from clients once their project went live, shared with their permission.</p></div>
        <Conversations conversations={conversations}/>
      </section>}

      {content.blogPosts.filter(post => post.status === 'Published').length > 0 && <section id="journal" className="phase10-section section-pad"><div className="section-top"><span className="section-kicker">{num('journal')} / NOTES & IDEAS</span><span className="section-side">THINKING OUT LOUD</span></div><div className="section-heading-row"><h2>Latest<br/><em>writing.</em></h2><p>Practical notes on software, design and digital work.</p></div><div className="phase10-card-grid">{content.blogPosts.filter(post => post.status === 'Published').slice(0,3).map(post => <article className="phase10-content-card" key={post.id}><span>{post.category || 'ARTICLE'} · {post.date || ''}</span><h3>{post.title}</h3><p>{post.excerpt}</p></article>)}</div></section>}
      {content.testimonials.filter(item => item.approved).length > 0 && <section className="phase10-section phase10-testimonials section-pad"><div className="section-top"><span className="section-kicker">{num('testimonials')} / KIND WORDS</span><span className="section-side">CLIENT FEEDBACK</span></div><div className="phase10-card-grid">{content.testimonials.filter(item => item.approved).slice(0,3).map(item => <blockquote className="phase10-content-card" key={item.id}><p>“{item.quote}”</p><strong>{item.author}</strong><span>{item.role}</span></blockquote>)}</div></section>}
      <Faq n={num('faq')}/>
      <section id="contact" className="contact-section section-pad">
        <div className="contact-orb orb-one"/><div className="contact-orb orb-two"/>
        <img className="contact-figure" src="/images/cut-hand.webp" alt="" aria-hidden="true" width="814" height="1100" loading="lazy" decoding="async"/>
        <div className="section-top"><span className="section-kicker">{num('contact')} / YOUR TURN</span><span className="section-side">HAVE AN IDEA? LET'S MAKE IT REAL.</span></div>
        <div className="contact-content"><span className="contact-overline">{availabilityInfo(profile)?.key === 'busy' ? 'CURRENTLY FULLY BOOKED' : 'OPEN TO NEW PROJECTS'}</span><h2>Let's make<br/><em>something</em><br/>matter<span>.</span></h2><ContactExtras/><InquiryForm prefill={prefill} /><div className="contact-bottom"><a href={`mailto:${profile.email}`}><Mail size={16}/> {profile.email}</a><a href="https://www.linkedin.com/in/umar-sadiq-a6009122b/" target="_blank" rel="noreferrer"><Linkedin size={16}/> LinkedIn <ArrowUpRight size={13}/></a></div></div>
      </section>
    </main>
    <PortfolioExtras profile={profile} onCoachingSelect={(message) => { setPrefill({ service: 'Other', budget: '', message, ts: Date.now() }); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 60) }}/>
    <MegaName/>
    <footer className="site-footer"><a href="#top" className="footer-brand">U<span>.</span>S</a><span>DESIGNED WITH INTENT · BUILT WITH CURIOSITY</span><span>© {new Date().getFullYear()} UMAR SADIQ</span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>
  </div>
}


function InquiryForm({ prefill }) {
  const [form,setForm]=useState({name:'',email:'',phone:'',service:'',budget:'',message:'',website:''})
  const [state,setState]=useState('idle'); const [error,setError]=useState('')
  useEffect(()=>{ if(prefill) setForm(f=>({...f,service:prefill.service||f.service,budget:prefill.budget||'',message:prefill.message||f.message})) },[prefill])
  const change=e=>setForm(f=>({...f,[e.target.name]:e.target.value}))
  const submit=async e=>{e.preventDefault();setState('sending');setError('');try{await api.submitInquiry(form);setState('sent');setForm({name:'',email:'',phone:'',service:'',budget:'',message:'',website:''})}catch(err){setState('idle');setError(err.message||'Unable to send your inquiry. Please try again.')}}
  if(state==='sent')return <div className="inquiry-success" role="status"><strong>Thank you — your message is on its way.</strong><span>Your inquiry has been received. I’ll review the details and get back to you.</span><button type="button" onClick={()=>setState('idle')}>Send another inquiry</button></div>
  return <form className="inquiry-form" onSubmit={submit}>
    <div className="inquiry-fields"><label>Your name<input name="name" value={form.name} onChange={change} minLength="2" maxLength="100" autoComplete="name" required placeholder="Name"/></label><label>Email address<input type="email" name="email" value={form.email} onChange={change} maxLength="160" autoComplete="email" required placeholder="you@example.com"/></label><label>Phone / WhatsApp <span>(optional)</span><input name="phone" value={form.phone} onChange={change} maxLength="50" autoComplete="tel" placeholder="+92…"/></label><label>What do you need? <span>(optional)</span><select name="service" value={form.service} onChange={change}><option value="">Choose a service</option>{['Website / Web App','Mobile Application','CRM / ERP / Business System','UI/UX or Graphic Design','Digital Marketing / Ads','Python / Automation / AI','SEO','Other'].map(x=><option key={x}>{x}</option>)}</select></label><label>Estimated budget <span>(optional)</span><select name="budget" value={form.budget} onChange={change}><option value="">Prefer to discuss</option>{['Under $250','$250–$500','$500–$1,000','$1,000–$3,000','$3,000+'].map(x=><option key={x}>{x}</option>)}</select></label><label className="inquiry-message">Tell me about your project<textarea name="message" value={form.message} onChange={change} minLength="10" maxLength="5000" required rows="4" placeholder="A few details about your goals, timeline or requirements…"/></label></div>
    <input className="inquiry-honeypot" name="website" value={form.website} onChange={change} tabIndex="-1" autoComplete="off" aria-hidden="true"/><button className="contact-button" type="submit" disabled={state==='sending'}>{state==='sending'?'Sending…':'Send project inquiry'} <ArrowUpRight size={20}/></button>{error&&<p className="inquiry-error" role="alert">{error}</p>}
  </form>
}


function ProjectDetail({ project, profile }) {
  const gallery = [...new Set([project.coverImage, ...(project.gallery || [])].filter(Boolean))]
  return <div className="project-detail-page">
    <header className="project-detail-nav"><a href="/#top" className="project-detail-brand">U<span>.</span> UMAR SADIQ</a><a href="/#work" className="project-back-link">← All projects</a></header>
    <main className="project-detail-main">
      <div className="project-detail-kicker">CASE STUDY / {project.category || 'SELECTED WORK'}</div>
      <h1>{project.name}</h1>
      <p className="project-detail-lead">{project.description || 'A selected digital project.'}</p>
      {project.coverImage ? <div className="project-detail-device"><Tilt max={7}><Laptop src={project.coverImage} alt={`${project.name} project cover`}/></Tilt></div> : <div className={`project-detail-cover project-detail-placeholder ${project.tone || 'peach'}`}><span>{project.name.split(/\s+/).map(x => x[0]).slice(0, 3).join('').toUpperCase()}</span></div>}
      {[['ROLE / CONTRIBUTION', project.role], ['YEAR', project.year], ['STATUS', project.status]].filter(x => x[1]).length > 0 && <div className="project-detail-facts">{[['ROLE / CONTRIBUTION', project.role], ['YEAR', project.year], ['STATUS', project.status]].filter(x => x[1]).map(([k, v]) => <div key={k}><small>{k}</small><strong>{v}</strong></div>)}</div>}
      {[['THE OVERVIEW', 'What it is', project.overview || project.description], ['THE CHALLENGE', 'What needed solving', project.challenge], ['THE APPROACH', 'How it was built', project.solution], ['THE OUTCOME', 'What changed', project.results]].filter(x => x[2]).length > 0 && <div className="project-detail-copy-grid">{[['THE OVERVIEW', 'What it is', project.overview || project.description], ['THE CHALLENGE', 'What needed solving', project.challenge], ['THE APPROACH', 'How it was built', project.solution], ['THE OUTCOME', 'What changed', project.results]].filter(x => x[2]).map(([k, h, t]) => <section key={k}><span>{k}</span><h2>{h}</h2><p>{t}</p></section>)}</div>}
      {project.technologies?.length > 0 && <section className="project-detail-tech"><span>TOOLS & TECHNOLOGIES</span><div>{project.technologies.map(t => <b key={t}>{t}</b>)}</div></section>}
      {gallery.length > 0 && <section className="project-detail-gallery"><span>PROJECT GALLERY</span><div className="project-shots">{gallery.map((src, i) => <Shot key={`${src}-${i}`} src={src} alt={`${project.name} screenshot ${i + 1}`}/>)}</div></section>}
      {project.projectUrl && <a className="project-live-link" href={project.projectUrl} target="_blank" rel="noreferrer">Visit live project <ArrowUpRight size={18}/></a>}
      <a className="project-back-bottom" href="/#work">← Explore more projects</a>
    </main>
    <footer className="project-detail-footer">© {new Date().getFullYear()} {profile.name || 'Umar Sadiq'} · SOFTWARE / DESIGN / DIGITAL</footer>
  </div>
}

export default App
