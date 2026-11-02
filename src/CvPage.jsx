import { useEffect } from 'react'
import { ArrowLeft, Printer } from 'lucide-react'
import { CV } from './cvData'

export default function CvPage() {
  useEffect(() => {
    const prev = document.title
    document.title = `${CV.name} — CV`
    document.body.classList.add('cv-mode')
    window.scrollTo(0, 0)
    return () => { document.title = prev; document.body.classList.remove('cv-mode') }
  }, [])
  return <div className="cv-wrap">
    <div className="cv-toolbar">
      <a href="/" className="cv-btn ghost"><ArrowLeft size={15}/> Back to portfolio</a>
      <button type="button" className="cv-btn" onClick={() => window.print()}><Printer size={15}/> Save as PDF / Print</button>
    </div>
    <article className="cv-page">
      <header className="cv-head">
        <h1>{CV.name}</h1>
        <p className="cv-title">{CV.title}</p>
        <p className="cv-contact"><span>{CV.location}</span><a href={`mailto:${CV.email}`}>{CV.email}</a></p>
      </header>
      <section><h2>Profile</h2><p>{CV.profile}</p></section>
      <section><h2>Experience</h2>
        {CV.experience.map(e => <div className="cv-job" key={e.role + e.org}>
          <div className="cv-job-head"><h3>{e.role} <span>— {e.org}</span></h3>{e.when && <em>{e.when}</em>}</div>
          <ul>{e.points.map(p => <li key={p}>{p}</li>)}</ul>
        </div>)}
      </section>
      <section><h2>Selected projects</h2>
        <ul className="cv-projects">{CV.projects.map(([n, d]) => <li key={n}><strong>{n}</strong> — {d}</li>)}</ul>
      </section>
      <div className="cv-cols">
        <section><h2>Technical skills</h2>
          {CV.skills.map(([g, items]) => <p key={g} className="cv-skill"><strong>{g}:</strong> {items.join(' · ')}</p>)}
        </section>
        <section><h2>Education</h2>
          <ul>{CV.education.map(e => <li key={e}>{e}</li>)}</ul>
        </section>
      </div>
      <section><h2>Teaching</h2>
        <p className="cv-skill"><strong>Domains:</strong> {CV.domains.join(' · ')}</p>
        <ul>{CV.methods.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}</ul>
      </section>
    </article>
  </div>
}
