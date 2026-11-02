/* A slowly turning 3D ring of skills. Decorative (the grouped list below is the accessible version). */
export function SkillOrbit({ skills }) {
  const list = (skills || []).slice(0, 10)
  const n = list.length
  if (n < 4) return null
  return <div className="orbit-wrap" aria-hidden="true">
    <div className="orbit-scene">
      <div className="orbit-core">u<span>.</span></div>
      <div className="orbit-ring">
        {list.map((s, i) => <span key={s} className="orbit-chip" style={{ '--a': `${(360 / n) * i}deg` }}><b>{s}</b></span>)}
      </div>
    </div>
    <small className="orbit-hint">HOVER TO PAUSE</small>
  </div>
}
