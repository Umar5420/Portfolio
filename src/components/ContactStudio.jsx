import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Mail, MessageCircle, Phone, ArrowUpRight, RotateCw } from 'lucide-react'
import { SITE } from '../siteConfig'
import { ContactExtras } from './Sections'

const LAMP_COLORS = [
  ['#ffb347', 'amber'], ['#22d3ee', 'cyan'], ['#ff4d9d', 'pink'], ['#4ade80', 'green'], ['#a78bfa', 'violet'], ['#f1f5ff', 'white'],
]

/* Desk lamp: pull the cord to change the colour of the whole contact section. */
function Lamp({ color, name, onPull, pulled }) {
  return <button type="button" className={`lamp ${pulled ? 'is-pulled' : ''}`} onClick={onPull} aria-label={`Desk lamp, currently ${name}. Press to change the light colour.`} title="Pull the cord">
    <svg viewBox="0 0 200 270" width="200" height="270" aria-hidden="true">
      <defs>
        <linearGradient id="lamp-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".55"/><stop offset="1" stopColor={color} stopOpacity="0"/></linearGradient>
      </defs>
      <polygon className="lamp-cone" points="84,98 150,98 196,268 40,268" fill="url(#lamp-cone)"/>
      <ellipse cx="62" cy="258" rx="46" ry="9" fill="#1b2140"/>
      <g stroke="#cfd6ee" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M62 252 L62 168 L108 92"/></g>
      <circle cx="62" cy="168" r="6" fill="#8b95b8"/>
      <g transform="rotate(-24 118 92)"><path d="M86 94 Q118 52 150 94 Z" fill="#2a315c" stroke="#cfd6ee" strokeWidth="3"/><ellipse cx="118" cy="95" rx="32" ry="6" fill={color} className="lamp-bulb"/></g>
      <g className="lamp-cord"><line x1="140" y1="96" x2="140" y2="150" stroke="#cfd6ee" strokeWidth="2"/><circle cx="140" cy="154" r="5" fill={color}/></g>
    </svg>
  </button>
}

/* Contact: a glass card that flips between the message form and direct ways to reach Umar. */
export function ContactStudio({ children }) {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const [lamp, setLamp] = useState(0)
  const [pulled, setPulled] = useState(false)
  const [flipped, setFlipped] = useState(false)
  const [color, name] = LAMP_COLORS[lamp]
  useEffect(() => {
    const section = rootRef.current?.closest('.contact-section')
    if (section) section.style.setProperty('--lamp', color)
    return () => { section?.style.removeProperty('--lamp') }
  }, [color])
  const pull = () => { setLamp(v => (v + 1) % LAMP_COLORS.length); setPulled(true); setTimeout(() => setPulled(false), 450) }
  const glow = (e) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--gx', `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`)
    e.currentTarget.style.setProperty('--gy', `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`)
  }
  const wa = SITE.whatsapp.replace(/\D/g, '')
  return <div className="contact-studio" ref={rootRef}>
    <Lamp color={color} name={name} onPull={pull} pulled={pulled}/>
    <ContactExtras/>
    <div className="flip-tabs" role="tablist" aria-label="How would you like to reach me?">
      <button type="button" role="tab" aria-selected={!flipped} className={!flipped ? 'on' : ''} onClick={() => setFlipped(false)}>Send a message</button>
      <button type="button" role="tab" aria-selected={flipped} className={flipped ? 'on' : ''} onClick={() => setFlipped(true)}>Talk directly</button>
    </div>
    <div className={`flip-card ${flipped ? 'is-flipped' : ''}`}>
      <div className="flip-inner">
        <div className="flip-face flip-front glass" onMouseMove={glow} aria-hidden={flipped} inert={flipped ? '' : undefined}>{children}</div>
        <div className="flip-face flip-back glass" onMouseMove={glow} aria-hidden={!flipped} inert={!flipped ? '' : undefined}>
          <h3>Prefer to talk?</h3>
          <p>Pick the quickest way to reach me. I read every message myself.</p>
          <div className="direct-grid">
            {wa && <a className="direct-tile wa" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi Umar, I found your portfolio and would like to talk about a project.')}`} target="_blank" rel="noreferrer"><MessageCircle size={22}/><b>WhatsApp</b><span>{SITE.phoneDisplay}</span><ArrowUpRight size={16}/></a>}
            {SITE.email && <a className="direct-tile" href={`mailto:${SITE.email}?subject=${encodeURIComponent('Project enquiry from your portfolio')}`}><Mail size={22}/><b>Email</b><span>{SITE.email}</span><ArrowUpRight size={16}/></a>}
            {SITE.phoneTel && <a className="direct-tile" href={`tel:${SITE.phoneTel}`}><Phone size={22}/><b>Call</b><span>{SITE.phoneDisplay}</span><ArrowUpRight size={16}/></a>}
          </div>
          <button type="button" className="flip-back-btn" onClick={() => setFlipped(false)}><RotateCw size={14}/> Back to the message form</button>
        </div>
      </div>
    </div>
  </div>
}
