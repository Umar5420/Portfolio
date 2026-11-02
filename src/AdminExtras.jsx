import { useMemo, useState } from 'react'
import { Check, Eye, EyeOff, ImagePlus, MessageSquare, Pencil, Plus, Trash2, X } from 'lucide-react'

/* Admin pages added in Phase 11: Gallery and Conversations.
   Both store their data inside the existing portfolio content JSON (keys `gallery` and `conversations`),
   so no new D1 migration is needed. */

const uid = () => (globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`)
const safeUrl = (v) => /^(https?:\/\/|\/(?!\/))/i.test((v || '').trim())
const titleFromUrl = (url) => {
  const last = decodeURIComponent((url.split('?')[0].split('/').pop() || 'Image'))
  return last.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim().replace(/^./, c => c.toUpperCase()) || 'Image'
}

function Heading({ eyebrow, title, desc }) {
  return <div className="admin-page-heading"><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div>
}

/* ------------------------------ Gallery ------------------------------ */
const emptyImage = { title: '', category: '', src: '', caption: '', status: 'Published' }

export function GalleryAdmin({ data, persist }) {
  const items = data.gallery || []
  const [form, setForm] = useState(emptyImage)
  const [editing, setEditing] = useState(null)
  const [bulk, setBulk] = useState('')
  const [bulkCategory, setBulkCategory] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const categories = useMemo(() => [...new Set(items.map(i => i.category).filter(Boolean))], [items])

  const save = async (next, message) => {
    setBusy(true)
    try { return await persist({ ...data, gallery: next }, message) } finally { setBusy(false) }
  }
  const submit = async (e) => {
    e.preventDefault(); setError('')
    if (!safeUrl(form.src)) { setError('Image URL must start with https:// or / (for example /images/photo.webp).'); return }
    const item = { ...form, title: form.title.trim() || titleFromUrl(form.src), src: form.src.trim(), category: form.category.trim(), caption: form.caption.trim() }
    const next = editing ? items.map(x => x.id === editing ? { ...x, ...item } : x) : [...items, { ...item, id: uid() }]
    if (await save(next, editing ? 'Image updated.' : 'Image added to the gallery.')) { setForm(emptyImage); setEditing(null) }
  }
  const addBulk = async () => {
    setError('')
    const urls = [...new Set(bulk.split(/\r?\n/).map(x => x.trim()).filter(Boolean))]
    const bad = urls.filter(u => !safeUrl(u))
    if (!urls.length) { setError('Paste at least one image URL.'); return }
    if (bad.length) { setError(`These do not look like valid URLs: ${bad.slice(0, 2).join(', ')}${bad.length > 2 ? '…' : ''}`); return }
    const added = urls.map(src => ({ id: uid(), src, title: titleFromUrl(src), category: bulkCategory.trim(), caption: '', status: 'Published' }))
    if (await save([...items, ...added], `${added.length} image${added.length > 1 ? 's' : ''} added.`)) { setBulk('') }
  }
  const edit = (item) => { setEditing(item.id); setForm({ ...emptyImage, ...item }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const remove = (id) => { if (window.confirm('Remove this image from the gallery?')) save(items.filter(x => x.id !== id), 'Image removed.') }
  const toggle = (item) => save(items.map(x => x.id === item.id ? { ...x, status: x.status === 'Hidden' ? 'Published' : 'Hidden' } : x), item.status === 'Hidden' ? 'Image is now visible.' : 'Image hidden from the public gallery.')

  return <>
    <Heading eyebrow="VISUAL STORY" title="Gallery" desc="Images shown in the public gallery section. Project cover and gallery images are included automatically; add anything extra here. Use https:// links or paths like /images/photo.webp."/>
    <form className="admin-panel phase10-workspace" onSubmit={submit}>
      <h2>{editing ? 'Edit image' : 'Add an image'}</h2>
      <label className="phase10-field">Image URL<input required value={form.src} onChange={e => setForm({ ...form, src: e.target.value })} placeholder="https://… or /images/photo.webp"/></label>
      <div className="ax-grid-2">
        <label className="phase10-field">Title<input maxLength="80" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Optional — taken from the file name"/></label>
        <label className="phase10-field">Category<input list="gallery-cats" maxLength="40" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Projects, Events, Design"/><datalist id="gallery-cats">{categories.map(c => <option key={c} value={c}/>)}</datalist></label>
      </div>
      <label className="phase10-field">Caption <span>(optional)</span><textarea rows="2" maxLength="240" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}/></label>
      <label className="phase10-field">Status<select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}><option>Published</option><option>Hidden</option></select></label>
      {error && <div className="ax-error" role="alert">{error}</div>}
      <div className="ax-actions"><button className="admin-primary-btn" disabled={busy}><ImagePlus size={15}/> {busy ? 'Saving…' : editing ? 'Save changes' : 'Add image'}</button>{editing && <button type="button" className="admin-secondary-btn" onClick={() => { setEditing(null); setForm(emptyImage) }}>Cancel edit</button>}</div>
    </form>

    <section className="admin-panel phase10-workspace" style={{ marginTop: 18 }}>
      <h2>Add many at once</h2>
      <label className="phase10-field">Image URLs <span>one per line</span><textarea rows="4" value={bulk} onChange={e => setBulk(e.target.value)} placeholder={'https://…/shot-1.webp\nhttps://…/shot-2.webp'}/></label>
      <label className="phase10-field">Category for all of them<input value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} placeholder="e.g. Projects"/></label>
      <div className="ax-actions"><button type="button" className="admin-secondary-btn" onClick={addBulk} disabled={busy}><Plus size={15}/> Add all</button></div>
    </section>

    <section className="admin-panel admin-table-panel" style={{ marginTop: 18 }}>
      <div className="admin-table-head"><span>GALLERY ({items.length})</span><span>STATUS / ACTIONS</span></div>
      {items.length === 0 && <p className="ax-empty">No custom images yet. Until you add some, the public gallery shows your project images and two portraits.</p>}
      {items.map(item => <div className="admin-record" key={item.id}>
        <img className="ax-thumb" src={item.src} alt="" loading="lazy" onError={e => { e.currentTarget.style.visibility = 'hidden' }}/>
        <div className="admin-record-copy"><strong>{item.title}</strong><small>{item.category || 'Uncategorised'} · {item.status || 'Published'}</small></div>
        <div className="admin-record-actions">
          <button onClick={() => toggle(item)} aria-label={item.status === 'Hidden' ? 'Show image' : 'Hide image'} title={item.status === 'Hidden' ? 'Show' : 'Hide'}>{item.status === 'Hidden' ? <Eye size={15}/> : <EyeOff size={15}/>}</button>
          <button onClick={() => edit(item)} aria-label="Edit image"><Pencil size={15}/></button>
          <button onClick={() => remove(item.id)} aria-label="Delete image"><Trash2 size={15}/></button>
        </div>
      </div>)}
    </section>
  </>
}

/* ---------------------------- Conversations ---------------------------- */
const emptyConvo = { client: '', role: '', project: '', approved: false, messages: [{ from: 'client', text: '' }] }

/** "Client: hi" / "Me: hello" lines → message objects. Lines without a prefix continue the previous message. */
function parseChat(text) {
  const out = []
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim(); if (!line) continue
    const m = line.match(/^(client|them|customer|me|umar|you)\s*[:\-–]\s*(.*)$/i)
    if (m) out.push({ from: /^(me|umar|you)$/i.test(m[1]) ? 'me' : 'client', text: m[2].trim() })
    else if (out.length) out[out.length - 1].text += ` ${line}`
    else out.push({ from: 'client', text: line })
  }
  return out.filter(x => x.text).slice(0, 40)
}

export function ConversationsAdmin({ data, persist }) {
  const items = data.conversations || []
  const [form, setForm] = useState(emptyConvo)
  const [editing, setEditing] = useState(null)
  const [paste, setPaste] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const save = async (next, message) => {
    setBusy(true)
    try { return await persist({ ...data, conversations: next }, message) } finally { setBusy(false) }
  }
  const setMsg = (i, patch) => setForm(f => ({ ...f, messages: f.messages.map((m, j) => j === i ? { ...m, ...patch } : m) }))
  const addMsg = (from) => setForm(f => f.messages.length >= 40 ? f : ({ ...f, messages: [...f.messages, { from, text: '' }] }))
  const delMsg = (i) => setForm(f => ({ ...f, messages: f.messages.filter((_, j) => j !== i) }))
  const importPaste = () => {
    const parsed = parseChat(paste)
    if (!parsed.length) { setError('Nothing to import. Start each line with "Client:" or "Me:".'); return }
    setError(''); setForm(f => ({ ...f, messages: parsed })); setPaste('')
  }
  const submit = async (e) => {
    e.preventDefault(); setError('')
    const messages = form.messages.map(m => ({ from: m.from === 'me' ? 'me' : 'client', text: m.text.trim().slice(0, 600) })).filter(m => m.text)
    if (!form.client.trim()) { setError('Add the client’s name (a first name or company is fine).'); return }
    if (!messages.length) { setError('Add at least one message.'); return }
    const item = { id: editing || uid(), client: form.client.trim(), role: form.role.trim(), project: form.project.trim(), approved: !!form.approved, messages }
    const next = editing ? items.map(x => x.id === editing ? item : x) : [...items, item]
    if (await save(next, editing ? 'Conversation updated.' : 'Conversation saved.')) { setForm(emptyConvo); setEditing(null) }
  }
  const edit = (c) => { setEditing(c.id); setForm({ ...emptyConvo, ...c, messages: c.messages?.length ? c.messages : emptyConvo.messages }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const remove = (id) => { if (window.confirm('Delete this conversation?')) save(items.filter(x => x.id !== id), 'Conversation deleted.') }
  const toggle = (c) => save(items.map(x => x.id === c.id ? { ...x, approved: !x.approved } : x), c.approved ? 'Conversation hidden from the public site.' : 'Conversation is now public.')

  return <>
    <Heading eyebrow="AFTER DELIVERY" title="Client conversations" desc="Real chat messages from clients after a project is finished. They appear as an animated chat on the public site, but only when ‘Publish’ is ticked."/>
    <form className="admin-panel phase10-workspace" onSubmit={submit}>
      <h2>{editing ? 'Edit conversation' : 'Add a conversation'}</h2>
      <div className="ax-grid-2">
        <label className="phase10-field">Client name<input required maxLength="60" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="e.g. Ahmed or Royal Landmark"/></label>
        <label className="phase10-field">Their role <span>(optional)</span><input maxLength="60" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="e.g. Business owner"/></label>
      </div>
      <label className="phase10-field">Project <span>(optional)</span><input maxLength="80" value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} placeholder="e.g. Property management system"/></label>

      <div className="ax-block">
        <div className="ax-block-head"><strong>Messages</strong><small>{form.messages.length}/40</small></div>
        {form.messages.map((m, i) => <div className={`ax-msg ${m.from === 'me' ? 'is-me' : ''}`} key={i}>
          <select value={m.from} onChange={e => setMsg(i, { from: e.target.value })} aria-label={`Message ${i + 1} sender`}><option value="client">Client</option><option value="me">Me</option></select>
          <textarea rows="2" maxLength="600" value={m.text} onChange={e => setMsg(i, { text: e.target.value })} placeholder={m.from === 'me' ? 'Your reply…' : 'What the client wrote…'} aria-label={`Message ${i + 1}`}/>
          <button type="button" onClick={() => delMsg(i)} aria-label={`Remove message ${i + 1}`} disabled={form.messages.length === 1}><X size={14}/></button>
        </div>)}
        <div className="ax-actions"><button type="button" className="admin-secondary-btn" onClick={() => addMsg('client')}><Plus size={14}/> Client message</button><button type="button" className="admin-secondary-btn" onClick={() => addMsg('me')}><Plus size={14}/> My reply</button></div>
      </div>

      <details className="ax-block">
        <summary>Paste a whole chat instead</summary>
        <label className="phase10-field">One message per line, starting with “Client:” or “Me:”<textarea rows="6" value={paste} onChange={e => setPaste(e.target.value)} placeholder={'Client: Assalam-o-Alaikum! The site looks great.\nMe: Wa Alaikum Assalam! Happy to hear that.'}/></label>
        <div className="ax-actions"><button type="button" className="admin-secondary-btn" onClick={importPaste}>Convert to messages</button></div>
      </details>

      <label className="ax-permission"><input type="checkbox" checked={!!form.approved} onChange={e => setForm({ ...form, approved: e.target.checked })}/> <span><strong>Publish on the website.</strong> I have the client’s permission to show this conversation. Leave unticked to keep it private.</span></label>
      {error && <div className="ax-error" role="alert">{error}</div>}
      <div className="ax-actions"><button className="admin-primary-btn" disabled={busy}><Check size={15}/> {busy ? 'Saving…' : editing ? 'Save changes' : 'Save conversation'}</button>{editing && <button type="button" className="admin-secondary-btn" onClick={() => { setEditing(null); setForm(emptyConvo) }}>Cancel edit</button>}</div>
    </form>

    <section className="admin-panel admin-table-panel" style={{ marginTop: 18 }}>
      <div className="admin-table-head"><span>CONVERSATIONS ({items.length})</span><span>STATUS / ACTIONS</span></div>
      {items.length === 0 && <p className="ax-empty">Nothing yet. The public section stays hidden until you publish at least one real conversation.</p>}
      {items.map(c => <div className="admin-record" key={c.id}>
        <div className="admin-record-icon"><MessageSquare size={19}/></div>
        <div className="admin-record-copy"><strong>{c.client}{c.project ? ` — ${c.project}` : ''}</strong><small>{c.messages?.length || 0} messages · {c.approved ? 'Public' : 'Private'}</small></div>
        <div className="admin-record-actions">
          <button onClick={() => toggle(c)} aria-label={c.approved ? 'Make private' : 'Publish'} title={c.approved ? 'Make private' : 'Publish'}>{c.approved ? <Eye size={15}/> : <EyeOff size={15}/>}</button>
          <button onClick={() => edit(c)} aria-label="Edit conversation"><Pencil size={15}/></button>
          <button onClick={() => remove(c.id)} aria-label="Delete conversation"><Trash2 size={15}/></button>
        </div>
      </div>)}
    </section>
  </>
}
