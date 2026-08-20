import { NextRequest, NextResponse } from 'next/server'
import { getAchievements, getBadges } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const type = url.searchParams.get('type')

  if (type === 'achievements') {
    const achievements = await getAchievements()
    return NextResponse.json(achievements)
  } else if (type === 'badges') {
    const badges = await getBadges()
    return NextResponse.json(badges)
  }

  // return both if no type specified
  const [achievements, badges] = await Promise.all([
    getAchievements(),
    getBadges(),
  ])
  return NextResponse.json({ achievements, badges })
}
