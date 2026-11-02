import 'fake-indexeddb/auto'
import { afterEach,expect,test } from 'vitest'
import { GrowthDB,exportBackup,importBackup } from './index'
import type { DailyReview,Experiment,GrowthEntry,WeeklyReview,Treasure } from '../types'
const now='2026-11-02T10:00:00.000Z'
const base=(id:string)=>({id,createdAt:now,updatedAt:now})
const daily:DailyReview={...base('daily-1'),date:'2026-11-02',moods:['开心','平静'],good:'学会了一件事',difficulty:'',tomorrow:'再试一次',status:'complete'}
const entry:GrowthEntry={...base('entry-1'),title:'我的发现',date:'2026-11-02',domainId:'learning',subcategory:'数学',content:'找到一种方法',tags:['方法']}
const weekly:WeeklyReview={...base('week-1'),weekStart:'2026-11-02',progress:'更专注',problem:'分心',reason:'计划太大',method:'分成小步',goal:'先做十分钟',domainId:'habits',experimentName:'小步计划',experimentId:'exp-1'}
const experiment:Experiment={...base('exp-1'),weeklyReviewId:'week-1',name:'小步计划',domainId:'habits',problem:'分心',method:'分成小步',startDate:'2026-11-09',reviewDate:'2026-11-16',status:'计划中',reflection:''}
const treasure:Treasure={...base('treasure-1'),kind:'我学会的好方法',title:'我的发现',date:'2026-11-02',content:'找到一种方法',sourceEntryId:'entry-1'}
const names:string[]=[]
const make=()=>{const name=`RolanTest-${crypto.randomUUID()}`;names.push(name);return new GrowthDB(name)}
afterEach(async()=>{for(const name of names.splice(0))await DexieDelete(name)})
async function DexieDelete(name:string){const d=new GrowthDB(name);await d.delete()}
test('records survive a database reopen and backup restores all linked records',async()=>{const a=make();await a.dailyReviews.add(daily);await a.entries.add(entry);await a.weeklyReviews.add(weekly);await a.experiments.add(experiment);await a.treasures.add(treasure);a.close();const reopened=new GrowthDB(a.name);expect((await reopened.dailyReviews.get(daily.id))?.good).toBe(daily.good);const backup=await exportBackup(reopened);const b=make();await importBackup(backup,'replace',b);expect(await b.entries.count()).toBe(1);expect((await b.experiments.get('exp-1'))?.weeklyReviewId).toBe('week-1');expect((await b.treasures.get('treasure-1'))?.sourceEntryId).toBe('entry-1');reopened.close();b.close()})
test('merge keeps newer local record and adds missing records',async()=>{const d=make();await d.dailyReviews.add({...daily,good:'后来修改',updatedAt:'2026-11-03T10:00:00.000Z'});const backup={app:'rolan-growth-os',version:1,exportedAt:now,data:{dailyReviews:[daily],weeklyReviews:[],experiments:[],entries:[entry],treasures:[],settings:[]}};await importBackup(backup,'merge',d);expect((await d.dailyReviews.get(daily.id))?.good).toBe('后来修改');expect(await d.entries.count()).toBe(1);d.close()})
test('invalid backup is rejected before existing data changes',async()=>{const d=make();await d.dailyReviews.add(daily);const backup={app:'rolan-growth-os',version:1,exportedAt:now,data:{dailyReviews:[{...daily,moods:['未知心情']}],weeklyReviews:[],experiments:[],entries:[],treasures:[],settings:[]}};await expect(importBackup(backup,'replace',d)).rejects.toThrow();expect(await d.dailyReviews.count()).toBe(1);d.close()})
test('merge does not duplicate a day imported under another ID',async()=>{const d=make();await d.dailyReviews.add(daily);const incoming={...daily,id:'other-id',good:'更新的复盘',updatedAt:'2026-11-04T10:00:00.000Z'};await importBackup({app:'rolan-growth-os',version:1,exportedAt:now,data:{dailyReviews:[incoming],weeklyReviews:[],experiments:[],entries:[],treasures:[],settings:[]}},'merge',d);expect(await d.dailyReviews.count()).toBe(1);expect((await d.dailyReviews.toArray())[0].good).toBe('更新的复盘');d.close()})
