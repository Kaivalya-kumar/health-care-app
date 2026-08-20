import { NextRequest, NextResponse } from 'next/server'
import { getLogs, addLog, updateLog, deleteLog, LogEntry } from '@/lib/db'

// ensure these routes are always dynamic (no caching)
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const date = url.searchParams.get('date')
  const logs = await getLogs()
  const filtered = date ? logs.filter((l) => l.date === date) : logs
  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<LogEntry>
  // validate minimal
  if (!body.type || !body.date || !body.title || !body.time) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 })
  }
  const newLog: LogEntry = {
    id: Date.now().toString(),
    type: body.type as LogEntry['type'],
    date: body.date,
    title: body.title,
    value: body.value || '',
    calories: body.calories,
    duration: body.duration,
    time: body.time,
    completed: body.completed ?? true,
  }
  const saved = await addLog(newLog)
  return NextResponse.json(saved)
}

export async function PATCH(req: NextRequest) {
  const body = (await req.json()) as LogEntry
  if (!body.id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }
  const updated = await updateLog(body)
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 })
  }
  await deleteLog(id)
  return NextResponse.json({ ok: true })
}
