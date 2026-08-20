import { LogEntry } from './db'

export async function fetchLogs(date?: string): Promise<LogEntry[]> {
  const params = date ? `?date=${encodeURIComponent(date)}` : ''
  const res = await fetch(`/api/logs${params}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}

export async function createLog(entry: Partial<LogEntry>): Promise<LogEntry> {
  const res = await fetch('/api/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error('Failed to create log')
  return res.json()
}

export async function deleteLog(id: string): Promise<void> {
  const res = await fetch(`/api/logs?id=${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete log')
}

export async function updateLog(entry: LogEntry): Promise<LogEntry> {
  const res = await fetch('/api/logs', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error('Failed to update log')
  return res.json()
}

export async function fetchStats(days = 7): Promise<any> {
  const res = await fetch(`/api/stats?days=${days}`)
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export interface WeightEntry {
  id: string
  date: string
  weight: number
}

export async function fetchWeights(): Promise<WeightEntry[]> {
  const res = await fetch('/api/weight')
  if (!res.ok) throw new Error('Failed to fetch weights')
  return res.json()
}

export async function addWeight(entry: { date: string; weight: number }): Promise<WeightEntry> {
  const res = await fetch('/api/weight', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  })
  if (!res.ok) throw new Error('Failed to add weight')
  return res.json()
}

export interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  status: 'locked' | 'in-progress' | 'unlocked'
  reward: string
}

export interface Badge {
  id: string
  name: string
  description: string
  earnedDate: string | null
  unlocked: boolean
  category: string
}

export async function fetchAchievements(): Promise<Achievement[]> {
  const res = await fetch('/api/achievements?type=achievements')
  if (!res.ok) throw new Error('Failed to fetch achievements')
  return res.json()
}

export async function fetchBadges(): Promise<Badge[]> {
  const res = await fetch('/api/achievements?type=badges')
  if (!res.ok) throw new Error('Failed to fetch badges')
  return res.json()
}

export async function fetchGoalProgress(
  category: string,
  date?: string
): Promise<{ current: string | number; progress: number }> {
  const params = `category=${encodeURIComponent(category)}${date ? `&date=${encodeURIComponent(date)}` : ''}`
  const res = await fetch(`/api/goal-progress?${params}`)
  if (!res.ok) throw new Error('Failed to fetch goal progress')
  return res.json()
}
