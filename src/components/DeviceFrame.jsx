import { useRef, useState } from 'react'

/* Mouse-only 3D tilt with a moving light glare. Touch and reduced-motion users get a still frame. */
export function Tilt({ children, max = 9, className = '' }) {
  const ref = useRef(null)
  const ok = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const move = (e) => {
    const el = ref.current; if (!el || !ok()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${((x - .5) * 2 * max).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-(y - .5) * 2 * max).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
  }
  const leave = () => { const el = ref.current; if (!el) return; ['--rx', '--ry'].forEach(k => el.style.setProperty(k, '0deg')) }
  return <div className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave}><div className="tilt-in" ref={ref}>{children}</div></div>
}

export function Laptop({ src, alt }) {
  return <div className="dev-laptop">
    <div className="dev-lid"><span className="dev-cam"/><img src={src} alt={alt} loading="lazy" decoding="async"/></div>
    <div className="dev-base"/>
  </div>
}

export function Phone({ src, alt }) {
  return <div className="dev-phone"><span className="dev-notch"/><img src={src} alt={alt} loading="lazy" decoding="async"/></div>
}

/* Picks a phone frame for portrait screenshots and a browser frame for wide ones. */
export function Shot({ src, alt }) {
  const [portrait, setPortrait] = useState(null)
  const onLoad = (e) => setPortrait(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth > 1.15)
  return <Tilt className={portrait ? 'shot-phone' : 'shot-browser'}>
    {portrait
      ? <Phone src={src} alt={alt}/>
      : <div className="dev-browser"><div className="dev-browser-bar"><i/><i/><i/></div><img src={src} alt={alt} loading="lazy" decoding="async" onLoad={onLoad}/></div>}
  </Tilt>
}
