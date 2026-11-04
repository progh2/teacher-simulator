import type { DifficultyId } from './types'

const KEY = 'teacher-sim-omr-best-v1'

export type BestMap = Partial<Record<DifficultyId, { score: number; at: string }>>

export function loadBest(): BestMap {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    return JSON.parse(raw) as BestMap
  } catch {
    return {}
  }
}

export function saveBest(diff: DifficultyId, score: number): BestMap {
  const cur = loadBest()
  const prev = cur[diff]?.score ?? -1
  if (score >= prev) {
    cur[diff] = { score, at: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(cur))
  }
  return cur
}
