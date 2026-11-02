import type { DomainId } from '../types'
export interface Domain {id:DomainId; number:string; name:string; intro:string; question:string; subcategories:string[]; color:string; icon:string}
export const domains:Domain[]=[
 {id:'learning',number:'01',name:'学习成长',intro:'发现自己的学习方法，记下每一次新的理解。',question:'今天我学会了什么？遇到了什么问题？',subcategories:['语文','数学','英语','学习方法','错题反思','自主学习'],color:'blue',icon:'book'},
 {id:'emotion',number:'02',name:'情绪管理',intro:'认识心里的天气，找到照顾自己的办法。',question:'我现在是什么心情？为什么？',subcategories:['情绪识别','情绪表达','情绪调节','挫折应对','积极心态'],color:'pink',icon:'heart'},
 {id:'health',number:'03',name:'身体健康',intro:'听听身体的声音，给自己更多能量。',question:'什么让我的身体更舒服、更有活力？',subcategories:['运动','睡眠','户外活动','身体能量','健康习惯'],color:'green',icon:'sun'},
 {id:'habits',number:'04',name:'时间与习惯',intro:'练习规划，让每天更从容。',question:'我怎样安排时间，完成想做的事？',subcategories:['每日计划','时间管理','专注能力','自主整理','习惯养成'],color:'orange',icon:'clock'},
 {id:'relationships',number:'05',name:'人际与品格',intro:'学习表达、倾听，也学习与别人一起解决问题。',question:'今天我怎样理解自己和别人？',subcategories:['家庭沟通','同伴关系','合作能力','同理心','责任意识','冲突解决'],color:'purple',icon:'users'},
 {id:'creativity',number:'06',name:'兴趣与创造',intro:'保留好奇心，把有趣的发现收藏起来。',question:'最近有什么让我想继续探索？',subcategories:['阅读探索','好奇问题','创意思考','生活实践','兴趣发现'],color:'yellow',icon:'sparkles'},
 {id:'self',number:'07',name:'自我认知',intro:'看见自己的优势，也欣赏正在努力的自己。',question:'我发现了怎样的自己？',subcategories:['我的优势','我正在努力的事','勇气时刻','个人目标','成长感悟'],color:'teal',icon:'compass'},
]
export const domainById=(id:DomainId)=>domains.find(d=>d.id===id)!
