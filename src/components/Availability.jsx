/* Live availability badge. Set it in Admin → Profile (status + optional note). */
const STATES = {
  open: { label: 'Taking new projects', tone: 'ok' },
  limited: { label: 'Limited availability', tone: 'warn' },
  busy: { label: 'Fully booked right now', tone: 'busy' },
}
export function availabilityInfo(profile) {
  const key = profile?.availability || 'open'
  if (key === 'hidden' || !STATES[key]) return null
  return { key, ...STATES[key], note: (profile?.availabilityNote || '').trim().slice(0, 80) }
}
export function AvailabilityBadge({ profile }) {
  const info = availabilityInfo(profile)
  if (!info) return null
  return <a className={`avail-badge ${info.tone}`} href="#contact" aria-label={`${info.label}. ${info.note}`}>
    <i aria-hidden="true"/><strong>{info.label}</strong>{info.note && <span>{info.note}</span>}
  </a>
}
