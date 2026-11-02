import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, ArrowLeft, RotateCcw, Check } from 'lucide-react'
import { Tilt, Laptop } from './DeviceFrame'
import { availabilityInfo } from './Availability'

gsap.registerPlugin(ScrollTrigger)

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches
const goTo = (sel) => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' })

/* ================================================================== */
/* 1. Interactive terminal in the hero                                 */
/* ================================================================== */
export function HeroTerminal({ profile, skills, projects }) {
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState('')
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)
  const inputRef = useRef(null)
  const userTyped = useRef(false)
  const dataRef = useRef({})
  dataRef.current = { profile, skills, projects }

  const answer = (raw) => {
    const { profile: pr, skills: sk, projects: pj } = dataRef.current
    const text = raw.trim()
    const c = text.toLowerCase()
    const first = c.split(/\s+/)[0]
    if (!c) return { out: [] }
    if (c === 'sudo hire umar' || first === 'hire') return { out: [{ k: 'ok', t: c.startsWith('sudo') ? '[sudo] permission granted ✓' : 'Great choice ✓' }, { k: 'out', t: 'Opening the contact form…' }], action: () => goTo('#contact') }
    switch (first) {
      case 'help': return { out: [{ k: 'out', t: 'whoami · skills · teach · projects · status · contact · hire · about · work · cv · clear (Ctrl+K: menu)' }] }
      case 'whoami': return { out: [{ k: 'out', t: `${pr.name} — ${pr.role}` }, { k: 'out', t: pr.location }] }
      case 'skills': return { out: [{ k: 'out', t: (sk || []).slice(0, 8).join(' · ') || 'Add skills in Admin' }] }
      case 'projects': return { out: (pj || []).length ? pj.slice(0, 6).map(p => ({ k: 'out', t: '→ ' + p.name })) : [{ k: 'out', t: 'No projects published yet.' }] }
      case 'teach': case 'teaching': case 'courses': return { out: [{ k: 'out', t: 'CS & IT Instructor — web dev, databases, OOP, labs' }, { k: 'out', t: 'Scrolling to Teaching…' }], action: () => goTo('#teach') }
      case 'cv': case 'resume': return { out: [{ k: 'out', t: 'Opening CV…' }], action: () => { window.location.href = '/cv' } }
      case 'status': { const av = availabilityInfo(pr); return { out: [av ? { k: av.key === 'busy' ? 'err' : 'ok', t: `● ${av.label.toLowerCase()}${av.note ? ' — ' + av.note : ''}` } : { k: 'out', t: 'Ask me directly about availability.' }] } }
      case 'contact': return { out: [{ k: 'out', t: pr.email }] }
      case 'about': return { out: [{ k: 'out', t: 'Scrolling to About…' }], action: () => goTo('#about') }
      case 'work': return { out: [{ k: 'out', t: 'Scrolling to Work…' }], action: () => goTo('#work') }
      case 'clear': return { out: [], clear: true }
      default: return { out: [{ k: 'err', t: `command not found: ${text.slice(0, 40)} — try "help"` }] }
    }
  }

  // Auto demo, stops as soon as the visitor starts typing
  useEffect(() => {
    if (reduced()) {
      const { out: a } = answer('whoami'), { out: b } = answer('status')
      setLines([{ k: 'cmd', t: 'whoami' }, ...a, { k: 'cmd', t: 'status' }, ...b]); return
    }
    let cancelled = false
    const timers = []
    const sleep = (ms) => new Promise(r => { timers.push(setTimeout(r, ms)) })
    ;(async () => {
      await sleep(2400)
      for (const cmd of ['whoami', 'skills', 'status']) {
        if (cancelled || userTyped.current) return
        for (let i = 1; i <= cmd.length; i++) { if (cancelled || userTyped.current) return; setTyping(cmd.slice(0, i)); await sleep(75) }
        await sleep(260)
        if (cancelled || userTyped.current) return
        const { out } = answer(cmd)
        setTyping('')
        setLines(l => [...l, { k: 'cmd', t: cmd }, ...out])
        await sleep(800)
      }
    })()
    return () => { cancelled = true; timers.forEach(clearTimeout) }
  }, [])

  useEffect(() => { const el = bodyRef.current; if (el) el.scrollTop = el.scrollHeight }, [lines, typing])

  const onKey = (e) => {
    if (e.key !== 'Enter') return
    const raw = input
    setInput('')
    const res = answer(raw)
    if (res.clear) setLines([])
    else if (raw.trim()) setLines(l => [...l.slice(-40), { k: 'cmd', t: raw.trim() }, ...res.out])
    if (res.action) setTimeout(res.action, 650)
  }

  return <div className="hero-term" role="group" aria-label="Interactive terminal. Type help for commands.">
    <div className="term-bar"><i/><i/><i/><span>umar@portfolio — zsh</span><em>try: help</em></div>
    <div className="term-body" ref={bodyRef} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
      {lines.map((l, i) => <div key={i} className={`term-line ${l.k}`}>{l.k === 'cmd' && <b>$ </b>}{l.t}</div>)}
      <div className="term-line cmd term-prompt"><b>$ </b>{typing && !input && <span>{typing}</span>}
        <input ref={inputRef} value={input} onChange={e => { userTyped.current = true; setTyping(''); setInput(e.target.value) }} onKeyDown={onKey}
          onFocus={() => { userTyped.current = true; setTyping('') }} maxLength={60} spellCheck="false" autoComplete="off" autoCapitalize="off" aria-label="Terminal command" placeholder={typing ? '' : 'type a command…'}/>
      </div>
    </div>
  </div>
}

