import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { CheckCheck, RotateCw } from 'lucide-react'

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '·'

/** Plays a conversation one message at a time, with a typing indicator before each reply. */
function ChatWindow({ convo, replayKey }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: false, amount: .35 })
  const messages = convo.messages || []
  const [shown, setShown] = useState(reduce ? messages.length : 0)
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => { setShown(reduce ? messages.length : 0); setTyping(false) }, [convo.id, replayKey, reduce, messages.length])

  useEffect(() => {
    if (reduce || !inView || shown >= messages.length) return undefined
    const next = messages[shown]
    const readMs = shown === 0 ? 500 : 650
    const typeMs = Math.min(1700, 500 + (next.text?.length || 0) * 16)
    const t1 = window.setTimeout(() => setTyping(true), readMs)
    const t2 = window.setTimeout(() => { setTyping(false); setShown(n => n + 1) }, readMs + typeMs)
    return () => { window.clearTimeout(t1); window.clearTimeout(t2) }
  }, [inView, shown, messages, reduce])

  useEffect(() => { bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }) }, [shown, typing, reduce])

  const done = shown >= messages.length
  const nextFrom = messages[shown]?.from
  return <div className="chat-window" ref={ref}>
    <div className="chat-head">
      <span className="chat-avatar">{initials(convo.client)}</span>
      <div><strong>{convo.client}</strong><small><i className="chat-online"/> {convo.role || 'Client'}{convo.project ? ` · ${convo.project}` : ''}</small></div>
      {convo.sample && <span className="chat-sample">SAMPLE</span>}
    </div>
    <div className="chat-body" ref={bodyRef} aria-live="polite">
      <div className="chat-day">Project delivered</div>
      {messages.slice(0, shown).map((m, i) => <motion.div key={`${convo.id}-${i}`} className={`chat-msg ${m.from === 'me' ? 'from-me' : 'from-client'}`}
        initial={reduce ? false : { opacity: 0, y: 14, scale: .94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .35, ease: [.22, 1, .36, 1] }}>
        <p>{m.text}</p>
        {m.from === 'me' && <CheckCheck size={13} className="chat-ticks"/>}
      </motion.div>)}
      <AnimatePresence>
        {typing && <motion.div key="typing" className={`chat-msg chat-typing ${nextFrom === 'me' ? 'from-me' : 'from-client'}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-label="Typing">
          <span/><span/><span/>
        </motion.div>}
      </AnimatePresence>
    </div>
    <div className="chat-foot">
      <span>{done ? 'Conversation shared with the client’s permission.' : 'Replying…'}</span>
      {done && messages.length > 0 && !reduce && <button onClick={() => setShown(0)} aria-label="Replay conversation"><RotateCw size={13}/> Replay</button>}
    </div>
  </div>
}

export default function Conversations({ conversations }) {
  const [active, setActive] = useState(0)
  const [replayKey] = useState(0)
  const list = useMemo(() => conversations, [conversations])
  const safe = Math.min(active, list.length - 1)
  const convo = list[safe]
  if (!convo) return null
  return <div className="chat-layout">
    <div className="chat-people" role="tablist" aria-label="Client conversations">
      {list.map((c, i) => <button key={c.id} role="tab" aria-selected={i === safe} className={`chat-person ${i === safe ? 'active' : ''}`} onClick={() => setActive(i)}>
        <span className="chat-avatar">{initials(c.client)}</span>
        <span><strong>{c.client}</strong><small>{c.project || c.role || 'Client'}</small></span>
      </button>)}
    </div>
    <ChatWindow convo={convo} replayKey={replayKey}/>
  </div>
}
