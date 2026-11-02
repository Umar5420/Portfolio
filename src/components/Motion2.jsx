import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

/* Short branded intro: the "u." mark draws in, then the curtain lifts. Once per browser session, under 1.5s. */
let introPlaying = false
export function Preloader() {
  const [show, setShow] = useState(() => {
    let v
    try { v = !reduced() && !sessionStorage.getItem('intro-seen') } catch { v = !reduced() }
    introPlaying = introPlaying || v
    return v
  })
  useEffect(() => {
    if (!show) return
    try { sessionStorage.setItem('intro-seen', '1') } catch { /* private mode */ }
    const t = setTimeout(() => setShow(false), 1450)
    return () => clearTimeout(t)
  }, [show])
  if (!show) return null
  return <div className="preloader" aria-hidden="true"><div className="preloader-mark">u<span>.</span></div></div>
}

/* Inertial smooth scrolling (mouse/trackpad devices only), kept in sync with GSAP ScrollTrigger. */
export function useSmoothScroll() {
  useEffect(() => {
    if (reduced() || !finePointer()) return
    const lenis = new Lenis({ duration: 1.1, easing: t => 1 - Math.pow(1 - t, 3), anchors: true })
    document.documentElement.classList.add('has-lenis')
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); document.documentElement.classList.remove('has-lenis') }
  }, [])
}

/* Dot + trailing ring cursor that grows over links and says "View" over projects. Fine pointers only. */
export function Cursor() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (reduced() || !finePointer()) return
    setOn(true)
    document.documentElement.classList.add('has-cursor')
    const dot = document.querySelector('.cursor-dot'), ring = document.querySelector('.cursor-ring'), label = document.querySelector('.cursor-label')
    if (!dot || !ring) return
    const dx = gsap.quickTo(dot, 'x', { duration: .05 }), dy = gsap.quickTo(dot, 'y', { duration: .05 })
    const rx = gsap.quickTo(ring, 'x', { duration: .35, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .35, ease: 'power3' })
    const move = (e) => {
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY)
      ring.classList.add('is-visible'); dot.classList.add('is-visible')
      const t = e.target.closest?.('a,button,select,summary,label,[data-cursor]')
      const proj = e.target.closest?.('.project-card')
      ring.classList.toggle('is-link', !!t && !proj)
      ring.classList.toggle('is-view', !!proj)
      label.textContent = proj ? 'View' : ''
      ring.classList.toggle('is-text', !!e.target.closest?.('input,textarea'))
    }
    const leave = () => { ring.classList.remove('is-visible'); dot.classList.remove('is-visible') }
    const down = () => ring.classList.add('is-down'), up = () => ring.classList.remove('is-down')
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', leave)
    window.addEventListener('mousedown', down); window.addEventListener('mouseup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave)
      window.removeEventListener('mousedown', down); window.removeEventListener('mouseup', up)
    }
  }, [])
  if (!on && (reduced() || !finePointer())) return null
  return <><div className="cursor-ring"><span className="cursor-label"/></div><div className="cursor-dot"/></>
}

/* Magnetic buttons and project-card spotlight + tilt (event delegation, so it covers cards added later). */
export function useHoverEffects() {
  useEffect(() => {
    if (reduced() || !finePointer()) return
    const MAG = '.button-primary,.contact-button,.nav-contact,.theme-toggle,.back-top,.guide-action'
    let magEl = null
    const move = (e) => {
      const m = e.target.closest?.(MAG)
      if (magEl && magEl !== m) { gsap.to(magEl, { x: 0, y: 0, duration: .5, ease: 'elastic.out(1,.5)' }); magEl = null }
      if (m) {
        const r = m.getBoundingClientRect()
        gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3, ease: 'power3.out' })
        magEl = m
      }
      const card = e.target.closest?.('.project-card')
      if (card) {
        const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
        card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`); card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`)
        const art = card.querySelector('.project-art')
        if (art) art.style.transform = `perspective(800px) rotateY(${((px - .5) * 8).toFixed(2)}deg) rotateX(${((.5 - py) * 8).toFixed(2)}deg)`
      }
    }
    const out = (e) => {
      const card = e.target.closest?.('.project-card')
      if (card && !card.contains(e.relatedTarget)) { const art = card.querySelector('.project-art'); if (art) art.style.transform = '' }
    }
    document.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseout', out)
    return () => { document.removeEventListener('mousemove', move); document.removeEventListener('mouseout', out) }
  }, [])
}

/* Hero headline: each line slides up from behind a mask, then "digital" fills with colour. */
export function useHeroReveal(ready = true) {
  useEffect(() => {
    if (!ready) return
    if (reduced()) { document.querySelectorAll('.headline-outline').forEach(el => el.classList.add('is-filled')); return }
    const delay = introPlaying ? 1.35 : .1
    const ctx = gsap.context(() => {
      gsap.from('.hero-title .ln-in', { yPercent: 115, duration: 1.05, ease: 'expo.out', stagger: .14, delay })
      gsap.fromTo('.hero-title .headline-outline', { backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%', duration: 1.1, ease: 'power2.inOut', delay: delay + .75 })
      gsap.from('.role-line,.hero-intro,.hero-actions,.hero-term,.hero-meta', { y: 24, opacity: 0, duration: .8, ease: 'power3.out', stagger: .1, delay: delay + .45 })
    })
    return () => ctx.revert()
  }, [ready])
}

/* Timeline: the vertical line draws as you scroll and each marker pops when reached. */
export function useTimelineDraw(deps) {
  useEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.timeline-line', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 72%', end: 'bottom 62%', scrub: .4 } })
      gsap.utils.toArray('.timeline-marker').forEach(el => gsap.fromTo(el, { scale: .4, opacity: .25 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(2.4)', scrollTrigger: { trigger: el, start: 'top 78%', toggleActions: 'play none none reverse' } }))
    })
    return () => ctx.revert()
  }, [deps])
}
