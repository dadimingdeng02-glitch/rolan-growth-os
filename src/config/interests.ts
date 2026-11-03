import source from '../data/interests.json'

export interface InterestItem {
  id: string
  兴趣点: string
  第一次尝试: string
  发展方向: string
}

export const interests: InterestItem[] = source.items
export const findInterest = (id: string | null) => interests.find(item => item.id === id)
