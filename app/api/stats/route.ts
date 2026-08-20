import { NextRequest, NextResponse } from 'next/server'
import { getLogs, getWeights } from '@/lib/db'
import { subDays, format } from 'date-fns'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const days = parseInt(url.searchParams.get('days') || '7', 10)
  const today = new Date()
  const start = subDays(today, days - 1)

  const logs = await getLogs()
  const weights = await getWeights()

  // prepare daily stats map
  const dailyStats: Record<
    string,
    { calories: number; water: number; sleep: number }
  > = {}
  for (let i = 0; i < days; i++) {
    const d = format(subDays(today, i), 'yyyy-MM-dd')
    dailyStats[d] = { calories: 0, water: 0, sleep: 0 }
  }

  logs.forEach((log) => {
    if (log.date in dailyStats) {
      const stat = dailyStats[log.date]
      switch (log.type) {
        case 'food':
          stat.calories += log.calories || 0
          break
        case 'water':
          stat.water += parseInt(log.value) || 0
          break
        case 'sleep':
          stat.sleep += parseFloat(log.value) || 0
          break
      }
    }
  })

  const activity = Object.entries(dailyStats)
    .map(([date, { calories, water, sleep }]) => ({
      day: format(new Date(date), 'EEE'),
      calories,
      water,
      sleep,
    }))
    .reverse()

  const weightTrend = weights
    .filter((w) => new Date(w.date) >= start)
    .map((w) => ({ date: format(new Date(w.date), 'EEE'), weight: w.weight }))

  return NextResponse.json({ activity, weightTrend })
}