/* ================================================================== */
/* 2. Project estimator → pre-fills the contact form                    */
/* ================================================================== */
const QUESTIONS = [
  { key: 'service', q: 'What are you looking to build?', opts: [['Website / Web App', 'Website or web app'], ['Mobile Application', 'Mobile app'], ['CRM / ERP / Business System', 'Business system (CRM / ERP)'], ['UI/UX or Graphic Design', 'Design & branding'], ['Digital Marketing / Ads', 'Marketing & ads'], ['Python / Automation / AI', 'Python, automation & AI'], ['SEO', 'SEO'], ['Other', 'Not sure yet']] },
  { key: 'size', q: 'How big is it?', opts: [['A single page or simple site'], ['A few pages or features'], ['A full platform or system'], ['I’d like help deciding']] },
  { key: 'time', q: 'When do you need it?', opts: [['As soon as possible'], ['Within 1–2 months'], ['In 3+ months'], ['Flexible']] },
  { key: 'budget', q: 'What budget range feels right?', opts: [['Under $250'], ['$250–$500'], ['$500–$1,000'], ['$1,000–$3,000'], ['$3,000+'], ['', 'I’d rather discuss it']] },
]
export function Estimator({ n, onDone }) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(0)
  const [ans, setAns] = useState({})
  const label = (key) => { const q = QUESTIONS.find(x => x.key === key); const o = q.opts.find(x => x[0] === ans[key]); return o ? (o[1] || o[0]) : '' }
  const pick = (key, val) => { setAns(a => ({ ...a, [key]: val })); setStep(s => s + 1) }
  const done = step >= QUESTIONS.length
  const q = QUESTIONS[step]
  const send = () => onDone({
    service: ans.service || 'Other',
    budget: ans.budget || '',
    message: `Hi Umar, I’d like help with: ${label('service')}.\nSize: ${label('size')}.\nTiming: ${label('time')}.\nBudget: ${ans.budget ? ans.budget : 'to be discussed'}.\n\nA little more about my project: `
  })
  return <section id="estimate" className="estimate-section section-pad">
    <div className="section-top"><span className="section-kicker">{n} / START HERE</span><span className="section-side">FOUR QUICK QUESTIONS</span></div>
    <div className="section-heading-row"><h2>Plan your<br/><em>project.</em></h2><p>Answer a few questions and I’ll turn them into a ready-to-send brief. No prices are promised here; you get a clear estimate from me after we talk.</p></div>
    <div className="est-card">
      <div className="est-progress" aria-hidden="true">{QUESTIONS.map((_, i) => <i key={i} className={i < step ? 'done' : i === step ? 'now' : ''}/>)}</div>
      {!done ? <motion.div key={step} className="est-step" initial={reduce ? false : { opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .45, ease: [.22, 1, .36, 1] }}>
        <span className="est-count">STEP {step + 1} / {QUESTIONS.length}</span>
        <h3>{q.q}</h3>
        <div className="est-options">{q.opts.map(([val, text]) => <button type="button" key={text || val} className={ans[q.key] === val && q.key in ans ? 'on' : ''} onClick={() => pick(q.key, val)}>{text || val}<ArrowUpRight size={16}/></button>)}</div>
        {step > 0 && <button type="button" className="est-back" onClick={() => setStep(s => s - 1)}><ArrowLeft size={14}/> Back</button>}
      </motion.div> : <motion.div className="est-step est-result" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [.22, 1, .36, 1] }}>
        <span className="est-count"><Check size={13}/> YOUR BRIEF IS READY</span>
        <h3>Here’s what you told me</h3>
        <dl className="est-summary">
          <div><dt>Building</dt><dd>{label('service')}</dd></div>
          <div><dt>Size</dt><dd>{label('size')}</dd></div>
          <div><dt>Timing</dt><dd>{label('time')}</dd></div>
          <div><dt>Budget</dt><dd>{ans.budget || 'To be discussed'}</dd></div>
        </dl>
        <div className="est-actions">
          <button type="button" className="button-primary" onClick={send}>Send this to Umar <ArrowUpRight size={17}/></button>
          <button type="button" className="est-back" onClick={() => { setStep(0); setAns({}) }}><RotateCcw size={14}/> Start over</button>
        </div>
        <small className="est-note">This fills in the contact form below. You can edit anything before sending.</small>
      </motion.div>}
    </div>
  </section>
}

