import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Admin from './Admin.jsx'
import CvPage from './CvPage.jsx'
import { PageCurtain } from './components/PageCurtain.jsx'
import './styles.css'
import './themes.css'
import './phase11.css'
import './phase12.css'
import './phase13.css'
import './phase14.css'
import './phase16.css'
import './phase17.css'
import './phase18.css'
import './phase20.css'
import './futuristic.css'
import { Mini404 } from './components/PortfolioExtras'

if ('serviceWorker' in navigator && import.meta.env.PROD) window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
const isAdmin = window.location.pathname.startsWith('/admin')
const known = ['/', '/cv', '/cv/'].includes(window.location.pathname) || window.location.pathname.startsWith('/projects/') || window.location.pathname.startsWith('/admin')
const is404 = !known
try { if (sessionStorage.getItem('curtain') === '1') document.documentElement.classList.add('curtain-pending') } catch { /* private mode */ }
const isCv = /^\/cv\/?$/.test(window.location.pathname)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>{is404 ? <Mini404/> : isAdmin ? <Admin /> : <><PageCurtain />{isCv ? <CvPage /> : <App />}</>}</React.StrictMode>
)
