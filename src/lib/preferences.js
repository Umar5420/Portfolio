import { useCallback, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

/* Colour moods the visitor can pick. `colors` = [background, accent, ink] for the swatch preview. */
export const MOODS = [
  { id: 'light',   name: 'Light',   hint: 'Clean daylight',      colors: ['#f4f1ec', '#f05a38', '#1c1b1a'], dark: false },
  { id: 'dark',    name: 'Dark',    hint: 'Easy on the eyes',    colors: ['#111114', '#ff7655', '#f4f0e9'], dark: true },
  { id: 'morning', name: 'Morning', hint: 'Warm sunrise',        colors: ['#fff3e1', '#e0720f', '#2a1f14'], dark: false },
  { id: 'evening', name: 'Evening', hint: 'Dusk and amber',      colors: ['#1f1630', '#ff9a5c', '#fdeee3'], dark: true },
  { id: 'ocean',   name: 'Ocean',   hint: 'Cool blues',          colors: ['#e7f1fc', '#1f6bff', '#0e2038'], dark: false },
  { id: 'rose',    name: 'Rose',    hint: 'Soft pinks',          colors: ['#fdedf3', '#d62a67', '#3a1226'], dark: false },
  { id: 'violet',  name: 'Violet',  hint: 'Royal purples',       colors: ['#efeaff', '#7a45ff', '#1f1340'], dark: false },
  { id: 'aurora',  name: 'Aurora',  hint: 'Night-sky glow',      colors: ['#0a1020', '#3de6c4', '#e9f5ff'], dark: true },
]

export const STYLES = [
  { id: 'classic', name: 'Classic', hint: 'The original editorial look' },
  { id: 'glassy',  name: 'Glassy',  hint: 'Frosted, translucent layers' },
  { id: 'soft',    name: 'Soft',    hint: 'Rounded, gentle shadows' },
  { id: 'neon',    name: 'Neon',    hint: 'Sharp edges, glowing lines' },
  { id: 'futuristic', name: 'Futuristic', hint: 'Holographic depth and electric glow' },
]

export const VISUAL_DIRECTIONS = [
  { id: 'cinematic', name: 'Cinematic luxury', hint: 'Elegant, dark, premium' },
  { id: 'futuristic', name: 'Futuristic', hint: '3D, glowing effects, interactive' },
  { id: 'minimal', name: 'Minimal luxury', hint: 'Clean, calm, Apple-style' },
  { id: 'hybrid', name: 'Hybrid', hint: 'Cinematic + futuristic + minimal' },
]

export const MOTION_LEVELS = [
  { id: 'balanced', name: 'Balanced', hint: 'Premium and smooth' },
  { id: 'immersive', name: 'Immersive', hint: 'More interactive experiences' },
  { id: 'subtle', name: 'Subtle', hint: 'Elegant and lightweight' },
]

const MOOD_IDS = MOODS.map(m => m.id)
const STYLE_IDS = STYLES.map(s => s.id)
const KEYS = { mood: 'umar-theme', style: 'umar-style', ambient: 'umar-ambient', visual: 'umar-visual-direction', motion: 'umar-motion-level' }

const read = (key, fallback, allowed) => {
  try {
    const value = localStorage.getItem(key)
    return value && (!allowed || allowed.includes(value)) ? value : fallback
  } catch { return fallback }
}
const write = (key, value) => { try { localStorage.setItem(key, value) } catch { /* private mode */ } }

/** Time-of-day mood used by "Auto". */
export function moodForHour(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'light'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'dark'
}

/** Part of day used by the greeting. */
export function partOfDay(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}

const resolveMood = (mood) => (mood === 'auto' ? moodForHour() : mood)

function applyToDom({ mood, style, ambient, visual = 'futuristic', motion = 'immersive' }) {
  const root = document.documentElement
  const resolved = resolveMood(mood)
  root.dataset.theme = resolved
  root.dataset.style = style
  root.dataset.ambient = ambient ? 'on' : 'off'
  root.dataset.visual = visual
  root.dataset.motion = motion
  const meta = document.querySelector('meta[name="theme-color"]')
  const swatch = MOODS.find(m => m.id === resolved)
  if (meta && swatch) meta.setAttribute('content', swatch.colors[0])
}

export function usePreferences() {
  const [mood, setMoodState] = useState(() => read(KEYS.mood, 'dark', [...MOOD_IDS, 'auto']))
  const [style, setStyleState] = useState(() => read(KEYS.style, 'classic', STYLE_IDS))
  const [ambient, setAmbientState] = useState(() => read(KEYS.ambient, 'on') !== 'off')
  const [visual, setVisualState] = useState(() => read(KEYS.visual, 'futuristic', VISUAL_DIRECTIONS.map(x => x.id)))
  const [motion, setMotionState] = useState(() => read(KEYS.motion, 'immersive', MOTION_LEVELS.map(x => x.id)))
  const [, tick] = useState(0)

  useEffect(() => { applyToDom({ mood, style, ambient, visual, motion }) }, [mood, style, ambient, visual, motion ])
  useEffect(() => { write(KEYS.mood, mood) }, [mood])
  useEffect(() => { write(KEYS.style, style) }, [style])
  useEffect(() => { write(KEYS.ambient, ambient ? 'on' : 'off') }, [ambient])
  useEffect(() => { write(KEYS.visual, visual) }, [visual])
  useEffect(() => { write(KEYS.motion, motion) }, [motion])

  // "Auto" follows the clock.
  useEffect(() => {
    if (mood !== 'auto') return undefined
    const id = window.setInterval(() => { applyToDom({ mood, style, ambient, visual, motion }); tick(n => n + 1) }, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [mood, style, ambient, visual, motion])

  /** Runs a change inside a circular reveal that grows from the clicked control. */
  const withReveal = useCallback((event, next, commit) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) { commit(); return }
    const target = event?.currentTarget?.getBoundingClientRect?.()
    const x = event?.clientX || (target ? target.left + target.width / 2 : window.innerWidth / 2)
    const y = event?.clientY || (target ? target.top + target.height / 2 : window.innerHeight / 2)
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(() => {
      applyToDom(next)
      flushSync(commit)
    })
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' }
      )
    }).catch(() => {})
  }, [])

  const setMood = useCallback((value, event) => withReveal(event, { mood: value, style, ambient, visual, motion }, () => setMoodState(value)), [withReveal, style, ambient, visual, motion])
  const setStyle = useCallback((value, event) => withReveal(event, { mood, style: value, ambient, visual, motion }, () => setStyleState(value)), [withReveal, mood, ambient, visual, motion])
  const setAmbient = useCallback((value) => setAmbientState(value), [])
  const setVisual = useCallback((value) => setVisualState(value), [])
  const setMotion = useCallback((value) => setMotionState(value), [])
  const reset = useCallback((event) => withReveal(event, { mood: 'dark', style: 'classic', ambient: true, visual: 'futuristic', motion: 'immersive' }, () => { setMoodState('dark'); setStyleState('classic'); setAmbientState(true); setVisualState('futuristic'); setMotionState('immersive') }), [withReveal])

  const resolved = resolveMood(mood)
  const isDark = !!MOODS.find(m => m.id === resolved)?.dark
  /** Header quick toggle: flips between a light and a dark mood. */
  const quickToggle = useCallback((event) => setMood(isDark ? 'light' : 'dark', event), [isDark, setMood])

  return useMemo(
    () => ({ mood, resolved, style, ambient, visual, motion, isDark, setMood, setStyle, setAmbient, setVisual, setMotion, reset, quickToggle }),
    [mood, resolved, style, ambient, visual, motion, isDark, setMood, setStyle, setAmbient, setVisual, setMotion, reset, quickToggle]
  )
}
