import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Search, Sparkles } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { interests } from '../../config/interests'
import { Heading } from '../../components/UI'

const pageSize = 24

export function InterestsPage() {
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const [page, setPage] = useState(1)
  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('zh-CN')
    return needle ? interests.filter(item => [item.兴趣点, item.第一次尝试, item.发展方向].some(text => text.toLocaleLowerCase('zh-CN').includes(needle))) : interests
  }, [query])
  useEffect(() => setPage(1), [query])
  const shown = filtered.slice(0, page * pageSize)

  return <>
    <Link className="back-link" to="/domains/creativity"><ArrowLeft size={16}/> 返回兴趣与创造</Link>
    <Heading eyebrow="INTEREST ATLAS · 420 IDEAS" title="兴趣探索图鉴" desc="从一件具体的小事开始，看看自己想不想继续探索。没有必须完成的项目。"/>
    <section className="panel interest-intro"><span className="interest-intro-icon"><Sparkles size={22}/></span><div><h2>好奇心可以从任何地方开始</h2><p>每个兴趣点都有一次可以动手的尝试，也有一个可能继续走的方向。选你喜欢的就好。</p></div></section>
    <div className="interest-toolbar"><label className="interest-search"><Search size={18}/><input aria-label="搜索兴趣项目" value={query} onChange={event => setParams(event.target.value ? { q: event.target.value } : {})} placeholder="搜索兴趣、尝试或发展方向"/></label><span>找到 {filtered.length} / {interests.length} 项</span></div>
    {filtered.length ? <><div className="interest-list">{shown.map(item => <article className="panel interest-card" key={item.id}><div className="interest-card-top"><span className="interest-id">{item.id}</span><h2>{item.兴趣点}</h2></div><div className="interest-detail"><span>第一次尝试</span><p>{item.第一次尝试}</p></div><div className="interest-detail"><span>可能的发展方向</span><p>{item.发展方向}</p></div><Link className="plain-link" to={`/entry/new?domain=creativity&interest=${item.id}`}>记录我的体验 <ArrowRight size={16}/></Link></article>)}</div>{shown.length < filtered.length && <button className="btn subtle more-interests" onClick={() => setPage(value => value + 1)}>继续看更多（还有 {filtered.length - shown.length} 项）</button>}</> : <div className="empty"><h3>暂时没有找到</h3><p>试试更短的关键词，比如“地图”或“故事”。</p></div>}
  </>
}
