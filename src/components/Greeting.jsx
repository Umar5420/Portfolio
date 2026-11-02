import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Moon, Pencil, Sun, Sunrise, Sunset } from 'lucide-react'
import { partOfDay } from '../lib/preferences'

const PARTS = {
  morning:   { text: 'Good morning',   Icon: Sunrise, note: 'Fresh start. Let’s build something.' },
  afternoon: { text: 'Good afternoon', Icon: Sun,     note: 'Hope the day is treating you well.' },
  evening:   { text: 'Good evening',   Icon: Sunset,  note: 'Glad you stopped by this evening.' },
  night:     { text: 'Hello, night owl', Icon: Moon,  note: 'Late-night browsing — my kind of people.' },
}
const HELLOS = ['Hello', 'Assalam-o-Alaikum', 'Hola', 'Bonjour', 'Namaste', 'Ciao', 'Marhaba']
const NAME_KEY = 'umar-visitor-name'

const readName = () => { try { return localStorage.getItem(NAME_KEY) || '' } catch { return '' } }
const saveName = (v) => { try { v ? localStorage.setItem(NAME_KEY, v) : localStorage.removeItem(NAME_KEY) } catch { /* ignore */ } }

/** Time-aware welcome: wave, greeting by hour, a rotating "hello" in other languages, optional visitor name. */
export default function Greeting() {
  const reduce = useReducedMotion()
  const [part] = useState(() => partOfDay())
  const [name, setName] = useState(readName)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [i, setI] = useState(0)
  const input = useRef(null)
  const { text, Icon, note } = PARTS[part]

  useEffect(() => {
    if (reduce) return undefined
    const id = window.setInterval(() => setI(n => (n + 1) % HELLOS.length), 2600)
    return () => window.clearInterval(id)
  }, [reduce])
  useEffect(() => { if (editing) input.current?.focus() }, [editing])

  const commit = (e) => {
    e.preventDefault()
    const clean = draft.replace(/[<>]/g, '').trim().slice(0, 24)
    setName(clean); saveName(clean); setEditing(false)
  }

  return <motion.div className="greeting-chip" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15, ease: [.22, 1, .36, 1] }}>
    <span className="greeting-icon" aria-hidden="true"><Icon size={16}/></span>
    <span className="greeting-main">
      <strong>{text}{name ? `, ${name}` : ''}<span className="greeting-wave" aria-hidden="true">👋</span></strong>
      <small>{note}</small>
    </span>
    <span className="greeting-hello" aria-hidden="true">
      <AnimatePresence mode="wait" initial={false}>
        <motion.em key={HELLOS[i]} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }} transition={{ duration: .3 }}>{HELLOS[i]}</motion.em>
      </AnimatePresence>
    </span>
    {editing
      ? <form className="greeting-form" onSubmit={commit}><input ref={input} value={draft} onChange={e => setDraft(e.target.value)} maxLength={24} placeholder="Your name" aria-label="Your name" onBlur={commit}/></form>
      : <button className="greeting-edit" onClick={() => { setDraft(name); setEditing(true) }} aria-label={name ? 'Change your name' : 'Add your name'} title={name ? 'Change name' : 'Tell me your name'}><Pencil size={12}/>{!name && <span>Your name?</span>}</button>}
  </motion.div>
}
