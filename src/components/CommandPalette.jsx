import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, CornerDownLeft, Command } from 'lucide-react'

const go = (sel) => () => document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' })

/* Ctrl/⌘ + K opens a quick-jump menu. Also opened by the header button. */
export function CommandPalette({ open, setOpen, toggleTheme, isDark }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const items = useMemo(() => [
    { label: 'About me', hint: 'Section', words: 'bio who', run: go('#about') },
    { label: 'Teaching', hint: 'Section', words: 'teach courses coaching instructor learn', run: go('#teach') },
    { label: 'Services', hint: 'Section', words: 'what i do web mobile python automation', run: go('#services') },
    { label: 'Plan a project', hint: 'Estimator', words: 'estimate quote brief price', run: go('#estimate') },
    { label: 'Selected work', hint: 'Section', words: 'projects portfolio case studies', run: go('#work') },
    { label: 'Skills & tech', hint: 'Section', words: 'stack python react flutter php', run: go('#skills') },
    { label: 'Journey', hint: 'Section', words: 'experience timeline', run: go('#journey') },
    { label: 'FAQ', hint: 'Section', words: 'questions help', run: go('#faq') },
    { label: 'Hire me / contact', hint: 'Section', words: 'contact email inquiry hire talk', run: go('#contact') },
    { label: 'View my CV', hint: 'Page', words: 'resume cv pdf print', run: () => { window.location.href = '/cv' } },
    { label: 'LinkedIn', hint: 'External', words: 'linkedin social', run: () => window.open('https://www.linkedin.com/in/umar-sadiq-a6009122b/', '_blank', 'noopener') },
    { label: isDark ? 'Switch to light mode' : 'Switch to dark mode', hint: 'Theme', words: 'theme dark light mood', run: () => toggleTheme() },
    { label: 'Back to top', hint: 'Action', words: 'top start', run: go('#top') },
  ], [isDark, toggleTheme])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? items.filter(i => (i.label + ' ' + i.words).toLowerCase().includes(s)) : items
  }, [q, items])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen(v => !v) }
      else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen])

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30) } }, [open])
  useEffect(() => { setIdx(0) }, [q])
  useEffect(() => { listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' }) }, [idx])

  const choose = (item) => { if (!item) return; setOpen(false); setTimeout(item.run, 140) }
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(results.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[idx]) }
  }

  if (!open) return null
  return <div className="cmdk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
    <div className="cmdk" role="dialog" aria-modal="true" aria-label="Quick menu">
      <div className="cmdk-input"><Search size={17}/><input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKeyDown} placeholder="Jump to… try “teach” or “cv”" aria-label="Search the site" autoComplete="off" spellCheck="false"/><kbd>Esc</kbd></div>
      <ul className="cmdk-list" ref={listRef} role="listbox" data-lenis-prevent>
        {results.length === 0 && <li className="cmdk-empty">No matches. Try “work” or “contact”.</li>}
        {results.map((it, i) => <li key={it.label} role="option" aria-selected={i === idx} className={i === idx ? 'on' : ''} onMouseEnter={() => setIdx(i)} onClick={() => choose(it)}><span>{it.label}</span><small>{it.hint}</small>{i === idx && <CornerDownLeft size={14}/>}</li>)}
      </ul>
      <div className="cmdk-foot"><span><Command size={11}/> K to open</span><span>↑↓ to move · Enter to go</span></div>
    </div>
  </div>
}
