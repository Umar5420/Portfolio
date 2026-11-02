import { useEffect, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* A little "me" that walks along the bottom of the page as the visitor scrolls.
   The head is the real photo; the body is a simple illustrated figure so the walk cycle can be animated.
   It walks while the page is catching up with the scroll, stands (and breathes) when it stops,
   and waves when it reaches the contact section. Hidden for visitors who prefer reduced motion. */
export function WalkingMe({ refreshKey }) {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  useEffect(() => {
    const el = rootRef.current
    if (!el || reduce) return
    let raf, cur = 8, target = 8
    const W = () => el.offsetWidth
    const calc = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      target = 8 + p * Math.max(0, window.innerWidth - W() - 16)
      const contact = document.getElementById('contact')
      const waving = !!contact && contact.getBoundingClientRect().top < window.innerHeight * .55
      el.dataset.wave = waving ? '1' : '0'
      el.classList.toggle('is-on', window.scrollY > 120)
    }
    const tick = () => {
      const d = target - cur
      cur += d * .09
      const moving = Math.abs(d) > 1.4
      el.style.transform = `translate3d(${cur.toFixed(1)}px,0,0)`
      el.dataset.walking = moving ? '1' : '0'
      if (moving) el.dataset.dir = d > 0 ? 'r' : 'l'
      raf = requestAnimationFrame(tick)
    }
    calc(); tick()
    window.addEventListener('scroll', calc, { passive: true })
    window.addEventListener('resize', calc)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', calc); window.removeEventListener('resize', calc) }
  }, [reduce, refreshKey])
  if (reduce) return null
  return <div className="walker" ref={rootRef} data-walking="0" data-dir="r" data-wave="0" aria-hidden="true">
    <div className="walker-figure">
      <img className="walker-photo" src="/images/cut-walker.webp" alt="" width="315" height="520" loading="lazy" decoding="async"/>
      <svg className="walker-legs" viewBox="0 0 80 52" width="80" height="52">
        <g className="w-leg w-leg-l"><rect x="27" y="0" width="12" height="40" rx="6" fill="#e9e3d3"/><rect x="27" y="0" width="12" height="40" rx="6" fill="none" stroke="#cfc6b0" strokeWidth="1"/><ellipse cx="32" cy="45" rx="9" ry="5" fill="#2a2630"/></g>
        <g className="w-leg w-leg-r"><rect x="41" y="0" width="12" height="40" rx="6" fill="#e9e3d3"/><rect x="41" y="0" width="12" height="40" rx="6" fill="none" stroke="#cfc6b0" strokeWidth="1"/><ellipse cx="48" cy="45" rx="9" ry="5" fill="#2a2630"/></g>
      </svg>
      <span className="walker-dust d1"/><span className="walker-dust d2"/>
    </div>
    <span className="walker-shadow"/>
  </div>
}

