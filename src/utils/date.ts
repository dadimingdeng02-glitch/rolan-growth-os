export const localDate=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
export const weekStart=(date=new Date())=>{const d=new Date(date.getFullYear(),date.getMonth(),date.getDate());d.setDate(d.getDate()-((d.getDay()+6)%7));return localDate(d)}
export const addDays=(value:string,days:number)=>{const [y,m,d]=value.split('-').map(Number);return localDate(new Date(y,m-1,d+days))}
export const niceDate=(value:string)=>{const [y,m,d]=value.split('-').map(Number);return `${y}年${m}月${d}日`}
export const stamp=()=>new Date().toISOString()
export const fresh=()=>({id:crypto.randomUUID(),createdAt:stamp(),updatedAt:stamp()})
