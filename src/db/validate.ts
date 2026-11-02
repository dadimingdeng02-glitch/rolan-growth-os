import { domains } from '../config/domains'
import type { Backup } from '../types'
const obj=(x:unknown):x is Record<string,unknown>=>!!x&&typeof x==='object'&&!Array.isArray(x)
const str=(x:unknown)=>typeof x==='string'
const date=(x:unknown)=>str(x)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&!Number.isNaN(Date.parse(x))
const base=(x:unknown)=>obj(x)&&str(x.id)&&x.id.length>0&&str(x.createdAt)&&!Number.isNaN(Date.parse(x.createdAt))&&str(x.updatedAt)&&!Number.isNaN(Date.parse(x.updatedAt))
const domain=(x:unknown)=>domains.some(d=>d.id===x)
const stringArray=(x:unknown)=>Array.isArray(x)&&x.every(str)
export function validateBackup(raw:unknown):Backup{
 if(!obj(raw)||raw.app!=='rolan-growth-os'||raw.version!==1||!str(raw.exportedAt)||!obj(raw.data))throw Error('不是支持的 Rolan Growth OS V1 备份文件')
 const d=raw.data;const names=['dailyReviews','weeklyReviews','experiments','entries','treasures','settings'] as const
 for(const name of names)if(!Array.isArray(d[name]))throw Error(`备份缺少 ${name} 数据`)
 const lists=d as Record<string,unknown[]>
 const checks:Record<string,(x:unknown)=>boolean>={
 dailyReviews:x=>base(x)&&obj(x)&&date(x.date)&&stringArray(x.moods)&&x.moods.every((m:unknown)=>['开心','平静','难过','委屈','生气','紧张','兴奋'].includes(m as string))&&str(x.good)&&str(x.difficulty)&&str(x.tomorrow)&&['draft','complete'].includes(x.status as string),
 weeklyReviews:x=>base(x)&&obj(x)&&date(x.weekStart)&&['progress','problem','reason','method','goal','experimentName','experimentId'].every(k=>str(x[k]))&&domain(x.domainId),
 experiments:x=>base(x)&&obj(x)&&str(x.name)&&domain(x.domainId)&&str(x.problem)&&str(x.method)&&date(x.startDate)&&date(x.reviewDate)&&['计划中','进行中','已复盘'].includes(x.status as string)&&str(x.reflection)&&(!x.outcome||['方法有效，继续使用','有一定帮助，需要调整','效果不明显，尝试其他方法'].includes(x.outcome as string))&&(!x.weeklyReviewId||str(x.weeklyReviewId)),
 entries:x=>base(x)&&obj(x)&&str(x.title)&&date(x.date)&&domain(x.domainId)&&str(x.subcategory)&&domains.some(d=>d.id===x.domainId&&d.subcategories.includes(x.subcategory as string))&&str(x.content)&&stringArray(x.tags),
 treasures:x=>base(x)&&obj(x)&&['勇气时刻','第一次突破','我学会的好方法','值得纪念的经历'].includes(x.kind as string)&&str(x.title)&&date(x.date)&&str(x.content)&&(!x.sourceEntryId||str(x.sourceEntryId)),
 settings:x=>obj(x)&&x.key==='profile'&&str(x.nickname)&&x.nickname.length<=30,
 }
 for(const name of names){const seen=new Set<string>();for(const record of lists[name]){if(!checks[name](record))throw Error(`${name} 中有格式不正确的记录`);const key=name==='settings'?(record as {key:string}).key:(record as {id:string}).id;if(seen.has(key))throw Error(`${name} 中有重复 ID`);seen.add(key)}}
 const ids=(name:string)=>new Set(lists[name].map(x=>(x as {id:string}).id));const weekly=ids('weeklyReviews'),entries=ids('entries'),experiments=ids('experiments')
 for(const x of lists.experiments as {weeklyReviewId?:string}[])if(x.weeklyReviewId&&!weekly.has(x.weeklyReviewId))throw Error('成长实验关联的每周复盘不存在')
 for(const x of lists.weeklyReviews as {id:string;experimentId:string}[]){if(!experiments.has(x.experimentId))throw Error('每周复盘关联的成长实验不存在');if(!(lists.experiments as {id:string;weeklyReviewId?:string}[]).some(e=>e.id===x.experimentId&&e.weeklyReviewId===x.id))throw Error('每周复盘与成长实验的关联不一致')}
 for(const x of lists.treasures as {sourceEntryId?:string}[])if(x.sourceEntryId&&!entries.has(x.sourceEntryId))throw Error('宝藏关联的成长记录不存在')
 for(const [name,key] of [['dailyReviews','date'],['weeklyReviews','weekStart']] as const){const values=(lists[name] as Record<string,unknown>[]).map(x=>x[key]);if(new Set(values).size!==values.length)throw Error(`${name} 中有重复日期`)}
 return raw as unknown as Backup
}
