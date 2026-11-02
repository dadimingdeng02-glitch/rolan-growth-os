export type DomainId = 'learning'|'emotion'|'health'|'habits'|'relationships'|'creativity'|'self'
export type Mood = '开心'|'平静'|'难过'|'委屈'|'生气'|'紧张'|'兴奋'
export type ExperimentStatus = '计划中'|'进行中'|'已复盘'
export type ExperimentOutcome = '方法有效，继续使用'|'有一定帮助，需要调整'|'效果不明显，尝试其他方法'
export type TreasureKind = '勇气时刻'|'第一次突破'|'我学会的好方法'|'值得纪念的经历'
export interface BaseRecord { id:string; createdAt:string; updatedAt:string }
export interface DailyReview extends BaseRecord { date:string; moods:Mood[]; good:string; difficulty:string; tomorrow:string; status:'draft'|'complete' }
export interface WeeklyReview extends BaseRecord { weekStart:string; progress:string; problem:string; reason:string; method:string; goal:string; domainId:DomainId; experimentName:string; experimentId:string }
export interface Experiment extends BaseRecord { weeklyReviewId?:string; name:string; domainId:DomainId; problem:string; method:string; startDate:string; reviewDate:string; status:ExperimentStatus; outcome?:ExperimentOutcome; reflection:string }
export interface GrowthEntry extends BaseRecord { title:string; date:string; domainId:DomainId; subcategory:string; content:string; tags:string[] }
export interface Treasure extends BaseRecord { kind:TreasureKind; title:string; date:string; content:string; sourceEntryId?:string }
export interface Settings { key:'profile'; nickname:string }
export interface Backup { app:'rolan-growth-os'; version:1; exportedAt:string; data:{dailyReviews:DailyReview[]; weeklyReviews:WeeklyReview[]; experiments:Experiment[]; entries:GrowthEntry[]; treasures:Treasure[]; settings:Settings[]} }
