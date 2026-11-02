import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'

const ARTS = ['art-tall', 'art-square', 'art-wide']

function Visual({ item, index, big = false }) {
  if (item.src) return <img src={item.src} alt={item.title || 'Gallery image'} loading={big ? 'eager' : 'lazy'} decoding="async" draggable={false}/>
  return <div className={`gallery-art ${item.tone || 'peach'} ${big ? 'art-big' : ARTS[index % ARTS.length]}`}><span>{item.mark || (item.title || '·').slice(0, 2).toUpperCase()}</span></div>
}

/** Masonry gallery with category filters and a keyboard / swipe friendly lightbox. */
export default function Gallery({ items }) {
  const reduce = useReducedMotion()
  const [category, setCategory] = useState('All')
  const [open, setOpen] = useState(-1)
  const [dir, setDir] = useState(1)
  const opener = useRef(null)

  const categories = useMemo(() => ['All', ...new Set(items.map(i => i.category).filter(Boolean))], [items])
  const visible = useMemo(() => items.filter(i => category === 'All' || i.category === category), [items, category])
  useEffect(() => { if (!categories.includes(category)) setCategory('All') }, [categories, category])

  const close = useCallback(() => { setOpen(-1); opener.current?.focus?.() }, [])
  const go = useCallback((step) => { setDir(step); setOpen(i => (i + step + visible.length) % visible.length) }, [visible.length])

  useEffect(() => {
    if (open < 0) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, close, go])

  const current = open >= 0 ? visible[open] : null

  return <>
    <div className="gallery-filters" role="tablist" aria-label="Filter gallery">
      {categories.map(c => <button key={c} role="tab" aria-selected={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}{c === 'All' && <small>{items.length}</small>}</button>)}
    </div>
    {/* keyed by category so items re-enter with a stagger whenever the filter changes */}
    <div className="gallery-grid" key={category}>
      {visible.map((item, i) => <motion.button
        key={item.id} className="gallery-item" aria-label={`Open ${item.title || 'image'}`}
        initial={reduce ? false : { opacity: 0, scale: .92, y: 24 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: .12 }}
        transition={{ duration: .55, delay: Math.min(i % 6, 5) * .06, ease: [.22, 1, .36, 1] }}
        onClick={(e) => { opener.current = e.currentTarget; setDir(1); setOpen(i) }}>
        <Visual item={item} index={i}/>
        <span className="gallery-cap"><span><small>{item.category || 'Gallery'}</small><b>{item.title}</b></span><Expand size={16}/></span>
      </motion.button>)}
    </div>

    <AnimatePresence>
      {current && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label={current.title || 'Image viewer'}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}
        onClick={(e) => { if (e.target === e.currentTarget) close() }}>
        <button className="lightbox-btn lightbox-close" onClick={close} aria-label="Close" autoFocus><X size={20}/></button>
        {visible.length > 1 && <>
          <button className="lightbox-btn lightbox-prev" onClick={() => go(-1)} aria-label="Previous image"><ChevronLeft size={22}/></button>
          <button className="lightbox-btn lightbox-next" onClick={() => go(1)} aria-label="Next image"><ChevronRight size={22}/></button>
        </>}
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.figure key={current.id} className="lightbox-figure" custom={dir}
            initial={reduce ? false : { opacity: 0, x: dir * 70, scale: .96 }} animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -70, scale: .96 }} transition={{ duration: .3, ease: [.22, 1, .36, 1] }}
            drag={visible.length > 1 ? 'x' : false} dragConstraints={{ left: 0, right: 0 }} dragElastic={.35}
            onDragEnd={(_, info) => { if (info.offset.x < -80) go(1); else if (info.offset.x > 80) go(-1) }}>
            <Visual item={current} index={open} big/>
            <figcaption><span>{current.category || 'Gallery'} · {open + 1} / {visible.length}</span><strong>{current.title}</strong>{current.caption && <p>{current.caption}</p>}</figcaption>
          </motion.figure>
        </AnimatePresence>
      </motion.div>}
    </AnimatePresence>
  </>
}
