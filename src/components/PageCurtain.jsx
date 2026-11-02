import { useEffect, useRef } from 'react'

/* Wipes a dark curtain across the screen when moving between pages (home ↔ case study ↔ CV),
   then lifts it on the new page. Skipped for reduced-motion, new tabs, modifier clicks and the admin. */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
export function PageCurtain() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const root = document.documentElement
    let covered = false
    try { covered = sessionStorage.getItem('curtain') === '1'; sessionStorage.removeItem('curtain') } catch { /* private mode */ }
    if (covered && !reduced()) {
      el.classList.add('cover', 'instant')
      root.classList.remove('curtain-pending')
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove('instant')
        el.classList.add('open')
        setTimeout(() => el.classList.remove('cover', 'open'), 900)
      }))
    } else root.classList.remove('curtain-pending')

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduced()) return
      const a = e.target.closest?.('a[href]')
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      let u; try { u = new URL(a.href, window.location.href) } catch { return }
      if (u.origin !== window.location.origin || u.pathname === window.location.pathname || u.pathname.startsWith('/admin')) return
      e.preventDefault()
      try { sessionStorage.setItem('curtain', '1') } catch { /* ignore */ }
      el.classList.remove('open'); el.classList.add('cover')
      setTimeout(() => window.location.assign(a.href), 560)
    }
    // Back/forward cache can restore the page while the curtain is down.
    const onShow = (e) => { if (e.persisted) el.classList.remove('cover', 'open', 'instant') }
    document.addEventListener('click', onClick)
    window.addEventListener('pageshow', onShow)
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('pageshow', onShow) }
  }, [])
  return <div className="curtain" ref={ref} aria-hidden="true"><i/><i/><i/><i/><i/><span>u<b>.</b></span></div>
}