/* Seated photo in an arch frame: slow parallax inside the frame, a reveal on scroll, and a gentle tilt on hover. */
export function AboutPhoto() {
  const reduce = useReducedMotion()
  const imgRef = useRef(null), frameRef = useRef(null)
  useEffect(() => {
    if (reduce || !imgRef.current) return
    const tween = gsap.fromTo(imgRef.current, { yPercent: -7, scale: 1.12 }, {
      yPercent: 7, scale: 1.12, ease: 'none',
      scrollTrigger: { trigger: frameRef.current, start: 'top bottom', end: 'bottom top', scrub: .6 }
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [reduce])
  const tilt = (e) => {
    if (reduce) return
    const r = frameRef.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - .5) * 8, y = ((e.clientY - r.top) / r.height - .5) * -8
    frameRef.current.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${y}deg)`
  }
  const rest = () => { if (frameRef.current) frameRef.current.style.transform = '' }
  const figRef = useRef(null)
  const seen = useInView(figRef, { once: true, amount: .25 })
  const shut = 'inset(100% 0 0 0 round 46% 46% 6px 6px)', open = 'inset(0% 0 0 0 round 46% 46% 6px 6px)'
  return <figure className="about-photo" ref={figRef}>
    <motion.div className="about-photo-clip" initial={reduce ? false : { clipPath: shut }} animate={{ clipPath: seen || reduce ? open : shut }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [.22, 1, .36, 1] }}>
      <div className="about-photo-frame" ref={frameRef} onMouseMove={tilt} onMouseLeave={rest}>
        <img ref={imgRef} src="/images/umar-about2.webp" alt="Umar Sadiq seated in an armchair" width="720" height="1280" loading="lazy" decoding="async"/>
        <span className="about-photo-shine"/>
      </div>
    </motion.div>
    <figcaption className="about-photo-tag"><span className="status-dot"/> Always curious. Always building.</figcaption>
  </figure>
}

export function Ribbon() {
  const words = ['Web apps', 'Mobile apps', 'Business systems', 'Brand design', 'Digital marketing', 'Local SEO']
  const row = words.flatMap(w => [<span key={w}>{w}</span>, <i key={w + 'i'}>✳</i>])
  return <div className="ribbon" aria-hidden="true"><div className="ribbon-track">{row}{row}{row}{row}</div></div>
}

/* Studio section: copy on the left, two photo cards on the right that float and tilt with scroll. */
export function StudioBand() {
  const reduce = useReducedMotion()
  const bandRef = useRef(null)
  useEffect(() => {
    if (reduce || !bandRef.current) return
    const ctx = gsap.context(() => {
      const st = { trigger: bandRef.current, start: 'top bottom', end: 'bottom top', scrub: .6 }
      gsap.fromTo('.studio-card.c1', { y: 50, rotate: -7 }, { y: -50, rotate: -2, ease: 'none', scrollTrigger: st })
      gsap.fromTo('.studio-card.c2', { y: 90, rotate: 8 }, { y: -20, rotate: 3, ease: 'none', scrollTrigger: st })
    }, bandRef)
    return () => ctx.revert()
  }, [reduce])
  return <section className="studio-band section-pad" ref={bandRef} aria-label="Behind the scenes">
    <div className="studio-glow" aria-hidden="true"/>
    <motion.div className="studio-band-copy" initial={reduce ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }} transition={{ duration: .9, ease: [.22, 1, .36, 1] }}>
      <span>THE WORKSPACE</span>
      <h2>Where ideas get <em>built.</em></h2>
      <p>Software, design and digital growth, worked out at my own desk, one project at a time.</p>
    </motion.div>
    <div className="studio-cards">
      <figure className="studio-card c1"><motion.div initial={reduce ? false : { opacity: 0, y: 55, rotate: -5, scale: .94 }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1, ease: [.22, 1, .36, 1] }}><img src="/images/g-studio-ceo.webp" alt="Umar Sadiq at his desk" width="900" height="1200" loading="lazy" decoding="async"/></motion.div></figure>
      <figure className="studio-card c2"><motion.div initial={reduce ? false : { opacity: 0, y: 70, rotate: 6, scale: .94 }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.05, delay: .16, ease: [.22, 1, .36, 1] }}><img src="/images/g-studio-work.webp" alt="Umar Sadiq working on a laptop" width="900" height="1200" loading="lazy" decoding="async"/></motion.div></figure>
    </div>
  </section>
}

/* Scroll-driven parallax for the hero portrait stage and its floating bits. */
export function useHeroParallax() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const st = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .5 }
      gsap.to('.portrait-stage', { y: -46, ease: 'none', scrollTrigger: st })
      gsap.to('.sticker-top', { y: -70, x: 16, ease: 'none', scrollTrigger: st })
      gsap.to('.sticker-bottom', { y: -26, x: -14, ease: 'none', scrollTrigger: st })
      gsap.to('.hero-copy', { y: -22, ease: 'none', scrollTrigger: st })
    })
    return () => ctx.revert()
  }, [])
}
