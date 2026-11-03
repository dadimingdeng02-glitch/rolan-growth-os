import { expect, test } from 'vitest'
import { findInterest, interests } from './interests'

test('the imported catalog contains all 420 complete and distinct projects', () => {
  expect(interests).toHaveLength(420)
  expect(new Set(interests.map(item => item.id)).size).toBe(420)
  expect(new Set(interests.map(item => item.兴趣点)).size).toBe(420)
  expect(interests.every(item => item.兴趣点.trim() && item.第一次尝试.trim() && item.发展方向.trim())).toBe(true)
  expect(findInterest('R001')).toBe(interests[0])
  expect(findInterest('R420')).toBe(interests[419])
})
