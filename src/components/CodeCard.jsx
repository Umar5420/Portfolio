import { useEffect, useRef, useState } from 'react'
import { Play } from 'lucide-react'

const TABS = [
  { id: 'js', label: 'JavaScript', file: 'lesson.js', code: "const topics = ['variables', 'loops', 'functions']\n\ntopics.forEach((t, i) => {\n  console.log(`Lesson ${i + 1}: ${t}`)\n})", out: ['Lesson 1: variables', 'Lesson 2: loops', 'Lesson 3: functions'] },
  { id: 'py', label: 'Python', file: 'lesson.py', code: 'topics = ["variables", "loops", "functions"]\n\nfor i, t in enumerate(topics, 1):\n    print(f"Lesson {i}: {t}")', out: ['Lesson 1: variables', 'Lesson 2: loops', 'Lesson 3: functions'] },
  { id: 'sql', label: 'SQL', file: 'top_scores.sql', code: 'SELECT name, score\nFROM students\nORDER BY score DESC\nLIMIT 3;', out: ['name        | score', 'Student A   | 96', 'Student B   | 91', 'Student C   | 88', '(sample data)'] },
]
const TOKEN = /(\/\/.*|#.*)|(`[^`]*`|"[^"]*"|'[^']*')|\b(const|for|in|forEach|console|log|print|enumerate|SELECT|FROM|ORDER BY|DESC|LIMIT)\b|(\b\d+\b)/g
function highlight(code) {
  const out = []; let last = 0, k = 0
  for (const m of code.matchAll(TOKEN)) {
    if (m.index > last) out.push(code.slice(last, m.index))
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n'
    out.push(<i key={k++} className={`tk-${cls}`}>{m[0]}</i>)
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(code.slice(last))
  return out
}

/* Teaching demo: types a snippet, then "runs" it. Output is pre-written, nothing is executed. */
export function CodeCard() {
  const [tab, setTab] = useState(0)
  const [n, setN] = useState(0)
  const [lines, setLines] = useState(0)
  const [seen, setSeen] = useState(false)
  const rootRef = useRef(null)
  const t = TABS[tab]
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const el = rootRef.current
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: .35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    setLines(0)
    if (!seen) return
    if (reduced) { setN(t.code.length); return }
    setN(0)
    const id = setInterval(() => setN(v => { if (v >= t.code.length) { clearInterval(id); return v } return v + 1 }), 26)
    return () => clearInterval(id)
  }, [seen, tab])

  const run = () => {
    setN(t.code.length); setLines(0)
    t.out.forEach((_, i) => setTimeout(() => setLines(i + 1), reduced ? 0 : 320 * (i + 1)))
  }
  const done = n >= t.code.length

  return <div className="codecard" ref={rootRef}>
    <div className="codecard-label"><span>TRY IT</span><span>LIVE FROM THE CLASSROOM</span></div>
    <div className="codecard-win">
      <div className="codecard-bar"><i/><i/><i/>
        <div className="codecard-tabs" role="tablist">{TABS.map((x, i) => <button key={x.id} type="button" role="tab" aria-selected={i === tab} className={i === tab ? 'on' : ''} onClick={() => setTab(i)}>{x.label}</button>)}</div>
        <span className="codecard-file">{t.file}</span>
      </div>
      <pre className="codecard-code" aria-label={`${t.label} example`}>{highlight(t.code.slice(0, n))}{!done && <span className="codecard-caret"/>}</pre>
      <div className="codecard-run">
        <button type="button" onClick={run} disabled={!seen}><Play size={13}/> Run</button>
        <div className="codecard-out" aria-live="polite">{lines === 0 ? <span className="dim">Press Run to see the output</span> : t.out.slice(0, lines).map((l, i) => <div key={i}>{l}</div>)}</div>
      </div>
    </div>
  </div>
}
