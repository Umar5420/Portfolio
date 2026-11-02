import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Palette, RotateCcw, Sparkles, Wand2, X } from 'lucide-react'
import { MOODS, STYLES, VISUAL_DIRECTIONS, MOTION_LEVELS, moodForHour } from '../lib/preferences'

/** Floating "make it yours" panel: colour mood, surface style and ambient glow. */
export default function ThemeStudio({ prefs, open, setOpen }) {
  const reduce = useReducedMotion()
  const panelRef = useRef(null)
  const autoMood = MOODS.find(m => m.id === moodForHour())

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target) && !e.target.closest('[data-studio-trigger]')) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    panelRef.current?.querySelector('button')?.focus({ preventScroll: true })
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('pointerdown', onDown) }
  }, [open, setOpen])

  return <>
    <button className={`studio-fab ${open ? 'is-open' : ''}`} data-studio-trigger onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="theme-studio" aria-label={open ? 'Close theme studio' : 'Open theme studio'}>
      <span className="studio-fab-icon">{open ? <X size={16}/> : <Palette size={16}/>}</span>
      <span className="studio-fab-label">Themes</span>
    </button>
    <AnimatePresence>
      {open && <motion.div
        id="theme-studio" ref={panelRef} role="dialog" aria-label="Theme studio" className="studio-panel"
        initial={reduce ? false : { opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, scale: .97 }} transition={{ duration: .32, ease: [.22, 1, .36, 1] }}>
        <div className="studio-head">
          <div><span>MAKE IT YOURS</span><h3>Theme studio</h3></div>
          <button className="studio-reset" onClick={prefs.reset} title="Reset to defaults"><RotateCcw size={14}/> Reset</button>
        </div>

        <div className="studio-block">
          <div className="studio-label">MOOD <small>colours for every time of day</small></div>
          <div className="studio-moods" role="radiogroup" aria-label="Colour mood">
            <button role="radio" aria-checked={prefs.mood === 'auto'} className={`mood-tile mood-auto ${prefs.mood === 'auto' ? 'active' : ''}`} onClick={(e) => prefs.setMood('auto', e)}>
              <span className="mood-swatch auto-swatch" style={{ '--sw-bg': autoMood.colors[0], '--sw-accent': autoMood.colors[1] }}><Wand2 size={15}/></span>
              <b>Auto</b><small>Follows your clock</small>
              {prefs.mood === 'auto' && <Check className="mood-check" size={13}/>}
            </button>
            {MOODS.map(m => <button key={m.id} role="radio" aria-checked={prefs.mood === m.id} className={`mood-tile ${prefs.mood === m.id ? 'active' : ''}`} onClick={(e) => prefs.setMood(m.id, e)}>
              <span className="mood-swatch" style={{ '--sw-bg': m.colors[0], '--sw-accent': m.colors[1], '--sw-ink': m.colors[2] }}><i/><i/></span>
              <b>{m.name}</b><small>{m.hint}</small>
              {prefs.mood === m.id && <Check className="mood-check" size={13}/>}
            </button>)}
          </div>
        </div>

        <div className="studio-block">
          <div className="studio-label">STYLE <small>how the surfaces feel</small></div>
          <div className="studio-styles" role="radiogroup" aria-label="Surface style">
            {STYLES.map(s => <button key={s.id} role="radio" aria-checked={prefs.style === s.id} className={`style-tile style-${s.id} ${prefs.style === s.id ? 'active' : ''}`} onClick={(e) => prefs.setStyle(s.id, e)}>
              <span className="style-preview"><i/><i/></span>
              <span><b>{s.name}</b><small>{s.hint}</small></span>
              {prefs.style === s.id && <Check size={14}/>}
            </button>)}
          </div>
        </div>

        <div className="studio-block">
          <div className="studio-label">VISUAL DIRECTION <small>choose the overall atmosphere</small></div>
          <div className="studio-directions" role="radiogroup" aria-label="Visual direction">
            {VISUAL_DIRECTIONS.map(v => <button key={v.id} role="radio" aria-checked={prefs.visual === v.id} className={`direction-tile direction-${v.id} ${prefs.visual === v.id ? 'active' : ''}`} onClick={() => prefs.setVisual(v.id)}>
              <span className="direction-orb" aria-hidden="true"/><span><b>{v.name}</b><small>{v.hint}</small></span>{prefs.visual === v.id && <Check size={14}/>}
            </button>)}
          </div>
        </div>

        <div className="studio-block">
          <div className="studio-label">ANIMATION INTENSITY <small>control the motion experience</small></div>
          <div className="studio-motion" role="radiogroup" aria-label="Animation intensity">
            {MOTION_LEVELS.map(m => <button key={m.id} role="radio" aria-checked={prefs.motion === m.id} className={`motion-tile motion-${m.id} ${prefs.motion === m.id ? 'active' : ''}`} onClick={() => prefs.setMotion(m.id)}>
              <span className="motion-glyph" aria-hidden="true">{m.id === 'balanced' ? '〰' : m.id === 'immersive' ? '✧' : '·'}</span><span><b>{m.name}</b><small>{m.hint}</small></span>{prefs.motion === m.id && <Check size={14}/>}
            </button>)}
          </div>
        </div>

        <label className="studio-toggle">
          <span><Sparkles size={14}/> Ambient glow <small>Slow-moving colour behind the page</small></span>
          <input type="checkbox" checked={prefs.ambient} onChange={(e) => prefs.setAmbient(e.target.checked)}/>
          <i aria-hidden="true"/>
        </label>
        <p className="studio-note">Your mood, style, visual direction and motion preference are saved on this device.</p>
      </motion.div>}
    </AnimatePresence>
  </>
}
