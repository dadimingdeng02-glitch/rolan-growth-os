import Dexie, { type EntityTable } from 'dexie'
import type { DailyReview,WeeklyReview,Experiment,GrowthEntry,Treasure,Settings,Backup,BaseRecord } from '../types'
import { validateBackup } from './validate'

export class GrowthDB extends Dexie {
  dailyReviews!:EntityTable<DailyReview,'id'>
  weeklyReviews!:EntityTable<WeeklyReview,'id'>
  experiments!:EntityTable<Experiment,'id'>
  entries!:EntityTable<GrowthEntry,'id'>
  treasures!:EntityTable<Treasure,'id'>
  settings!:EntityTable<Settings,'key'>
  constructor(name='RolanGrowthOS'){
    super(name)
    this.version(1).stores({dailyReviews:'id,date,updatedAt',weeklyReviews:'id,weekStart,updatedAt',experiments:'id,domainId,status,weeklyReviewId',entries:'id,date,domainId',treasures:'id,date,sourceEntryId',settings:'key'})
  }
}
export const db=new GrowthDB()
export async function deleteEntry(id:string,database=db){await database.transaction('rw',database.entries,database.treasures,async()=>{await database.entries.delete(id);await database.treasures.where('sourceEntryId').equals(id).delete()})}
export async function deleteWeekly(id:string,database=db){await database.transaction('rw',database.weeklyReviews,database.experiments,async()=>{await database.weeklyReviews.delete(id);await database.experiments.where('weeklyReviewId').equals(id).delete()})}
export async function exportBackup(database=db):Promise<Backup>{return {app:'rolan-growth-os',version:1,exportedAt:new Date().toISOString(),data:{dailyReviews:await database.dailyReviews.toArray(),weeklyReviews:await database.weeklyReviews.toArray(),experiments:await database.experiments.toArray(),entries:await database.entries.toArray(),treasures:await database.treasures.toArray(),settings:await database.settings.toArray()}}}

const newer=(incoming:BaseRecord,existing:BaseRecord)=>Date.parse(incoming.updatedAt)>Date.parse(existing.updatedAt)
export async function importBackup(raw:unknown,mode:'merge'|'replace',database=db){
  const {data:d}=validateBackup(raw)
  await database.transaction('rw',[database.dailyReviews,database.weeklyReviews,database.experiments,database.entries,database.treasures,database.settings],async()=>{
    if(mode==='replace')await Promise.all([database.dailyReviews.clear(),database.weeklyReviews.clear(),database.experiments.clear(),database.entries.clear(),database.treasures.clear(),database.settings.clear()])
    for(const record of d.dailyReviews){
      const sameDate=mode==='merge'?await database.dailyReviews.where('date').equals(record.date).first():undefined
      if(sameDate&&sameDate.id!==record.id){if(!newer(record,sameDate))continue;await database.dailyReviews.delete(sameDate.id)}
      const sameId=mode==='merge'?await database.dailyReviews.get(record.id):undefined
      if(!sameId||newer(record,sameId)||mode==='replace')await database.dailyReviews.put(record)
    }
    for(const record of d.weeklyReviews){
      const sameWeek=mode==='merge'?await database.weeklyReviews.where('weekStart').equals(record.weekStart).first():undefined
      if(sameWeek&&sameWeek.id!==record.id){if(!newer(record,sameWeek))continue;await database.weeklyReviews.delete(sameWeek.id);await database.experiments.where('weeklyReviewId').equals(sameWeek.id).delete()}
      const sameId=mode==='merge'?await database.weeklyReviews.get(record.id):undefined
      if(!sameId||newer(record,sameId)||mode==='replace')await database.weeklyReviews.put(record)
    }
    for(const record of d.entries){const same=mode==='merge'?await database.entries.get(record.id):undefined;if(!same||newer(record,same)||mode==='replace')await database.entries.put(record)}
    for(const record of d.experiments){if(record.weeklyReviewId&&!await database.weeklyReviews.get(record.weeklyReviewId))continue;const same=mode==='merge'?await database.experiments.get(record.id):undefined;if(!same||newer(record,same)||mode==='replace')await database.experiments.put(record)}
    for(const record of d.treasures){
      if(record.sourceEntryId&&!await database.entries.get(record.sourceEntryId))continue
      const sameSource=mode==='merge'&&record.sourceEntryId?await database.treasures.where('sourceEntryId').equals(record.sourceEntryId).first():undefined
      if(sameSource&&sameSource.id!==record.id){if(!newer(record,sameSource))continue;await database.treasures.delete(sameSource.id)}
      const same=mode==='merge'?await database.treasures.get(record.id):undefined
      if(!same||newer(record,same)||mode==='replace')await database.treasures.put(record)
    }
    for(const setting of d.settings)await database.settings.put(setting)
  })
}
