import { NextRequest, NextResponse } from 'next/server'
import { getWeights, addWeight, WeightEntry } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const weights = await getWeights()
  return NextResponse.json(weights)
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<WeightEntry>
  if (!body.date || typeof body.weight !== 'number') {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }
  const entry: WeightEntry = {
    id: Date.now().toString(),
    date: body.date,
    weight: body.weight,
  }
  const saved = await addWeight(entry)
  return NextResponse.json(saved)
}
