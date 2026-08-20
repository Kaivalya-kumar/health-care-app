import { promises as fs } from 'fs'
import path from 'path'

const dbPath = path.join(process.cwd(), 'data', 'db.json')

export interface LogEntry {
  id: string
  date: string // YYYY-MM-DD
  type: 'food' | 'water' | 'workout' | 'sleep'
  title: string
  value: string
  calories?: number
  duration?: number
  completed: boolean
  time: string
}

export interface WeightEntry {
  id: string
  date: string // YYYY-MM-DD
  weight: number
}

export interface Badge {
  id: string
  name: string
  description: string
  // icon is not serializable; frontend will map icon names
  earnedDate: string | null
  unlocked: boolean
  category: string
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

interface RawDB {
  logs: LogEntry[]
  weights: WeightEntry[]
  achievements: Achievement[]
  badges: Badge[]
}

async function readDB(): Promise<RawDB> {
  try {
    const content = await fs.readFile(dbPath, 'utf-8')
    return JSON.parse(content) as RawDB
  } catch (e) {
    // if file doesn't exist or is invalid, start fresh
    return { logs: [], weights: [], achievements: [], badges: [] }
  }
}

async function writeDB(db: RawDB) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
}

/* log helpers */
export async function getLogs(): Promise<LogEntry[]> {
  const db = await readDB()
  return db.logs
}

export async function addLog(entry: LogEntry): Promise<LogEntry> {
  const db = await readDB()
  db.logs.push(entry)
  await writeDB(db)
  return entry
}

export async function updateLog(entry: LogEntry): Promise<LogEntry> {
  const db = await readDB()
  const idx = db.logs.findIndex((l) => l.id === entry.id)
  if (idx !== -1) {
    db.logs[idx] = entry
    await writeDB(db)
  }
  return entry
}

export async function deleteLog(id: string): Promise<void> {
  const db = await readDB()
  db.logs = db.logs.filter((l) => l.id !== id)
  await writeDB(db)
}

/* achievement and badge helpers */
export async function getAchievements(): Promise<Achievement[]> {
  const db = await readDB()
  return db.achievements
}

export async function getBadges(): Promise<Badge[]> {
  const db = await readDB()
  return db.badges
}

/* weight helpers */
export async function getWeights(): Promise<WeightEntry[]> {
  const db = await readDB()
  return db.weights
}

export async function addWeight(entry: WeightEntry): Promise<WeightEntry> {
  const db = await readDB()
  db.weights.push(entry)
  await writeDB(db)
  return entry
}

export async function updateWeight(entry: WeightEntry): Promise<WeightEntry> {
  const db = await readDB()
  const idx = db.weights.findIndex((w) => w.id === entry.id)
  if (idx !== -1) {
    db.weights[idx] = entry
    await writeDB(db)
  }
  return entry
}

export async function deleteWeight(id: string): Promise<void> {
  const db = await readDB()
  db.weights = db.weights.filter((w) => w.id !== id)
  await writeDB(db)
}

/* goal progress calculation - based on actual daily logs */
export async function calculateGoalProgress(
  category: string,
  date?: string
): Promise<{ current: string | number; progress: number }> {
  const logs = await getLogs()
  const today = date || new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter((l) => l.date === today)

  switch (category) {
    case 'water': {
      const waterMl = todayLogs
        .filter((l) => l.type === 'water')
        .reduce((sum, l) => sum + (parseInt(l.value) || 0), 0)
      const target = 3000
      return {
        current: `${waterMl} ml`,
        progress: Math.round((waterMl / target) * 100),
      }
    }
    case 'exercise': {
      const duration = todayLogs
        .filter((l) => l.type === 'workout')
        .reduce((sum, l) => sum + (l.duration || 0), 0)
      const target = 60
      return {
        current: `${duration} min`,
        progress: Math.round((duration / target) * 100),
      }
    }
    case 'nutrition': {
      const calories = todayLogs
        .filter((l) => l.type === 'food')
        .reduce((sum, l) => sum + (l.calories || 0), 0)
      const target = 2000
      return {
        current: `${calories} kcal`,
        progress: Math.round((calories / target) * 100),
      }
    }
    case 'sleep': {
      const sleep = todayLogs
        .filter((l) => l.type === 'sleep')
        .reduce((sum, l) => sum + parseFloat(l.value || '0'), 0)
      const target = 8
      return {
        current: `${sleep} hours`,
        progress: Math.round((sleep / target) * 100),
      }
    }
    case 'weight': {
      const weights = await getWeights()
      if (weights.length === 0) return { current: 'N/A', progress: 0 }
      const latest = weights[weights.length - 1]
      return {
        current: `${latest.weight} kg`,
        progress: 50,
      }
    }
    default:
      return { current: '0', progress: 0 }
  }
}
