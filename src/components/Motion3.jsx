import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* ------------------------------------------------------------------ */
/* 1. Ambient layer: a living particle network + a gradient top bar.   */
/*    Particles drift, link up when close, and are pulled by the mouse. */
/* ------------------------------------------------------------------ */
export function AmbientFX() {
  const canvasRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    if (reduced()) return
    const bar = barRef.current
    const tween = bar && gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .2 } })
    const stopBar = () => { tween?.scrollTrigger?.kill(); tween?.kill() }

    const canvas = canvasRef.current
    if (!canvas) return stopBar
    const ctx = canvas.getContext('2d')
    const coarse = !finePointer()
    const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2)
    const GLYPHS = '0101010101{}[]<>/;=+*#$&'.split('')
    const CW = coarse ? 30 : 22, TRAIL = coarse ? 6 : 9, LH = 16
    const LINK2 = coarse ? 14400 : 22500
    let w = 0, h = 0, raf = 0, running = true, frame = 0, last = 0, lastY = window.scrollY, boost = 0
    let rgb = '255,118,85', head = '255,118,85'
    let nodes = [], cols = [], packets = []
    const mouse = { x: -9999, y: -9999 }
    const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

    const readColors = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      const m = /^#([0-9a-f]{6})$/i.exec(raw)
      if (m) { const n = parseInt(m[1], 16); rgb = `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}` }
      const bg = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body).backgroundColor)
      const lum = bg ? (+bg[1] * .299 + +bg[2] * .587 + +bg[3] * .114) : 255
      head = lum < 120 ? '255,255,255' : rgb
    }
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.max(16, Math.min(coarse ? 28 : 56, Math.floor(w / 26)))
      nodes = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, r: Math.random() * 1.6 + .8 }))
      cols = Array.from({ length: Math.ceil(w / CW) }, (_, i) => ({
        x: i * CW + CW / 2, y: -Math.random() * h, speed: 50 + Math.random() * 90,
        on: Math.random() < .5, chars: Array.from({ length: TRAIL }, rnd)
      }))
      packets = []
    }
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const onVis = () => { running = !document.hidden; if (running) { last = performance.now(); raf = requestAnimationFrame(loop) } }

    const loop = (t) => {
      if (!running) return
      raf = requestAnimationFrame(loop)
      const dt = Math.min(.05, (t - last) / 1000 || .016); last = t
      frame++
      if (coarse && frame % 2) return
      if (frame % 150 === 1) readColors()
      const sy = window.scrollY
      boost = boost * .9 + Math.min(6, Math.abs(sy - lastY) / 12); lastY = sy
      const mult = 1 + boost * .5
      ctx.clearRect(0, 0, w, h)

      // glow that follows the mouse
      if (mouse.x > 0) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220)
        g.addColorStop(0, `rgba(${rgb},.16)`); g.addColorStop(1, `rgba(${rgb},0)`)
        ctx.fillStyle = g; ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440)
      }

      // falling code rain (faint in the middle so text stays readable, stronger at the edges)
      ctx.font = `${coarse ? 11 : 12}px "DM Mono", monospace`; ctx.textAlign = 'center'
      for (const c of cols) {
        if (!c.on) continue
        c.y += c.speed * mult * dt * (coarse ? 2 : 1)
        if (c.y - TRAIL * LH > h) { c.y = -Math.random() * 240; c.speed = 50 + Math.random() * 90; if (Math.random() < .25) c.on = false; else if (Math.random() < .1) c.on = true }
        const edge = Math.min(1, Math.abs(c.x - w / 2) / (w / 2) * 1.3), k = .22 + .78 * edge
        for (let j = 0; j < TRAIL; j++) {
          const yy = c.y - j * LH
          if (yy < -12 || yy > h + 12) continue
          if (Math.random() < .012) c.chars[j] = rnd()
          const a = (1 - j / TRAIL) * (j === 0 ? .6 : .32) * k
          ctx.fillStyle = `rgba(${j === 0 ? head : rgb},${a.toFixed(3)})`
          ctx.fillText(c.chars[j], c.x, yy)
        }
      }
      // wake up a few dormant columns now and then
      if (frame % 40 === 0) { const c = cols[(Math.random() * cols.length) | 0]; if (c && !c.on) { c.on = true; c.y = -20 } }

      // node network
      const pairs = []
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        const dx = mouse.x - a.x, dy = mouse.y - a.y, d2 = dx * dx + dy * dy
        if (d2 < 28000) { a.vx += dx * .00027; a.vy += dy * .00027 }
        a.vx *= .995; a.vy *= .995
        a.x += a.vx * mult; a.y += a.vy * mult
        if (a.x < -10) a.x = w + 10; else if (a.x > w + 10) a.x = -10
        if (a.y < -10) a.y = h + 10; else if (a.y > h + 10) a.y = -10
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], x = a.x - b.x, y = a.y - b.y, d = x * x + y * y
          if (d < LINK2) {
            ctx.strokeStyle = `rgba(${rgb},${((1 - d / LINK2) * .24).toFixed(3)})`
            ctx.lineWidth = .8
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
            if (pairs.length < 30) pairs.push([a, b])
          }
        }
      }
      for (const a of nodes) {
        ctx.fillStyle = `rgba(${rgb},.18)`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 3, 0, 6.2832); ctx.fill()
        ctx.fillStyle = `rgba(${rgb},.85)`; ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill()
      }

      // little data packets travelling along the links
      if (packets.length < 10 && pairs.length && Math.random() < .06) { const [a, b] = pairs[(Math.random() * pairs.length) | 0]; packets.push({ a, b, t: 0 }) }
      packets = packets.filter(p => p.t < 1)
      for (const p of packets) {
        p.t += dt * 1.1
        const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t
        ctx.fillStyle = `rgba(${head},.2)`; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill()
        ctx.fillStyle = `rgba(${head},.95)`; ctx.beginPath(); ctx.arc(x, y, 2.2, 0, 6.2832); ctx.fill()
      }
    }

    readColors(); resize(); last = performance.now(); raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      running = false; cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('visibilitychange', onVis)
      stopBar()
    }
  }, [])

  return <>
    <div className="fx-bg" aria-hidden="true">
      <div className="fx-aurora"><i/><i/><i/></div>
      <div className="fx-grid"/>
      <div className="fx-scan"/>
    </div>
    <canvas ref={canvasRef} className="fx-canvas" aria-hidden="true"/>
    <div className="fx-topbar" aria-hidden="true"><span ref={barRef}/></div>
  </>
}

