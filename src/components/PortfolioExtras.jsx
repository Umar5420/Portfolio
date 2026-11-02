import { useEffect, useRef, useState } from 'react'
import { Github, ArrowUpRight, Sparkles, Terminal, X, Languages, Download, Zap } from 'lucide-react'

function AsciiPortrait({ src }) {
  const [art,setArt] = useState('')
  useEffect(()=>{
    let active=true
    const image=new Image()
    image.onload=()=>{
      try {
        const width=76,height=Math.max(24,Math.round(width*image.naturalHeight/image.naturalWidth*.48))
        const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height
        const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return
        ctx.drawImage(image,0,0,width,height)
        const pixels=ctx.getImageData(0,0,width,height).data
        const chars='@%#*+=-:. '
        let output=''
        for(let y=0;y<height;y++){
          for(let x=0;x<width;x++){
            const at=(y*width+x)*4,luma=(pixels[at]*.2126+pixels[at+1]*.7152+pixels[at+2]*.0722)/255
            output+=chars[Math.min(chars.length-1,Math.floor(luma*(chars.length-1)))]
          }
          output+='\n'
        }
        if(active)setArt(output)
      } catch { if(active)setArt('ASCII preview unavailable') }
    }
    image.onerror=()=>{if(active)setArt('ASCII preview unavailable')}
    image.src=src
    return()=>{active=false}
  },[src])
  return <pre className="portrait-ascii" aria-hidden="true">{art}</pre>
}

const stages = [
  ['HTML','Structure, semantic markup and accessible content.'],
  ['CSS','Responsive layouts, visual systems, motion and polish.'],
  ['JavaScript','Programming fundamentals, DOM, async code and APIs.'],
  ['React','Components, hooks, state, routing and real interfaces.'],
  ['Backend','Server logic, authentication, REST APIs and deployment.'],
  ['Databases','SQL, data modelling, queries and reliable persistence.']
]

