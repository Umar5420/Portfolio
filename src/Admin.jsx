import { useEffect, useMemo, useState } from 'react'
import { LayoutDashboard, FolderKanban, BriefcaseBusiness, Wrench, UserRound, ExternalLink, Plus, Search, Pencil, Trash2, Download, Upload, LogOut, Menu, X, Check, AlertCircle, LockKeyhole, LoaderCircle, MessageSquare, RefreshCw, Palette, BookOpen, Star, BarChart3, Images, MessagesSquare } from 'lucide-react'
import { GalleryAdmin, ConversationsAdmin } from './AdminExtras'
import './admin.css'
import { api } from './lib/api'

const initial = {
  profile: { name: 'Umar Sadiq', role: 'Software Engineer & Digital Creative', email: 'info@adsondigitals.com', location: 'Pakistan · Worldwide', intro: 'I build useful products, thoughtful experiences and bold digital identities.' },
  projects: [], services: [], skills: []
}

export default function Admin() {
  useEffect(() => {
    document.title = 'Admin Dashboard | Umar Sadiq Portfolio'
    let robots = document.head.querySelector('meta[name="robots"]')
    if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
    robots.content = 'noindex,nofollow,noarchive'
    return () => { robots.content = 'noindex,nofollow,noarchive' }
  }, [])
  const [data, setData] = useState(initial)
  const [page, setPage] = useState('Overview')
  const [query, setQuery] = useState('')
  const [modal, setModal] = useState(null)
  const [notice, setNotice] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [profileDraft, setProfileDraft] = useState(initial.profile)
  const [inquiries, setInquiries] = useState([])
  const [inquiryLoading, setInquiryLoading] = useState(false)
  const [inquiryFilter, setInquiryFilter] = useState('All')

  const flash = (msg) => { setNotice(msg); window.setTimeout(() => setNotice(''), 3000) }
  const loadContent = async () => {
    setLoading(true)
    try {
      const result = await api.getContent()
      const merged = { ...initial, ...result, profile: { ...initial.profile, ...(result.profile || {}) }, projects: Array.isArray(result.projects) ? result.projects : [], services: Array.isArray(result.services) ? result.services : [], skills: Array.isArray(result.skills) ? result.skills : [] }
      setData(merged)
      setProfileDraft(merged.profile)
    } catch (error) { flash(error.message || 'Could not load portfolio content.') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    let active = true
    api.me().then(async result => {
      if (!active) return
      if (result.authenticated) { setAuthenticated(true); await loadContent() }
    }).catch(() => {}).finally(() => { if (active) setCheckingAuth(false) })
    return () => { active = false }
  }, [])

  const login = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await api.login(password)
      const check = await api.me()
      if (!check.authenticated) throw new Error('Login was not confirmed. Check the session cookie and API proxy.')
      setAuthenticated(true); setPassword(''); await loadContent(); flash('Connected to your portfolio database.')
    } catch (error) { flash(error.message || 'Login failed.') }
    finally { setLoading(false) }
  }

  const persist = async (nextData, successMessage = 'Changes saved to the database.') => {
    if (saving) return false
    setSaving(true)
    try {
      await api.saveContent(nextData)
      setData(nextData)
      setProfileDraft(nextData.profile)
      flash(successMessage)
      return true
    } catch (error) { flash(error.message || 'Could not save changes.'); return false }
    finally { setSaving(false) }
  }

  const update = async (key, value) => {
    const next = { ...data, [key]: value }
    await persist(next)
  }
  const saveProfile = async () => { await persist({ ...data, profile: profileDraft }, 'Profile updated in the database.') }
  const saveItem = async (item) => {
    const key = modal.type === 'project' ? 'projects' : 'services'
    const recordId = modal.item?.id || `${key}-${Date.now()}`
    const normalized = { ...item, id: recordId, ...(modal.type === 'project' ? { slug: item.slug || `${(item.name || 'project').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${String(recordId).slice(-5)}` } : {}) }
    const nextItems = modal.item?.id ? data[key].map(x => x.id === modal.item.id ? normalized : x) : [...data[key], normalized]
    const ok = await persist({ ...data, [key]: nextItems })
    if (ok) setModal(null)
  }
  const removeItem = async (key, id) => {
    if (!window.confirm('Delete this item from the live portfolio?')) return
    await update(key, data[key].filter(x => x.id !== id))
  }
  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'umar-portfolio-content.json'; a.click(); URL.revokeObjectURL(url)
    flash('Content backup downloaded.')
  }
  const importData = (event) => {
    const file = event.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result)
        if (!parsed.profile || !Array.isArray(parsed.projects) || !Array.isArray(parsed.services) || !Array.isArray(parsed.skills)) throw new Error('Invalid portfolio backup structure.')
        await persist({ ...initial, ...parsed }, 'Backup imported into the database.')
      } catch (error) { flash(error.message || 'Invalid portfolio JSON file.') }
    }
    reader.readAsText(file); event.target.value = ''
  }
  const loadInquiries = async () => { setInquiryLoading(true); try { const result = await api.getInquiries(); setInquiries(result.inquiries || []) } catch (error) { flash(error.message || 'Could not load inquiries.') } finally { setInquiryLoading(false) } }
  const saveInquiry = async (item, status, notes) => { try { await api.updateInquiry(item.id, { status, notes }); await loadInquiries(); flash('Inquiry updated.') } catch (error) { flash(error.message || 'Could not update inquiry.') } }
  const exportInquiries = () => { const cols=['created_at','name','email','phone','service','budget','message','status','notes']; const csv=[cols.join(','),...inquiries.map(x=>cols.map(k=>'"'+String(x[k]??'').replace(/"/g,'""')+'"').join(','))].join('\r\n'); const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})); const a=document.createElement('a');a.href=url;a.download='umar-portfolio-inquiries.csv';a.click();URL.revokeObjectURL(url) }
  const signOut = async () => {
    try { await api.logout() } catch (error) { flash(error.message || 'Logout request failed.') }
    setAuthenticated(false); setData(initial); window.location.href = '/admin'
  }

  const total = data.projects.length + data.services.length + data.skills.length
  const nav = [{ label: 'Overview', icon: LayoutDashboard }, { label: 'Projects', icon: FolderKanban }, { label: 'Services', icon: BriefcaseBusiness }, { label: 'Skills', icon: Wrench }, { label: 'Profile', icon: UserRound }, { label: 'Inquiries', icon: MessageSquare }, { label: 'Design Studio', icon: Palette }, { label: 'Blog', icon: BookOpen }, { label: 'Gallery', icon: Images }, { label: 'Conversations', icon: MessagesSquare }, { label: 'Testimonials', icon: Star }, { label: 'Analytics', icon: BarChart3 }]
  const filtered = useMemo(() => (data[page.toLowerCase()] || []).filter(x => JSON.stringify(x).toLowerCase().includes(query.toLowerCase())), [data, page, query])

  if (checkingAuth) return <div style={screenStyle}><LoaderCircle className="spin"/><p>Checking admin session…</p></div>
  if (!authenticated) return <div style={screenStyle}><form onSubmit={login} style={loginCard}><div style={{fontSize:12,letterSpacing:2,color:'#f05a38',fontWeight:700}}>UMAR SADIQ · PORTFOLIO CMS</div><LockKeyhole size={30}/><h1 style={{margin:'8px 0'}}>Admin login</h1><p style={{color:'#777',fontSize:13}}>Sign in to manage your live portfolio content.</p><input autoFocus type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password" required style={loginInput}/><button className="admin-primary-btn" disabled={loading} style={{width:'100%',padding:13,marginTop:12}}>{loading ? 'Connecting…' : 'Sign in'}</button>{notice && <p role="alert" style={{color:'#c43d2a',fontSize:12}}>{notice}</p>}<a href="/" style={{display:'inline-block',marginTop:20,color:'#777',fontSize:12}}>← Back to portfolio</a></form></div>

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${mobileNav ? 'mobile-open' : ''}`}>
      <a className="admin-brand" href="/"><span>u<span>.</span></span><div>UMAR SADIQ<small>PORTFOLIO CMS</small></div></a>
      <div className="admin-side-label">WORKSPACE</div>
      <nav>{nav.map(({ label, icon: Icon }) => <button key={label} className={page === label ? 'active' : ''} onClick={() => { setPage(label); setMobileNav(false); setQuery(''); if(label === 'Inquiries') loadInquiries() }}><Icon size={17}/>{label}{label === 'Projects' && <small>{data.projects.length}</small>}</button>)}</nav>
      <div className="admin-sidebar-bottom"><div className="admin-online"><i/> DATABASE CONNECTED</div><button onClick={signOut}><LogOut size={16}/> Sign out</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-mobile-menu" onClick={() => setMobileNav(v => !v)}>{mobileNav ? <X/> : <Menu/>}</button><div><span>WORKSPACE /</span> {page.toUpperCase()}</div><div className="admin-top-actions"><a href="/" target="_blank" rel="noreferrer"><ExternalLink size={15}/> View website</a><div className="admin-avatar">US</div></div></header>
      <div className="admin-content">
        {loading && <p style={{fontSize:12,color:'#777'}}>Syncing with database…</p>}
        {page === 'Gallery' ? <GalleryAdmin data={data} persist={persist}/> : page === 'Conversations' ? <ConversationsAdmin data={data} persist={persist}/> : ['Design Studio','Blog','Testimonials','Analytics'].includes(page) ? <Phase10Workspace page={page} data={data} persist={persist}/> : page === 'Inquiries' ? <InquiriesPage inquiries={inquiries} loading={inquiryLoading} filter={inquiryFilter} setFilter={setInquiryFilter} reload={loadInquiries} saveInquiry={saveInquiry} exportInquiries={exportInquiries}/> : page === 'Overview' ? <>
          <div className="admin-welcome"><div><span className="admin-eyebrow">YOUR DIGITAL CONTROL ROOM</span><h1>Good to see you,<br/><em>Umar.</em></h1><p>Manage the content that shapes your professional presence.</p></div><div className="admin-welcome-mark">US<span>®</span></div></div>
          <div className="admin-stat-grid"><Stat title="PROJECTS" value={data.projects.length} detail="Portfolio entries"/><Stat title="SERVICES" value={data.services.length} detail="What you offer"/><Stat title="SKILLS" value={data.skills.length} detail="Technical toolkit"/><Stat title="CONTENT ITEMS" value={total} detail="Across your portfolio"/></div>
          <div className="admin-overview-grid"><section className="admin-panel"><div className="admin-panel-head"><div><span>CONTENT MANAGEMENT</span><h2>Quick actions</h2></div></div><div className="admin-quick-actions"><Quick icon={FolderKanban} title="Manage projects" desc="Add, update or remove portfolio work" onClick={() => setPage('Projects')}/><Quick icon={BriefcaseBusiness} title="Manage services" desc="Keep your service offering up to date" onClick={() => setPage('Services')}/><Quick icon={UserRound} title="Edit profile" desc="Update your professional introduction" onClick={() => setPage('Profile')}/></div></section><section className="admin-panel admin-backup"><span>CONTENT SAFETY</span><h2>Backup your work.</h2><p>Export your content as a JSON file, or restore it from a previous backup.</p><button className="admin-primary-btn" onClick={exportData}><Download size={15}/> Export backup</button><label className="admin-secondary-btn"><Upload size={15}/> Import backup<input type="file" accept="application/json" onChange={importData} hidden/></label></section></div>
          <div className="admin-note"><AlertCircle size={17}/><p><strong>Live database mode:</strong> Changes saved here are written to Cloudflare D1 and can appear on the public portfolio.</p></div>
        </> : page === 'Profile' ? <>
          <PageHeading eyebrow="IDENTITY & INTRODUCTION" title="Profile settings" desc="Update the information displayed across your professional portfolio."/>
          <section className="admin-panel profile-form"><label>Full name<input value={profileDraft.name || ''} onChange={e => setProfileDraft(p => ({ ...p, name: e.target.value }))}/></label><label>Professional title<input value={profileDraft.role || ''} onChange={e => setProfileDraft(p => ({ ...p, role: e.target.value }))}/></label><label>Email address<input type="email" value={profileDraft.email || ''} onChange={e => setProfileDraft(p => ({ ...p, email: e.target.value }))}/></label><label>Location<input value={profileDraft.location || ''} onChange={e => setProfileDraft(p => ({ ...p, location: e.target.value }))}/></label><label>Availability badge<select value={profileDraft.availability || 'open'} onChange={e => setProfileDraft(p => ({ ...p, availability: e.target.value }))}><option value="open">Taking new projects</option><option value="limited">Limited availability</option><option value="busy">Fully booked right now</option><option value="hidden">Hide the badge</option></select></label><label>Availability note <span>(optional, e.g. “Next slot: December”)</span><input maxLength="80" value={profileDraft.availabilityNote || ''} onChange={e => setProfileDraft(p => ({ ...p, availabilityNote: e.target.value }))}/></label><label className="wide">Introduction<textarea rows="4" value={profileDraft.intro || ''} onChange={e => setProfileDraft(p => ({ ...p, intro: e.target.value }))}/></label><button className="admin-primary-btn" disabled={saving} onClick={saveProfile}><Check size={15}/> {saving ? 'Saving…' : 'Save profile'}</button></section>
        </> : page === 'Skills' ? <>
          <PageHeading eyebrow="TECHNICAL TOOLKIT" title="Manage skills" desc="Maintain the technologies and tools shown in your portfolio."/><section className="admin-panel"><div className="admin-panel-head"><div><span>{data.skills.length} SKILLS</span><h2>Your toolkit</h2></div></div><div className="skill-admin-list">{data.skills.map(skill => <span key={skill}>{skill}<button aria-label={`Remove ${skill}`} onClick={() => update('skills', data.skills.filter(x => x !== skill))}><X size={13}/></button></span>)}</div><form className="skill-add" onSubmit={e => { e.preventDefault(); const v = e.target.skill.value.trim(); if (v && !data.skills.includes(v)) update('skills', [...data.skills, v]); e.target.reset() }}><input name="skill" placeholder="Add a technology or skill…"/><button className="admin-primary-btn" disabled={saving}><Plus size={15}/> Add skill</button></form></section>
        </> : <>
          <PageHeading eyebrow={page === 'Projects' ? 'YOUR SELECTED WORK' : 'WHAT YOU CAN DO'} title={page} desc={page === 'Projects' ? 'Build a portfolio that demonstrates your experience and impact.' : 'Present your services clearly to potential clients.'}/>
          <div className="admin-list-toolbar"><div className="admin-search"><Search size={16}/><input placeholder={`Search ${page.toLowerCase()}…`} value={query} onChange={e => setQuery(e.target.value)}/></div><button className="admin-primary-btn" onClick={() => setModal({ type: page === 'Projects' ? 'project' : 'service', item: null })}><Plus size={16}/> Add {page === 'Projects' ? 'project' : 'service'}</button></div>
          <section className="admin-panel admin-table-panel"><div className="admin-table-head"><span>{page.toUpperCase()} ({filtered.length})</span><span>STATUS / ACTIONS</span></div>{filtered.map(item => <div className="admin-record" key={item.id}><div className="admin-record-icon">{page === 'Projects' ? <FolderKanban size={19}/> : <BriefcaseBusiness size={19}/>}</div><div className="admin-record-copy"><strong>{item.name}</strong><small>{page === 'Projects' ? item.category : item.description}</small></div><span className="admin-status"><i/>{item.status}</span><div className="admin-record-actions"><button aria-label="Edit" onClick={() => setModal({ type: page === 'Projects' ? 'project' : 'service', item })}><Pencil size={15}/></button><button aria-label="Delete" onClick={() => removeItem(page.toLowerCase(), item.id)}><Trash2 size={15}/></button></div></div>)}{filtered.length === 0 && <div className="admin-empty">No matching items. Add a new entry to get started.</div>}</section>
        </>}
      </div>
    </main>
    {modal && <ItemModal modal={modal} onClose={() => setModal(null)} onSave={saveItem} saving={saving}/>}
    {notice && authenticated && <div className="admin-toast"><Check size={16}/>{notice}</div>}
  </div>
}

function Phase10Workspace({ page, data, persist }) {
  const [analytics,setAnalytics]=useState(null), [analyticsError,setAnalyticsError]=useState(''), [busy,setBusy]=useState(false)
  const [post,setPost]=useState({title:'',category:'Development',excerpt:'',body:'',status:'Draft',date:new Date().toISOString().slice(0,10)})
  const [quote,setQuote]=useState({author:'',role:'',quote:'',approved:false})
  const [accent,setAccent]=useState(data.design?.accent || '#ff7655')
  const [radius,setRadius]=useState(data.design?.radius || 'soft')
  useEffect(()=>{if(page!=='Analytics')return;let live=true;api.getAnalytics().then(x=>{if(live)setAnalytics(x)}).catch(e=>{if(live)setAnalyticsError(e.message)});return()=>{live=false}},[page])
  const saveList=async(key,list)=>{setBusy(true);try{const ok=await persist({...data,[key]:list},`${key==='blogPosts'?'Article':'Testimonial'} saved.`);return ok}finally{setBusy(false)}}
  const addPost=async e=>{e.preventDefault();const item={...post,id:crypto.randomUUID()};if(await saveList('blogPosts',[...(data.blogPosts||[]),item]))setPost({title:'',category:'Development',excerpt:'',body:'',status:'Draft',date:new Date().toISOString().slice(0,10)})}
  const addQuote=async e=>{e.preventDefault();const item={...quote,id:crypto.randomUUID()};if(await saveList('testimonials',[...(data.testimonials||[]),item]))setQuote({author:'',role:'',quote:'',approved:false})}
  const remove=async(key,id)=>{if(!confirm('Delete this item?'))return;await saveList(key,(data[key]||[]).filter(x=>x.id!==id))}
  const saveDesign=async()=>{setBusy(true);try{await persist({...data,design:{accent,radius}},'Design preferences saved.')}finally{setBusy(false)}}
  if(page==='Design Studio')return <><PageHeading eyebrow="VISUAL SYSTEM" title="Design Studio" desc="Adjust a small set of portfolio-wide visual preferences. Changes are saved with your content in D1."/><section className="admin-panel phase10-workspace"><h2>Accent colour</h2><div className="phase10-swatches">{[['Coral','#ff7655'],['Violet','#6c63ff'],['Teal','#168b83'],['Amber','#d18a22'],['Rose','#d94f83']].map(([name,value])=><button type="button" key={value} onClick={()=>setAccent(value)} className={accent===value?'selected':''} aria-label={`${name} accent`}><i style={{background:value}}/><span>{name}</span></button>)}</div><label className="phase10-field">Card corner style<select value={radius} onChange={e=>setRadius(e.target.value)}><option value="soft">Soft</option><option value="sharp">Sharp</option><option value="rounded">Rounded</option></select></label><button className="admin-primary-btn" disabled={busy} onClick={saveDesign}>Save design preferences</button><p className="phase10-help">Accent colour is applied as a CSS custom property. Existing layout and typography remain unchanged.</p></section></>
  if(page==='Blog')return <><PageHeading eyebrow="CONTENT PUBLISHING" title="Blog management" desc="Create short articles and publish them to the public portfolio journal."/><form className="admin-panel phase10-workspace" onSubmit={addPost}><h2>New article</h2><label className="phase10-field">Title<input required maxLength="140" value={post.title} onChange={e=>setPost({...post,title:e.target.value})}/></label><div className="phase10-two"><label className="phase10-field">Category<input value={post.category} onChange={e=>setPost({...post,category:e.target.value})}/></label><label className="phase10-field">Date<input type="date" value={post.date} onChange={e=>setPost({...post,date:e.target.value})}/></label></div><label className="phase10-field">Short excerpt<textarea required maxLength="320" rows="2" value={post.excerpt} onChange={e=>setPost({...post,excerpt:e.target.value})}/></label><label className="phase10-field">Article body<textarea rows="6" value={post.body} onChange={e=>setPost({...post,body:e.target.value})}/></label><label className="phase10-field">Publication status<select value={post.status} onChange={e=>setPost({...post,status:e.target.value})}><option>Draft</option><option>Published</option></select></label><button className="admin-primary-btn" disabled={busy}>Save article</button><div className="phase10-existing"><h3>Saved articles ({(data.blogPosts||[]).length})</h3>{(data.blogPosts||[]).map(item=><div key={item.id}><span><b>{item.title}</b><small>{item.status} · {item.date}</small></span><button type="button" onClick={()=>remove('blogPosts',item.id)}>Delete</button></div>)}</div></form></>
  if(page==='Testimonials')return <><PageHeading eyebrow="SOCIAL PROOF" title="Testimonials" desc="Only publish genuine feedback that you have permission to display."/><form className="admin-panel phase10-workspace" onSubmit={addQuote}><h2>Add client feedback</h2><label className="phase10-field">Client name<input required maxLength="100" value={quote.author} onChange={e=>setQuote({...quote,author:e.target.value})}/></label><label className="phase10-field">Role / organization<input maxLength="140" value={quote.role} onChange={e=>setQuote({...quote,role:e.target.value})}/></label><label className="phase10-field">Feedback<textarea required minLength="8" maxLength="1200" rows="4" value={quote.quote} onChange={e=>setQuote({...quote,quote:e.target.value})}/></label><label className="phase10-check"><input type="checkbox" checked={quote.approved} onChange={e=>setQuote({...quote,approved:e.target.checked})}/> Approved to publish (confirm you have permission)</label><button className="admin-primary-btn" disabled={busy}>Save testimonial</button><div className="phase10-existing"><h3>Saved testimonials ({(data.testimonials||[]).length})</h3>{(data.testimonials||[]).map(item=><div key={item.id}><span><b>{item.author}</b><small>{item.approved?'Approved for display':'Not published'}</small></span><button type="button" onClick={()=>remove('testimonials',item.id)}>Delete</button></div>)}</div></form></>
  return <><PageHeading eyebrow="SITE ACTIVITY" title="Analytics" desc="Aggregated events recorded by the portfolio over the last 30 days. This is a lightweight first-party counter, not a full analytics platform."/>{analyticsError&&<div className="admin-note"><AlertCircle size={16}/><p>{analyticsError}. Apply migration 0003_analytics.sql and confirm the API deployment.</p></div>}{analytics&&<><div className="admin-stat-grid"><Stat title="EVENTS · 30 DAYS" value={analytics.totalEvents} detail="Recorded interactions"/><Stat title="PATHS" value={analytics.uniquePaths} detail="Distinct paths seen"/><Stat title="PAGE VIEWS" value={(analytics.byType||[]).find(x=>x.event_type==='page_view')?.total||0} detail="Page view events"/><Stat title="CONTACT CLICKS" value={(analytics.byType||[]).find(x=>x.event_type==='contact_click')?.total||0} detail="Contact interactions"/></div><section className="admin-panel phase10-workspace"><h2>Most visited paths</h2>{(analytics.topPages||[]).map(x=><div className="phase10-analytics-row" key={x.path}><span>{x.path}</span><b>{x.views}</b></div>)}{!analytics.topPages?.length&&<p>No activity recorded yet.</p>}</section></>}</>
}

function InquiriesPage({ inquiries, loading, filter, setFilter, reload, saveInquiry, exportInquiries }) {
 const [editing,setEditing]=useState(null); const filtered=inquiries.filter(x=>filter==='All'||x.status===filter);
 const date=value=>new Date(Number(value)*1000).toLocaleString();
 return <><PageHeading eyebrow="CLIENT CONVERSATIONS" title="Project inquiries" desc="Review incoming requests, keep notes and track each conversation through to completion."/><div className="inquiry-admin-toolbar"><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{['New','Contacted','In Progress','Won','Closed'].map(x=><option key={x}>{x}</option>)}</select><div><button className="admin-secondary-btn" onClick={reload}><RefreshCw size={14}/> Refresh</button><button className="admin-primary-btn" onClick={exportInquiries}><Download size={14}/> Export CSV</button></div></div>{loading&&<p>Loading inquiries…</p>}<section className="admin-panel inquiry-admin-list">{filtered.map(item=><article className="inquiry-admin-card" key={item.id}><div className="inquiry-admin-card-head"><div><span>{date(item.created_at)}</span><h3>{item.name}</h3><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone&&<small>{item.phone}</small>}</div><select value={item.status} onChange={e=>saveInquiry(item,e.target.value,item.notes)}>{['New','Contacted','In Progress','Won','Closed'].map(x=><option key={x}>{x}</option>)}</select></div><div className="inquiry-admin-meta">{item.service&&<b>{item.service}</b>}{item.budget&&<b>{item.budget}</b>}</div><p>{item.message}</p><label>Internal notes<textarea rows="2" value={editing?.id===item.id?editing.notes:item.notes||''} onChange={e=>setEditing({id:item.id,notes:e.target.value})} onFocus={()=>setEditing({id:item.id,notes:item.notes||''})}/></label><button className="admin-primary-btn" onClick={()=>saveInquiry(item,item.status,editing?.id===item.id?editing.notes:item.notes||'')}>Save notes / status</button></article>)}{!loading&&!filtered.length&&<div className="admin-empty">No inquiries in this view yet.</div>}</section></>
}

function Stat({ title, value, detail }) { return <div className="admin-stat"><span>{title}</span><strong>{value}</strong><small>{detail}</small><div className="stat-line"/></div> }
function Quick({ icon: Icon, title, desc, onClick }) { return <button className="admin-quick" onClick={onClick}><span><Icon size={18}/></span><div><strong>{title}</strong><small>{desc}</small></div><ExternalLink size={15}/></button> }
function PageHeading({ eyebrow, title, desc }) { return <div className="admin-page-heading"><span className="admin-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{desc}</p></div> }
function ItemModal({ modal, onClose, onSave, saving }) {
  const isProject = modal.type === 'project'
  const base = { name: '', category: '', description: '', status: isProject ? 'Published' : 'Active' }
  const [form, setForm] = useState({ ...base, ...(modal.item || {}), technologiesText: (modal.item?.technologies || []).join(', '), galleryText: (modal.item?.gallery || []).join('\n') })
  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const submit = (event) => {
    event.preventDefault()
    const item = { ...form }
    delete item.technologiesText
    delete item.galleryText
    if (isProject) {
      item.technologies = form.technologiesText.split(/[\n,]/).map(x => x.trim()).filter(Boolean)
      item.gallery = form.galleryText.split(/\n/).map(x => x.trim()).filter(Boolean)
      item.featured = !!form.featured
    }
    onSave(item)
  }
  return <div className="admin-modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}><form className="admin-modal phase5-project-modal" onSubmit={submit}>
    <div className="admin-modal-head"><div><span>{modal.item ? 'EDIT ENTRY' : 'NEW ENTRY'}</span><h2>{isProject ? 'Project case study' : 'Service offering'}</h2></div><button type="button" onClick={onClose}><X/></button></div>
    <label>Name<input required value={form.name || ''} onChange={e => set('name', e.target.value)}/></label>
    {isProject && <>
      <div className="phase5-form-row"><label>Category<input required value={form.category || ''} onChange={e => set('category', e.target.value)} placeholder="e.g. SaaS / Business platform"/></label><label>Project year<input value={form.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 2025"/></label></div>
      <label>Short description<textarea required rows="2" value={form.description || ''} onChange={e => set('description', e.target.value)}/></label>
      <label>Cover image URL<input value={form.coverImage || ''} onChange={e => set('coverImage', e.target.value)} placeholder="/images/project-cover.png or https://…"/></label>
      <label>Hover preview video URL <small>Optional MP4/WebM; muted, looping preview</small><input value={form.previewVideo || ''} onChange={e => set('previewVideo', e.target.value)} placeholder="/projects/previews/project-demo.mp4"/></label>
      <label>Hover preview GIF URL <small>Optional animated GIF; used when no video is supplied</small><input value={form.previewGif || ''} onChange={e => set('previewGif', e.target.value)} placeholder="/projects/previews/project-demo.gif"/></label>
      <label>Live project URL<input value={form.projectUrl || ''} onChange={e => set('projectUrl', e.target.value)} placeholder="https://…"/></label>
      <label>Your role / contribution<input value={form.role || ''} onChange={e => set('role', e.target.value)} placeholder="e.g. Full-stack development"/></label>
      <label>Technologies <small>Separate with commas</small><textarea rows="2" value={form.technologiesText} onChange={e => set('technologiesText', e.target.value)} placeholder="React, Laravel, MySQL"/></label>
      <label>Project gallery image URLs <small>One URL per line</small><textarea rows="3" value={form.galleryText} onChange={e => set('galleryText', e.target.value)} placeholder="https://…"/></label>
      <label>Overview<textarea rows="3" value={form.overview || ''} onChange={e => set('overview', e.target.value)}/></label>
      <label>Challenge<textarea rows="3" value={form.challenge || ''} onChange={e => set('challenge', e.target.value)}/></label>
      <label>Approach / solution<textarea rows="3" value={form.solution || ''} onChange={e => set('solution', e.target.value)}/></label>
      <label>Outcome / results<textarea rows="3" value={form.results || ''} onChange={e => set('results', e.target.value)}/></label>
      <label className="phase5-featured-check"><input type="checkbox" checked={!!form.featured} onChange={e => set('featured', e.target.checked)}/> Feature this project near the top</label>
    </>}
    {!isProject && <label>Description<textarea required rows="4" value={form.description || ''} onChange={e => set('description', e.target.value)}/></label>}
    <label>Status<select value={form.status || (isProject ? 'Published' : 'Active')} onChange={e => set('status', e.target.value)}><option>Published</option><option>Draft</option><option>Active</option><option>Hidden</option></select></label>
    <div className="admin-modal-actions"><button type="button" className="admin-secondary-btn" onClick={onClose}>Cancel</button><button className="admin-primary-btn" disabled={saving}><Check size={15}/> {saving ? 'Saving…' : 'Save entry'}</button></div>
  </form></div>
}
const screenStyle = { minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#f3f2ef', color: '#222', fontFamily: 'Arial, sans-serif', padding: 20 }
const loginCard = { width: 'min(420px, 100%)', background: '#fff', padding: 36, borderRadius: 12, boxShadow: '0 18px 60px rgba(0,0,0,.08)', display: 'flex', flexDirection: 'column', gap: 12 }
const loginInput = { width: '100%', padding: 14, border: '1px solid #ddd', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }
