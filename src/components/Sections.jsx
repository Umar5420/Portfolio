import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, FileDown, CalendarDays, Plus, ArrowUpRight } from 'lucide-react'
import { SITE } from '../siteConfig'

const rise = (reduce, delay = 0) => reduce ? {} : {
  initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: .2 }, transition: { duration: .7, delay, ease: [.22, 1, .36, 1] }
}

/* ---- How I work ---- */
const STEPS = [
  ['01', 'Discuss', 'We talk about your goal, your users and your budget. You get clear questions, not jargon.'],
  ['02', 'Plan', 'I share the scope, timeline and what is included before any work begins.'],
  ['03', 'Build', 'You see real progress along the way, so there are no surprises at the end.'],
  ['04', 'Support', 'After launch I stay available for fixes, updates and the next improvement.'],
]
export function HowIWork({ n }) {
  const reduce = useReducedMotion()
  return <section id="process" className="process-section section-pad">
    <div className="section-top"><span className="section-kicker">{n} / HOW I WORK</span><span className="section-side">CLEAR STEPS, NO SURPRISES</span></div>
    <div className="section-heading-row"><h2>From hello<br/>to <em>live.</em></h2><p>Every project follows the same simple path, so you always know what happens next.</p></div>
    <div className="process-grid">{STEPS.map(([k, t, d], i) => <motion.article key={k} className="process-card" {...rise(reduce, i * .09)}>
      <span className="process-num">{k}</span><h3>{t}</h3><p>{d}</p><i className="process-bar" aria-hidden="true"/>
    </motion.article>)}</div>
    <p className="process-note"><b>Cost and timeline</b> depend on the scope. After our first conversation you get a clear estimate in writing, before you commit to anything.</p>
  </section>
}

/* ---- Also offered (secondary services) ---- */
export function AlsoOffered({ items }) {
  if (!items?.length) return null
  return <div className="also-offered"><span className="also-label">ALSO OFFERED</span><div className="also-list">{items.map(s => <div key={s.title} className="also-item"><strong>{s.title}</strong><small>{s.desc}</small></div>)}</div></div>
}

/* ---- Skills in readable groups ---- */
const GROUPS = [
  ['Frontend', /react|next|javascript|html|css|tailwind|vue|typescript|ui/i],
  ['Backend', /php|laravel|node|api|express|python/i],
  ['Mobile', /flutter|dart|android|ios|kotlin|swift/i],
  ['Data', /sql|firebase|postgres|mongo|database/i],
  ['Tools & Growth', /git|figma|seo|photoshop|illustrator|canva|ads/i],
]
export function SkillGroups({ skills }) {
  const reduce = useReducedMotion()
  const buckets = GROUPS.map(([name]) => ({ name, items: [] })); const more = []
  skills.forEach(s => { const i = GROUPS.findIndex(([, re]) => re.test(s)); (i >= 0 ? buckets[i].items : more).push(s) })
  if (more.length) buckets.push({ name: 'More', items: more })
  let k = 0
  return <div className="skill-groups" aria-label="Skills">{buckets.filter(b => b.items.length).map(b => <div key={b.name} className="skill-group">
    <span className="skill-group-name">{b.name}</span>
    <div className="skill-chips">{b.items.map(s => <motion.span key={s} className="skill-chip" {...(reduce ? {} : { initial: { opacity: 0, scale: .7, y: 12 }, whileInView: { opacity: 1, scale: 1, y: 0 }, viewport: { once: true }, transition: { duration: .45, delay: (k++ % 8) * .05, ease: [.34, 1.56, .64, 1] } })}>{s}</motion.span>)}</div>
  </div>)}</div>
}

/* ---- FAQ ---- */
const FAQ = [
  ['How much does a project cost?', 'It depends on what you need. Tell me about your idea and I will send a clear estimate after a short conversation, with no obligation.'],
  ['How long will it take?', 'A simple website is much quicker than a full business system. I give you a realistic timeline in the plan before we start.'],
  ['Do you support the project after launch?', 'Yes. After launch I am available for fixes and updates, and we can agree on ongoing support if you need it.'],
  ['Who owns the code and the design?', 'Ownership is agreed in writing before work starts, so everyone knows exactly what they are getting.'],
  ['How do we get started?', 'Send a short message using the form below. Tell me what you want to build and I will reply to set up a first conversation.'],
]
export function Faq({ n }) {
  const [open, setOpen] = useState(0)
  const reduce = useReducedMotion()
  return <section id="faq" className="faq-section section-pad">
    <div className="section-top"><span className="section-kicker">{n} / GOOD TO KNOW</span><span className="section-side">QUESTIONS CLIENTS ASK</span></div>
    <div className="section-heading-row"><h2>Quick<br/><em>answers.</em></h2><p>The things most people want to know before they get in touch.</p></div>
    <div className="faq-list">{FAQ.map(([q, a], i) => <motion.div key={q} className={`faq-item ${open === i ? 'open' : ''}`} {...rise(reduce, i * .06)}>
      <button type="button" className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}><span>{q}</span><Plus size={20}/></button>
      <div className="faq-a"><div><p>{a}</p></div></div>
    </motion.div>)}</div>
  </section>
}

/* ---- Contact helpers ---- */
export function CvLink() {
  // Opens the built-in /cv page (src/cvData.js). If you also set SITE.cvUrl to a PDF, that file is downloaded instead.
  if (SITE.cvUrl) return <a className="text-link" href={SITE.cvUrl} download>Download CV <FileDown size={16}/></a>
  return <a className="text-link" href="/cv">View CV <FileDown size={16}/></a>
}
export function ContactExtras() {
  const wa = SITE.whatsapp.replace(/\D/g, '')
  return <div className="contact-extras">
    {SITE.replyPromise && <p className="reply-promise"><span className="status-dot"/> {SITE.replyPromise}</p>}
    {(wa || SITE.bookingUrl) && <div className="contact-quick">
      {wa && <a className="quick-btn wa" href={`https://wa.me/${wa}?text=${encodeURIComponent('Hi Umar, I found your portfolio and would like to talk about a project.')}`} target="_blank" rel="noreferrer"><MessageCircle size={17}/> Chat on WhatsApp <ArrowUpRight size={14}/></a>}
      {SITE.bookingUrl && <a className="quick-btn" href={SITE.bookingUrl} target="_blank" rel="noreferrer"><CalendarDays size={17}/> Book a call <ArrowUpRight size={14}/></a>}
    </div>}
  </div>
}