export function PortfolioExtras({ profile, onCoachingSelect }) {
  const [xp,setXp] = useState(0)
  const [lang,setLang] = useState('en')
  const [keys,setKeys] = useState(false)
  const [terminal,setTerminal] = useState(false)
  const [cmd,setCmd] = useState('')
  const [glitch,setGlitch] = useState(false)
  const glitchTimer = useRef(null)
  const [gh,setGh] = useState(null)
  const [tip,setTip] = useState(0)
  const [activeRoadmapStage,setActiveRoadmapStage] = useState(0)
  const [seenRoadmapStages,setSeenRoadmapStages] = useState([])
  const [compare,setCompare] = useState(52)
  const [asciiReveal,setAsciiReveal] = useState(52)
  const tips = ['Name things clearly; future-you is another developer.','Make the simplest version work before making it clever.','A good database schema saves hours of application code.','Accessibility is a feature, not a finishing touch.']
  useEffect(() => {
    const sections = ['top','about','teach','services','work','gallery','student-roadmap','skills','journey','contact']
    const targets = sections.map(id => [id, id === 'top' ? document.querySelector('.hero') : document.getElementById(id)]).filter(([,el]) => !!el)
    const seen = new Set()
    const ids = new Map(targets.map(([id,el]) => [el,id]))
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const id = ids.get(e.target)
        if(e.isIntersecting && id && !seen.has(id)){
          seen.add(id)
          setXp(Math.min(100,Math.round(seen.size/Math.max(1,targets.length)*100)))
        }
      })
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'})
    targets.forEach(([,el])=>io.observe(el))
    const keyHandler = e => {
      const tag=document.activeElement?.tagName||''
      const typing=/INPUT|TEXTAREA|SELECT/.test(tag)||document.activeElement?.isContentEditable
      if(e.key==='Escape'){setKeys(false);setTerminal(false);return}
      if(typing)return
      const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
      window.__konami = [...(window.__konami||[]),e.key].slice(-10)
      if(seq.every((k,i)=>k.toLowerCase()===String(window.__konami[i]).toLowerCase())){window.__konami=[];setGlitch(true);clearTimeout(glitchTimer.current);glitchTimer.current=setTimeout(()=>setGlitch(false),4500)}
      if(e.key==='?'){setKeys(v=>!v)}
      if((e.ctrlKey||e.metaKey)&&e.shiftKey&&e.key.toLowerCase()==='k'){e.preventDefault();setTerminal(true)}
    }
    window.addEventListener('keydown',keyHandler)
    return ()=>{io.disconnect();window.removeEventListener('keydown',keyHandler);clearTimeout(glitchTimer.current)}
  },[])
  useEffect(()=>{
    const stops=[...document.querySelectorAll('.roadmap-stop')]
    if(!stops.length)return
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return
      const index=stops.indexOf(entry.target)
      if(index>=0){setActiveRoadmapStage(index);setSeenRoadmapStages(old=>old.includes(index)?old:[...old,index])}
    }),{threshold:.45,rootMargin:'-8% 0px -12% 0px'})
    stops.forEach(stop=>io.observe(stop))
    return()=>io.disconnect()
  },[])
  useEffect(()=>{fetch('/api/github').then(r=>r.ok?r.json():null).then(setGh).catch(()=>{})},[])
  useEffect(()=>{document.documentElement.lang=lang==='ur'?'ur':'en';document.documentElement.dir=lang==='ur'?'rtl':'ltr';return()=>{document.documentElement.lang='en';document.documentElement.dir='ltr'}},[lang])
  useEffect(()=>{let promptEvent=null;const capture=e=>{e.preventDefault();promptEvent=e};const install=async()=>{if(promptEvent){promptEvent.prompt();await promptEvent.userChoice;promptEvent=null}else alert('Use your browser menu → Install app or Add to Home Screen.');};window.addEventListener('beforeinstallprompt',capture);window.addEventListener('portfolio-install',install);return()=>{window.removeEventListener('beforeinstallprompt',capture);window.removeEventListener('portfolio-install',install)}},[])
  useEffect(()=>{const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;if(!fine)return;const move=e=>{const p=document.querySelector('.portfolio-cursor');if(!p)return;p.style.left=e.clientX+'px';p.style.top=e.clientY+'px';const t=e.target.closest('a,button');const custom=t?.dataset.cursorLabel;p.textContent=t?(custom|| (t.matches('.project-card,.show-card')?'VIEW':t.matches('.button-primary,.nav-contact')?'HIRE':t.matches('[data-play-preview]')?'PLAY':'OPEN')):'';p.classList.toggle('active',!!t)};window.addEventListener('mousemove',move,{passive:true});return()=>window.removeEventListener('mousemove',move)},[])
  useEffect(()=>{
    const stage=document.querySelector('.portrait-stage')
    if(!stage||matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const canvas=document.createElement('canvas');canvas.className='portrait-particle-canvas';stage.appendChild(canvas)
    const ctx=canvas.getContext('2d');if(!ctx){canvas.remove();return}
    let raf=0,particles=[],started=0,active=false,dpr=1
    const resize=()=>{const r=stage.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,matchMedia('(max-width:760px)').matches?1.5:2);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(dpr,0,0,dpr,0,0)}
    const burst=()=>{
      if(active)return
      const img=stage.querySelector('.portrait-cut.on')
      if(!img||!img.complete||!img.naturalWidth)return
      try{
        const sample=document.createElement('canvas'),sw=84,sh=112;sample.width=sw;sample.height=sh
        const sc=sample.getContext('2d',{willReadFrequently:true});sc.drawImage(img,0,0,sw,sh)
        const pixels=sc.getImageData(0,0,sw,sh).data,stageRect=stage.getBoundingClientRect(),imageRect=img.getBoundingClientRect()
        const ox=imageRect.left-stageRect.left,oy=imageRect.top-stageRect.top,sx=imageRect.width/sw,sy=imageRect.height/sh
        const next=[]
        for(let y=0;y<sh;y+=2)for(let x=0;x<sw;x+=2){const at=(y*sw+x)*4,a=pixels[at+3];if(a<45)continue;const dx=(x-sw/2)/sw,dy=(y-sh/2)/sh,angle=Math.atan2(dy,dx)+(Math.random()-.5)*.7,speed=28+Math.random()*105;next.push({x:ox+(x+.5)*sx,y:oy+(y+.5)*sy,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,size:Math.max(1.2,Math.min(3.2,sx*2.2)),color:`rgba(${pixels[at]},${pixels[at+1]},${pixels[at+2]},${a/255})`})}
        if(!next.length)return
        particles=next;started=performance.now();active=true;stage.classList.add('portrait-fragmenting');resize();if(!raf)raf=requestAnimationFrame(draw)
      }catch{/* Canvas can be unavailable in hardened browsers; leave the portrait intact. */}
    }
    const draw=now=>{
      const r=stage.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height)
      const progress=Math.min(1,(now-started)/1450),burstPhase=Math.min(1,progress/.48),returnPhase=Math.max(0,(progress-.48)/.52)
      const outward=burstPhase*burstPhase*(3-2*burstPhase),inward=1-returnPhase*returnPhase*(3-2*returnPhase)
      for(const p of particles){const x=p.x+p.vx*outward*inward*.62,y=p.y+p.vy*outward*inward*.62;ctx.fillStyle=p.color;ctx.globalAlpha=progress<.48?1:Math.max(.18,inward);ctx.fillRect(x,y,p.size,p.size)}
      ctx.globalAlpha=1
      if(progress<1)raf=requestAnimationFrame(draw)
      else{raf=0;active=false;particles=[];stage.classList.remove('portrait-fragmenting');ctx.clearRect(0,0,r.width,r.height)}
    }
    const enter=e=>{if(e.pointerType==='touch')return;burst()}
    const tap=e=>{if(e.pointerType==='touch')burst()}
    resize();stage.addEventListener('pointerenter',enter);stage.addEventListener('pointerdown',tap);window.addEventListener('resize',resize)
    return()=>{stage.removeEventListener('pointerenter',enter);stage.removeEventListener('pointerdown',tap);window.removeEventListener('resize',resize);if(raf)cancelAnimationFrame(raf);stage.classList.remove('portrait-fragmenting');canvas.remove()}
  },[])
  useEffect(()=>{const els=[...document.querySelectorAll('main section[id]')];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const hue=Math.min(220,25+els.indexOf(e.target)*17);document.documentElement.style.setProperty('--section-hue',hue)}}),{threshold:.35});els.forEach(e=>io.observe(e));return()=>io.disconnect()},[])
  const submit = e => {e.preventDefault();if(cmd.trim().toLowerCase()==='matrix'){document.documentElement.classList.toggle('matrix-mode');setTerminal(false)}else if(cmd.trim()==='?'){setKeys(true);setTerminal(false)}else setCmd('Unknown command. Try matrix or ?')}
  const dir = lang==='ur'?'rtl':'ltr'
  return <div className={`portfolio-extras ${glitch?'konami-glitch':''}`}>
    <div className="portfolio-cursor" aria-hidden="true"/>
    <div className="matrix-rain" aria-hidden="true">{Array.from({length:22},(_,i)=><span key={i} style={{'--column':i,'--delay':`${(i%7)*-.8}s`}}>{'0101 1100 0010 1011 0110 1001 0011 1101'}</span>)}</div>
    <div className="xp-widget" aria-label={`Portfolio exploration ${xp}% complete`}><span className="xp-ring" style={{'--xp':`${xp*3.6}deg`}}/><span><b>{xp}%</b><small>EXPLORED</small></span>{xp===100&&<button onClick={()=>document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})}>LEVEL UP · HIRE ME ✨</button>}</div>
    <section id="student-roadmap" className="extra-section roadmap section-pad" dir={dir}>
      <div className="section-top"><span className="section-kicker">LEARN WITH UMAR / THE ROADMAP</span><span className="section-side">FROM FIRST TAG TO FULL-STACK THINKING</span></div>
      <div className="section-heading-row"><h2>{lang==='ur'?'سیکھنے کا سفر':'Your path to'}<br/><em>{lang==='ur'?'کوڈنگ':'the stack.'}</em></h2><p>{lang==='ur'?'بنیادی تصورات سے حقیقی دنیا کی ایپلی کیشنز تک۔':'A practical, project-led route through the technologies I teach.'}</p></div>
      <div className="roadmap-path">{stages.map(([name,desc],i)=><article className={`roadmap-stop ${activeRoadmapStage===i?'is-active':''} ${seenRoadmapStages.includes(i)?'is-complete':''}`} key={name}><span className="roadmap-index">0{i+1}</span><span className="roadmap-node"/><div><h3>{name}</h3><p>{desc}</p></div></article>)}</div>
    </section>
    <section className="extra-section github-section section-pad"><div className="section-top"><span className="section-kicker">OPEN SOURCE / GITHUB</span><span className="section-side">CODE IN PUBLIC</span></div><div className="github-card"><div><Github size={26}/><h3>Building, learning, committing.</h3><p>{gh?.login?`Latest public activity for @${gh.login}.`:'Connect a GitHub username in Worker settings to show live activity and repositories.'}</p><a href={gh?.url||'https://github.com'} target="_blank" rel="noreferrer">Visit GitHub <ArrowUpRight size={15}/></a></div><div className="github-stats"><strong>{gh?.public_repos??'—'}</strong><small>PUBLIC REPOSITORIES</small><strong>{gh?.followers??'—'}</strong><small>FOLLOWERS</small></div>{gh?.contributions?.weeks&&<div className="github-heatmap" aria-label={`${gh.contributions.totalContributions} GitHub contributions this year`}><b>{gh.contributions.totalContributions} contributions in the last year</b><div>{gh.contributions.weeks.flatMap(w=>w.contributionDays).map((d,i)=><i key={i} title={`${d.date}: ${d.contributionCount} contributions`} style={{background:d.color}}/>)}</div></div>}{gh?.repos?.length>0&&<div className="github-repos">{gh.repos.slice(0,3).map(r=><a key={r.name} href={r.html_url} target="_blank" rel="noreferrer"><b>{r.name}</b><span>{r.description||'Public repository'}</span><small>{r.language||'Code'} · ★ {r.stars}</small></a>)}</div>}</div></section>
    <section className="extra-section before-after-section section-pad"><div className="section-top"><span className="section-kicker">PRODUCT DETAIL / SCREEN COMPARISON</span><span className="section-side">ADSON CLIENT HUNTER · TWO REAL WORKFLOWS</span></div><div className="section-heading-row"><h2>One product.<br/><em>Two real screens.</em></h2><p>Compare the actual Adson Client Hunter dashboard with its approvals workflow. These are two screens from the same product, not unrelated or invented before-and-after images.</p></div><div className="before-after" style={{'--compare':`${compare}%`}}><img src="/images/adson-dashboard.png" alt="Adson Client Hunter dashboard screen"/><img className="after-image" src="/images/adson-approvals.png" alt="Adson Client Hunter approvals screen" style={{clipPath:`inset(0 0 0 ${compare}%)`}}/></div><label className="compare-range"><span>Dashboard</span><input type="range" min="0" max="100" value={compare} onChange={e=>setCompare(Number(e.target.value))} aria-label="Compare Adson dashboard and approvals screens"/><span>Approvals</span></label></section>
    <section className="extra-section portrait-lab section-pad"><div className="section-top"><span className="section-kicker">A LITTLE EXPERIMENT / PORTRAIT LAB</span><span className="section-side">MOVE TO REVEAL THE PIXELS</span></div><div className="portrait-lab-grid"><div className="portrait-compare" onPointerMove={e=>{if(e.pointerType==='mouse'){const r=e.currentTarget.getBoundingClientRect();setAsciiReveal(Math.max(0,Math.min(100,Math.round((e.clientX-r.left)/r.width*100))))}}} onPointerLeave={()=>setAsciiReveal(52)} aria-label="Move pointer across the portrait to reveal its ASCII version"><img src="/images/umar-portrait.webp" alt="Portrait"/><div style={{position:'absolute',inset:0,clipPath:`inset(0 ${100-asciiReveal}% 0 0)`,overflow:'hidden'}}><AsciiPortrait src="/images/umar-portrait.webp"/></div><span className="ascii-hint">HOVER TO REVEAL ASCII</span></div><label className="compare-range">ASCII reveal <input type="range" min="0" max="100" value={asciiReveal} onChange={e=>setAsciiReveal(Number(e.target.value))}/></label></div></section>
    <section className="extra-section coaching-section section-pad"><div className="section-top"><span className="section-kicker">LEARN DIRECTLY / COACHING</span><span className="section-side">PRACTICAL, PERSONAL GUIDANCE</span></div><div className="coaching-grid"><article><span>01 / PERSONAL</span><h3>1-to-1 mentoring</h3><p>Focused sessions for your current level, goals and questions.</p><button onClick={()=>onCoachingSelect?.('Hi Umar, I’m interested in 1-to-1 mentoring.\nMy goals: ')}>Ask about mentoring ↗</button></article><article><span>02 / STRUCTURED</span><h3>Web dev bootcamp</h3><p>A guided path from fundamentals to a portfolio-ready project.</p><button onClick={()=>onCoachingSelect?.('Hi Umar, I’m interested in the web development bootcamp.\nMy current level: ')}>Ask about bootcamp ↗</button></article></div></section>
    <section className="extra-section extras-tools section-pad"><div className="section-top"><span className="section-kicker">A SMALL DAILY DOSE</span><span className="section-side">TIP OF THE DAY</span></div><div className="tip-card"><Zap/><p>{tips[tip%tips.length]}</p><button onClick={()=>setTip(v=>v+1)}>Another tip ↗</button></div></section>
    <div className="extra-controls"><button title="Switch language" onClick={()=>setLang(v=>v==='en'?'ur':'en')}><Languages size={17}/>{lang==='en'?'اردو':'English'}</button><button title="Install app" onClick={()=>window.dispatchEvent(new Event('portfolio-install'))}><Download size={17}/></button><button title="Open terminal" onClick={()=>setTerminal(true)}><Terminal size={17}/></button></div>
    {keys&&<div className="extra-modal" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts"><div><button className="extra-close" onClick={()=>setKeys(false)}><X/></button><h2>Keyboard shortcuts</h2><p><kbd>?</kbd> Toggle this guide</p><p><kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>K</kbd> Open terminal</p><p><kbd>↑ ↑ ↓ ↓ ← → ← → B A</kbd> Secret mode</p><p><kbd>Esc</kbd> Close overlays</p></div></div>}
    {terminal&&<div className="extra-modal" role="dialog" aria-modal="true"><form className="terminal-box" onSubmit={submit}><button type="button" className="extra-close" onClick={()=>setTerminal(false)}><X/></button><span>UMAR@PORTFOLIO:~$</span><input autoFocus value={cmd} onChange={e=>setCmd(e.target.value)} placeholder="try: matrix" aria-label="Terminal command"/><button type="submit">RUN</button></form></div>}
    {xp===100&&<div className="xp-celebrate" aria-live="polite"><Sparkles/> You explored the whole portfolio. Nice work!</div>}
  </div>
}

export function Mini404(){const [score,setScore]=useState(0);const [bugs,setBugs]=useState([]);useEffect(()=>{const t=setInterval(()=>setBugs(v=>[...v.slice(-4),{id:Date.now(),x:8+Math.random()*82,y:15+Math.random()*65}]),900);return()=>clearInterval(t)},[]);return <main className="mini-404"><span>404 / PAGE NOT FOUND</span><h1>Looks like a bug<br/><em>escaped.</em></h1><p>Catch a few while we find your page.</p><div className="bug-game">{bugs.map(b=><button key={b.id} style={{left:`${b.x}%`,top:`${b.y}%`}} onClick={()=>{setScore(s=>s+1);setBugs(v=>v.filter(x=>x.id!==b.id))}} aria-label="Catch bug">✳</button>)}</div><strong>BUGS CAUGHT: {score}</strong><a href="/">Back to portfolio ↗</a></main>}