/* ------------------------------------------------------------------ */
/* 2. Typing role line: "I'm a  Full-stack developer|"                  */
/* ------------------------------------------------------------------ */
const ROLES = ['full-stack developer.', 'CS instructor.', 'mobile app builder.', 'business-systems engineer.', 'mentor for new coders.', 'problem solver.']
export function RoleTyper() {
  const [text, setText] = useState(ROLES[0])
  useEffect(() => {
    if (reduced()) return
    let i = 0, n = 0, dir = 1, t
    setText('')
    const tick = () => {
      const word = ROLES[i]
      n += dir
      setText(word.slice(0, n))
      let wait = dir === 1 ? 70 : 34
      if (dir === 1 && n === word.length) { dir = -1; wait = 1500 }
      else if (dir === -1 && n === 0) { dir = 1; i = (i + 1) % ROLES.length; wait = 350 }
      t = setTimeout(tick, wait)
    }
    t = setTimeout(tick, 1800)
    return () => clearTimeout(t)
  }, [])
  return <div className="role-line" aria-label="Full-stack developer, CS instructor, mobile app builder, business-systems engineer, mentor">
    <span className="role-pre">I’m a</span> <span className="role-word" aria-hidden="true">{text}</span><i className="role-caret" aria-hidden="true"/>
  </div>
}

/* ------------------------------------------------------------------ */
/* 3. Floating tech chips around the hero portrait.                     */
/* ------------------------------------------------------------------ */
const CHIPS = [
  { t: 'React', c: 'c1' }, { t: 'Laravel', c: 'c2' }, { t: 'Flutter', c: 'c3' },
  { t: 'Next.js', c: 'c4' }, { t: 'MySQL', c: 'c5' }, { t: '</>', c: 'c6' },
]
export function FloatingChips() {
  return <div className="fx-chips" aria-hidden="true">{CHIPS.map(c => <span key={c.t} className={`fx-chip ${c.c}`}>{c.t}</span>)}</div>
}

