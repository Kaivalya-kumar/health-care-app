import { NextRequest, NextResponse } from 'next/server'
import { calculateGoalProgress } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const date = url.searchParams.get('date')

  if (!category) {
    return NextResponse.json({ error: 'category required' }, { status: 400 })
  }

  try {
    const result = await calculateGoalProgress(category, date || undefined)
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: 'failed to calculate progress' }, { status: 500 })
  }
}
