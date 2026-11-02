import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight,Plus } from 'lucide-react'
import { domains,domainById } from '../config/domains'
import type { DomainId } from '../types'
export function Heading({eyebrow,title,desc,action}:{eyebrow?:string;title:string;desc?:string;action?:ReactNode}){return <header className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{action}</header>}
export function Empty({title,description,link,label}:{title:string;description:string;link?:string;label?:string}){return <div className="empty"><div className="empty-mark">✳</div><h3>{title}</h3><p>{description}</p>{link&&<Link className="btn primary" to={link}><Plus size={16}/>{label}</Link>}</div>}
export function DomainBadge({id}:{id:DomainId}){const d=domainById(id);return <span className={`domain-badge ${d.color}`}>{d.name}</span>}
export function DomainSelect({value,onChange,label='成长领域'}:{value:DomainId;onChange:(v:DomainId)=>void;label?:string}){return <label>{label}<select value={value} onChange={e=>onChange(e.target.value as DomainId)}>{domains.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></label>}
export function ItemLink({to,children}:{to:string;children:ReactNode}){return <Link className="item-link" to={to}>{children}<ChevronRight size={17}/></Link>}
export function ConfirmDelete({onDelete,label='删除这条记录'}:{onDelete:()=>void;label?:string}){return <button type="button" className="text-btn danger" onClick={()=>{if(window.confirm(`${label}？此操作无法撤销。`))onDelete()}}>删除</button>}