/* ================================================================== */
/* 3. Horizontal-scroll project showcase (desktop, mouse devices)       */
/* ================================================================== */
export function ProjectShowcase({ projects }) {
  const [on, setOn] = useState(false)
  const secRef = useRef(null)
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const list = [...projects].sort((a, b) => Number(!!b.featured) - Number(!!a.featured)).slice(0, 6)
  const key = list.map(p => p.id).join()

  useEffect(() => { setOn(list.length >= 3 && window.matchMedia('(min-width:901px)').matches && finePointer() && !reduced()) }, [key])

  useEffect(() => {
    if (!on || !secRef.current || !trackRef.current) return
    const sec = secRef.current, track = trackRef.current
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth)
    const common = { trigger: sec, start: 'top top', end: () => '+=' + dist(), scrub: .6, invalidateOnRefresh: true }
    const ctx = gsap.context(() => {
      gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { ...common, pin: true, anticipatePin: 1, refreshPriority: 1 } })
      gsap.to(barRef.current, { scaleX: 1, ease: 'none', scrollTrigger: common })
    }, sec)
    const t = setTimeout(() => ScrollTrigger.refresh(), 500)
    return () => { clearTimeout(t); ctx.revert() }
  }, [on, key])

  if (!on) return null
  return <div className="showcase" ref={secRef}>
    <div className="showcase-head"><span>FEATURED WORK</span><span>{list.length} PROJECTS · KEEP SCROLLING →</span><div className="showcase-bar"><span ref={barRef}/></div></div>
    <div className="showcase-track" ref={trackRef}>
      <div className="show-intro"><h3>Selected<br/><em>work.</em></h3><p>Scroll to explore<br/>each project →</p></div>
      {list.map((p, i) => <a key={p.id} className={`show-card ${p.tone}`} href={`/projects/${p.slug}`} aria-label={`View ${p.name} case study`}>
        <div className="show-art">{p.coverImage ? <div className="show-device"><Tilt max={8}><Laptop src={p.coverImage} alt={`${p.name} cover`}/></Tilt></div> : <span className="show-mono">{p.mark}</span>}<b className="show-num">{String(i + 1).padStart(2, '0')}</b></div>
        <div className="show-info">
          <span className="show-type">{p.type}{p.featured ? ' · FEATURED' : ''}</span>
          <h4>{p.name}</h4>
          {p.desc && <p>{p.desc}</p>}
          {p.technologies?.length > 0 && <div className="show-tech">{p.technologies.slice(0, 4).map(t => <i key={t}>{t}</i>)}</div>}
          <span className="show-cta">View case study <ArrowUpRight size={18}/></span>
        </div>
      </a>)}
      <a className="show-end" href="#work-all"><span>Browse &amp;<br/>search all</span><ArrowUpRight size={30}/></a>
    </div>
  </div>
}

/* ================================================================== */
/* 4. Text-scramble ("decode") on headings and section labels           */
/* ================================================================== */
export function useScramble(ready) {
  useEffect(() => {
    if (reduced()) return
    const CH = '01<>/{}[]#$%&*+=_'
    const els = [...document.querySelectorAll('.about-grid h2,.section-heading-row h2,.skills-layout h2,.journey-heading h2,.contact-content h2,.section-kicker')]
    const triggers = [], rafs = [], running = new Set()
    els.forEach(el => {
      if (el.dataset.scrambled) return
      triggers.push(ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          if (el.dataset.scrambled) return
          el.dataset.scrambled = '1'
          const nodes = []
          const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
          let node
          while ((node = walker.nextNode())) if (node.nodeValue.trim()) nodes.push({ node, orig: node.nodeValue })
          const total = nodes.reduce((a, x) => a + x.orig.length, 0)
          if (!total) return
          running.add(nodes)
          const dur = Math.min(1200, 500 + total * 20), t0 = performance.now()
          const step = (now) => {
            const p = Math.min(1, (now - t0) / dur)
            let idx = 0
            nodes.forEach(x => {
              if (p >= 1) { x.node.nodeValue = x.orig; running.delete(nodes); return }
              let out = ''
              for (let i = 0; i < x.orig.length; i++) {
                const ch = x.orig[i]
                out += (/\s/.test(ch) || p * 1.35 > (idx + i) / total) ? ch : CH[(Math.random() * CH.length) | 0]
              }
              idx += x.orig.length
              x.node.nodeValue = out
            })
            if (p < 1) rafs.push(requestAnimationFrame(step))
          }
          rafs.push(requestAnimationFrame(step))
        }
      }))
    })
    return () => { triggers.forEach(t => t.kill()); rafs.forEach(cancelAnimationFrame); running.forEach(list => list.forEach(x => { x.node.nodeValue = x.orig })); running.clear() }
  }, [ready])
}