/* ------------------------------------------------------------------ */
/* 4. Big scroll-driven statement band: BUILD • DESIGN • SHIP           */
/* ------------------------------------------------------------------ */
export function StatementBand() {
  const ref = useRef(null)
  useEffect(() => {
    if (reduced() || !ref.current) return
    const ctx = gsap.context(() => {
      const st = { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: .7 }
      gsap.fromTo('.stmt-row.r1 .stmt-track', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.stmt-row.r2 .stmt-track', { xPercent: -28 }, { xPercent: 0, ease: 'none', scrollTrigger: st })
    }, ref)
    return () => ctx.revert()
  }, [])
  const words = ['BUILD', 'DESIGN', 'SHIP', 'REPEAT']
  const row = (k) => Array.from({ length: 3 }, (_, r) => words.map(w => <span key={`${k}${r}${w}`}>{w}<i>✳</i></span>))
  return <div className="stmt-band" ref={ref} aria-hidden="true">
    <div className="stmt-row r1"><div className="stmt-track">{row('a')}</div></div>
    <div className="stmt-row r2"><div className="stmt-track">{row('b')}</div></div>
  </div>
}

/* ------------------------------------------------------------------ */
/* 5. Page-wide motion extras (headings, cards, clicks, footer).        */
/* ------------------------------------------------------------------ */
export function useAnimatedExtras(ready) {
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      // Section headings rise in with a slight tilt
      gsap.utils.toArray('.about-grid h2,.section-heading-row h2,.skills-layout h2,.journey-heading h2,.contact-content h2').forEach(el => {
        gsap.fromTo(el, { y: 60, opacity: 0, rotate: 1.8, transformOrigin: '0% 100%' }, { y: 0, opacity: 1, rotate: 0, duration: 1.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } })
      })
      // Section divider lines draw across
      gsap.utils.toArray('.section-top').forEach(el => {
        gsap.fromTo(el, { '--line-scale': 0 }, { '--line-scale': 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
      })
      // Service cards pop in with a stagger
      const cards = gsap.utils.toArray('.service-card')
      if (cards.length) gsap.fromTo(cards, { y: 40, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .8, ease: 'back.out(1.4)', stagger: .08, scrollTrigger: { trigger: '.service-grid', start: 'top 82%', once: true } })
      // Skills panel and about facts
      gsap.utils.toArray('.about-facts > div').forEach((el, i) => gsap.from(el, { y: 26, opacity: 0, duration: .7, delay: i * .1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }))
      // Gentle parallax on the big contact headline and orbs
      gsap.to('.contact-orb.orb-one', { y: -90, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom top', scrub: .6 } })
      gsap.to('.contact-orb.orb-two', { y: 70, rotate: 40, ease: 'none', scrollTrigger: { trigger: '.contact-section', start: 'top bottom', end: 'bottom top', scrub: .6 } })
      // Footer mega name slides in
      gsap.fromTo('.mega-name span', { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: .045, scrollTrigger: { trigger: '.mega-name', start: 'top 96%', once: true } })
    })
    return () => ctx.revert()
  }, [ready])

  // Pointer-driven effects (fine pointers only): service-card tilt + spotlight, click burst
  useEffect(() => {
    if (reduced() || !finePointer()) return
    const move = (e) => {
      const card = e.target.closest?.('.service-card')
      if (!card) return
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`)
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
      card.style.transform = `perspective(900px) rotateY(${((px - .5) * 7).toFixed(2)}deg) rotateX(${((.5 - py) * 7).toFixed(2)}deg) translateY(-6px)`
    }
    const out = (e) => {
      const card = e.target.closest?.('.service-card')
      if (card && !card.contains(e.relatedTarget)) card.style.transform = ''
    }
    const burst = (e) => {
      if (!e.target.closest?.('.button-primary,.contact-button,.nav-contact,.project-filters button,.theme-toggle,.text-link')) return
      const colors = ['#ff7655', '#d7f36a', '#8290ff', '#ffffff']
      for (let i = 0; i < 12; i++) {
        const s = document.createElement('span')
        s.className = 'fx-spark'
        s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'
        s.style.background = colors[i % colors.length]
        document.body.appendChild(s)
        const a = (Math.PI * 2 * i) / 12 + Math.random() * .5, d = 40 + Math.random() * 50
        gsap.to(s, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0, scale: .2, duration: .7 + Math.random() * .3, ease: 'power3.out', onComplete: () => s.remove() })
      }
    }
    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseout', out)
    document.addEventListener('click', burst)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseout', out); document.removeEventListener('click', burst) }
  }, [])
}

/* Giant footer name, one span per letter so it can slide in. */
export function MegaName() {
  return <div className="mega-name" aria-hidden="true">{'UMAR SADIQ'.split('').map((ch, i) => <span key={i}>{ch === ' ' ? '\u00A0' : ch}</span>)}</div>
}
