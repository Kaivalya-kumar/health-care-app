# WellNest Backend Setup Guide

## Overview

The backend for this wellness tracking app is a **minimal Next.js API** that uses a local JSON file (`data/db.json`) as the database. This approach is perfect for development and small deployments.

## Architecture

### File Structure
```
app/api/
  logs/         → Daily activity logs (food, water, workout, sleep)
  weight/       → Weight tracking history
  stats/        → Weekly/monthly activity statistics
  achievements/ → Achievements and badges
lib/
  db.ts         → Database layer (read/write JSON)
  api.ts        → Frontend API helper functions
data/
  db.json       → Local JSON database
```

### API Routes

#### 1. **Logs API** (`/api/logs`)
Manage daily activity entries.

**GET** - Fetch logs
```bash
GET /api/logs                    # all logs
GET /api/logs?date=2026-03-01   # logs for specific date
```

**POST** - Create new log entry
```json
{
  "type": "food",
  "date": "2026-03-01",
  "title": "Breakfast - Oatmeal",
  "value": "350 kcal",
  "calories": 350,
  "time": "08:00 AM"
}
```

**PATCH** - Update log entry
```json
{
  "id": "1",
  "completed": true
}
```

**DELETE** - Remove log entry
```bash
DELETE /api/logs?id=1
```

#### 2. **Weight API** (`/api/weight`)
Track weight changes over time.

**GET** - Fetch all weight entries
```bash
GET /api/weight
```

**POST** - Add weight entry
```json
{
  "date": "2026-03-01",
  "weight": 183.5
}
```

#### 3. **Stats API** (`/api/stats`)
Get aggregated activity statistics.

**GET** - Fetch stats
```bash
GET /api/stats?days=7   # last 7 days
```

Returns:
```json
{
  "activity": [
    { "day": "Mon", "calories": 450, "water": 2800, "sleep": 7 },
    ...
  ],
  "weightTrend": [
    { "date": "Mon", "weight": 185 },
    ...
  ]
}
```

#### 4. **Achievements API** (`/api/achievements`)
Query achievement and badge data.

**GET** - Fetch achievements and badges
```bash
GET /api/achievements                    # both
GET /api/achievements?type=achievements # achievements only
GET /api/achievements?type=badges       # badges only
```

---

## How Data Flows

### Example: Creating a Daily Log Entry

1. **Frontend** (`DailyLogPage.tsx`)
   - User fills in food/workout/water form
   - Calls `createLog()` from `lib/api.ts`

2. **API Layer** (`lib/api.ts`)
   - Sends POST request to `/api/logs`
   - Returns saved entry with auto-generated ID

3. **Backend** (`app/api/logs/route.ts`)
   - Validates incoming data
   - Calls `addLog()` from `lib/db.ts`

4. **Database** (`lib/db.ts`)
   - Reads `data/db.json`
   - Appends new entry
   - Writes back to file

5. **Frontend** Updates
   - State is updated with returned entry
   - UI re-renders with new log entry

---

## Database (`data/db.json`)

The JSON file is structured as:

```json
{
  "logs": [
    {
      "id": "1",
      "date": "2026-03-01",
      "type": "food",
      "title": "Breakfast",
      "value": "350 kcal",
      "calories": 350,
      "time": "08:00 AM",
      "completed": true
    },
    ...
  ],
  "weights": [
    {
      "id": "w1",
      "date": "2026-02-25",
      "weight": 185
    },
    ...
  ],
  "achievements": [],
  "badges": []
}
```

---

## Frontend Integration

### Pages Connected to Backend

1. **Daily Log** (`app/dashboard/daily-log/page.tsx`)
   - Fetches logs by selected date
   - Creates/updates/deletes entries
   - Shows daily totals (calories, water, exercise)

2. **Dashboard** (`app/dashboard/page.tsx`)
   - Fetches weekly stats
   - Shows weight trend chart
   - Shows activity bar chart
   - Displays today's metrics

3. **Profile** (`app/dashboard/profile/page.tsx`)
   - Fetches weight history
   - Allows adding new weight entries
   - Shows weight change graph

4. **Achievements** (`app/dashboard/achievements/page.tsx`)
   - Fetches badges and achievements
   - Displays earned/locked badges
   - Shows progress bars for active achievements

---

## Running the App

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Open browser**
   ```
   http://localhost:3000
   ```

---

## Testing the API

You can test API endpoints using `curl`:

```bash
# Create a log entry
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "type": "food",
    "date": "2026-03-02",
    "title": "Lunch",
    "value": "450 kcal",
    "calories": 450,
    "time": "12:30 PM"
  }'

# Get logs for today
curl http://localhost:3000/api/logs?date=2026-03-02

# Get weekly stats
curl http://localhost:3000/api/stats?days=7
```

---

## Extending the Backend

### Adding a New Endpoint

1. **Create API route** (`app/api/new-feature/route.ts`)
   ```typescript
   import { NextRequest, NextResponse } from 'next/server'

   export const dynamic = 'force-dynamic'

   export async function GET(req: NextRequest) {
     // handle request
     return NextResponse.json({ data: [] })
   }
   ```

2. **Add database functions** (`lib/db.ts`)
   ```typescript
   export async function getFeature() { ... }
   export async function addFeature(item) { ... }
   ```

3. **Export API helper** (`lib/api.ts`)
   ```typescript
   export async function fetchFeature() {
     const res = await fetch('/api/new-feature')
     if (!res.ok) throw new Error('Failed')
     return res.json()
   }
   ```

4. **Use in components**
   ```typescript
   import { fetchFeature } from '@/lib/api'

   useEffect(() => {
     fetchFeature().then(setData).catch(console.error)
   }, [])
   ```

---

## Notes

- **Database persistence**: Data is saved to `data/db.json` on disk. Changes persist between server restarts.
- **Concurrency**: For production, consider a real database (PostgreSQL, MongoDB).
- **Authentication**: Currently no auth – anyone can modify data. Add user validation in future.
- **CORS**: Not needed (same-origin requests).
- **Caching**: All routes have `export const dynamic = 'force-dynamic'` to prevent caching.

---

## Troubleshooting

**Data not persisting?**
- Check that `data/db.json` exists and is writable
- Verify `lib/db.ts` paths are correct

**API returns 400 Bad Request?**
- Ensure required fields are in request body
- Check Content-Type header is `application/json`

**Charts show no data?**
- Make sure logs have the correct date format (YYYY-MM-DD)
- Verify weights are in the database

---

All core features are now connected! You can log activities, track weight, view charts, and manage achievements — all through a simple, file-based backend.
