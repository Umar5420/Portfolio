import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, GraduationCap } from 'lucide-react'
import { CV } from '../cvData'
import { CodeCard } from './CodeCard'

export function Teach({ n, onCoach }) {
  const reduce = useReducedMotion()
  const rise = (d = 0) => reduce ? {} : { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .7, delay: d, ease: [.22, 1, .36, 1] } }
  return <section id="teach" className="teach-section section-pad">
    <div className="section-top"><span className="section-kicker">{n} / TEACHING</span><span className="section-side">CODE I BUILD. CODE I TEACH.</span></div>
    <div className="section-heading-row"><h2>I build it.<br/><em>I teach it.</em></h2><p>Alongside client work I teach programming, databases and web development, online and in the lab. Teaching keeps my own work clear, and my work keeps my lessons real.</p></div>
    <div className="teach-grid">
      <div className="teach-methods">
        {CV.methods.map(([t, d], i) => <motion.article className="teach-card" key={t} {...rise(i * .08)}><span>0{i + 1}</span><h3>{t}</h3><p>{d}</p></motion.article>)}
      </div>
      <motion.aside className="teach-side" {...rise(.1)}>
        <div className="teach-now"><GraduationCap size={26}/><div><small>CURRENTLY</small><strong>CS &amp; IT Instructor</strong><em>Info Tech Institute · 2022 – present</em></div></div>
        <small className="teach-label">WHAT I TEACH</small>
        <div className="teach-chips">{CV.domains.map(d => <span key={d}>{d}</span>)}</div>
        <div className="teach-actions">
          <button type="button" className="button-primary" onClick={onCoach}>Ask about coaching <ArrowUpRight size={17}/></button>
          <a className="text-link" href="/cv">Read my full CV <ArrowUpRight size={16}/></a>
        </div>
      </motion.aside>
    </div>
    <CodeCard/>
  </section>
}
