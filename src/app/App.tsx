import { NavLink,Route,Routes,Navigate,Link } from 'react-router-dom'
import { House,NotebookPen,LayoutGrid,History,UserRound,Leaf } from 'lucide-react'
import { Dashboard } from '../features/dashboard/Dashboard'
import { DailyPage,DailyHistory } from '../features/daily-review/DailyPage'
import { WeeklyPage } from '../features/weekly-review/WeeklyPage'
import { DomainsPage,DomainDetail,EntryEditor } from '../features/growth-domains/DomainsPage'
import { ExperimentPage } from '../features/growth-experiments/ExperimentPage'
import { Timeline } from '../features/timeline/Timeline'
import { Treasures } from '../features/treasures/Treasures'
import { Profile } from '../features/profile/Profile'
import { InterestsPage } from '../features/interests/InterestsPage'
const nav=[{to:'/',label:'首页',icon:House},{to:'/daily',label:'每日复盘',icon:NotebookPen},{to:'/domains',label:'成长领域',icon:LayoutGrid},{to:'/timeline',label:'成长档案',icon:History},{to:'/me',label:'我的',icon:UserRound}]
export function App(){return <div className="app-shell"><aside className="sidebar"><Link to="/" className="brand"><span className="brand-symbol"><Leaf size={23}/></span><span><strong>Rolan Growth OS</strong><small>Rolan 的成长世界</small></span></Link><nav>{nav.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'}><Icon size={20}/>{label}</NavLink>)}</nav><div className="sidebar-note">慢慢来，也是在向前走。<span>GROW AT YOUR OWN PACE</span></div></aside><div className="main-wrap"><main><Routes><Route path="/" element={<Dashboard/>}/><Route path="/daily" element={<DailyPage/>}/><Route path="/daily/history" element={<DailyHistory/>}/><Route path="/weekly" element={<WeeklyPage/>}/><Route path="/domains" element={<DomainsPage/>}/><Route path="/domains/:id" element={<DomainDetail/>}/><Route path="/interests" element={<InterestsPage/>}/><Route path="/entry/new" element={<EntryEditor/>}/><Route path="/entry/:id" element={<EntryEditor/>}/><Route path="/experiment/:id" element={<ExperimentPage/>}/><Route path="/timeline" element={<Timeline/>}/><Route path="/treasures" element={<Treasures/>}/><Route path="/me" element={<Profile/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main></div><nav className="mobile-nav">{nav.map(({to,label,icon:Icon})=><NavLink key={to} to={to} end={to==='/'}><Icon size={21}/><span>{label}</span></NavLink>)}</nav></div>}
