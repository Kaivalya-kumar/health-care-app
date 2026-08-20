'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Heart, Droplet, Moon, Zap, Target, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { fetchStats, fetchLogs } from '@/lib/api'

// placeholder until data loads
// note: weightData and activityData are maintained in state now

export default function DashboardPage() {
  const [weightData, setWeightData] = useState<{ date: string; weight: number }[]>([])
  const [activityData, setActivityData] = useState<any[]>([])
  const [todayStats, setTodayStats] = useState({ calories: 0, water: 0, exercise: 0, sleep: 0 })
  const [profile, setProfile] = useState<any>(null)

  // Generate 14-day weight graph based on user's registered weight
  // previous days start heavier and decrease randomly (0.1–0.2kg/day) until arriving
  // at the supplied currentWeight on the final (most recent) day.
  const generateWeightGraph = (currentWeight: number) => {
    const data: { date: string; weight: number }[] = []
    const today = new Date()
    // build array backwards from currentWeight
    let weight = currentWeight
    // create 14 entries, pushing from oldest to newest
    const weights: number[] = []
    for (let day = 13; day >= 0; day--) {
      if (day === 13) {
        weights.unshift(weight) // newest
      } else {
        // prior day heavier by random 0.1-0.2kg
        const delta = 0.1 + Math.random() * 0.1
        weight = weight + delta
        weights.unshift(weight)
      }
    }
    // now weights[0] is earliest, weights[13] = currentWeight
    for (let i = 0; i < weights.length; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (13 - i))
      data.push({ date: date.toISOString().split('T')[0], weight: parseFloat(weights[i].toFixed(1)) })
    }
    return data
  }

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (!weight || !height || !age) return null
    // Mifflin-St Jeor equation
    let bmr: number
    if (gender && gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    return Math.round(bmr)
  }

  useEffect(() => {
    // Load user profile from localStorage
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setProfile(u)
        // Generate weight graph from registered weight
        if (u.currentWeight) {
          setWeightData(generateWeightGraph(u.currentWeight))
        }
      } catch (err) {
        console.error('Error loading profile:', err)
      }
    }

    // get weekly stats
    fetchStats(7)
      .then((data) => {
        setActivityData(data.activity || [])
      })
      .catch(console.error)

    // get today's logs for metrics
    const today = new Date().toISOString().split('T')[0]
    fetchLogs(today)
      .then((logs) => {
        let calories = 0
        let water = 0
        let exercise = 0
        let sleep = 0
        logs.forEach((log: any) => {
          if (log.type === 'food') calories += log.calories || 0
          if (log.type === 'water') water += parseInt(log.value || '0')
          if (log.type === 'workout') exercise += log.duration || 0
          if (log.type === 'sleep') sleep += parseFloat(log.value || '0')
        })
        setTodayStats({ calories, water, exercise, sleep })
      })
      .catch(console.error)
  }, [])

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome to Your Dashboard!</h2>
            <p className="text-foreground/60">
              You're doing great! Keep tracking your health metrics and achieving your wellness goals.
            </p>
          </div>
          <Link href="/dashboard/daily-log">
            <Button className="mt-4">
              Log Today's Activity
            </Button>
          </Link>
        </Card>

        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Health Metrics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">BMI</span>
                <span className="font-semibold text-primary">{profile && calculateBMI(profile.currentWeight, profile.height) ? calculateBMI(profile.currentWeight, profile.height) : '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Daily BMR</span>
                <span className="font-semibold text-secondary">{profile && calculateBMR(profile.currentWeight, profile.height, profile.age, profile.gender) ? calculateBMR(profile.currentWeight, profile.height, profile.age, profile.gender) : '—'} kcal</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground/60">Current Weight</span>
                <span className="font-semibold text-accent">{profile?.currentWeight || '—'} kg</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <MetricCard
          icon={<Heart className="w-6 h-6" />}
          label="Calories Today"
          value={todayStats.calories.toString()}
          unit="kcal"
          target="2000 kcal"
          progress={(todayStats.calories / 2000) * 100}
        />
        <MetricCard
          icon={<Droplet className="w-6 h-6" />}
          label="Water Intake"
          value={(todayStats.water / 1000).toFixed(1)}
          unit="L"
          target="3 L"
          progress={(todayStats.water / 3000) * 100}
        />
        <MetricCard
          icon={<Zap className="w-6 h-6" />}
          label="Exercise Time"
          value={todayStats.exercise.toString()}
          unit="min"
          target="60 min"
          progress={(todayStats.exercise / 60) * 100}
        />
        <MetricCard
          icon={<Moon className="w-6 h-6" />}
          label="Sleep Quality"
          value={todayStats.sleep.toFixed(1)}
          unit="h"
          progress={(todayStats.sleep / 8) * 100}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Weight Trend</h3>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--foreground)" opacity={0.6} />
                <YAxis stroke="var(--foreground)" opacity={0.6} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="var(--primary)"
                  dot={{ fill: 'var(--primary)' }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Weekly Activity</h3>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--foreground)" opacity={0.6} />
                <YAxis stroke="var(--foreground)" opacity={0.6} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                />
                <Bar dataKey="calories" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Quick Access */}
      <Card className="p-6 border border-border">
        <h3 className="font-semibold text-foreground mb-4">Quick Access</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/dashboard/profile">
            <div className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Update Profile</h4>
                  <p className="text-xs text-foreground/60">Manage health info</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/goals">
            <div className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Review Goals</h4>
                  <p className="text-xs text-foreground/60">Track progress</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/dashboard/achievements">
            <div className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Achievements</h4>
                  <p className="text-xs text-foreground/60">View badges</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  )
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  target,
  progress,
}: {
  icon: React.ReactNode
  label: string
  value: string
  unit: string
  target?: string
  progress?: number
}) {
  return (
    <Card className="p-4 border border-border">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-foreground/60 uppercase">{label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {value} <span className="text-sm text-foreground/60">{unit}</span>
            </p>
          </div>
          <div className="text-primary opacity-80">{icon}</div>
        </div>
        {target && <p className="text-xs text-foreground/50">Goal: {target}</p>}
        {progress !== undefined && (
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </Card>
  )
}
