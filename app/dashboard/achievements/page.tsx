'use client'

import { Card } from '@/components/ui/card'
import { Award, Flame, Zap, Heart, Droplet, Target, TrendingUp, Calendar } from 'lucide-react'

interface Badge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  // earnedDate may be null for badges not yet earned
  earnedDate: string | null
  unlocked: boolean
  category: string
}

interface Achievement {
  id: string
  title: string
  description: string
  progress: number
  target: number
  status: 'locked' | 'in-progress' | 'unlocked'
  reward: string
  icon: React.ReactNode
}

export default function AchievementsPage() {
  const badges: Badge[] = [
    {
      id: '1',
      name: 'First Step',
      description: 'Complete your first daily log',
      icon: <Target className="w-8 h-8" />,
      earnedDate: '2026-01-15',
      unlocked: true,
      category: 'Getting Started',
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Log activity for 7 consecutive days',
      icon: <Flame className="w-8 h-8" />,
      earnedDate: '2026-01-22',
      unlocked: true,
      category: 'Consistency',
    },
    {
      id: '3',
      name: 'Hydration Master',
      description: 'Drink 3L water daily for 30 days',
      icon: <Droplet className="w-8 h-8" />,
      earnedDate: '2026-02-15',
      unlocked: true,
      category: 'Hydration',
    },
    {
      id: '4',
      name: 'Fit & Strong',
      description: 'Complete 50 workouts',
      icon: <Zap className="w-8 h-8" />,
      earnedDate: '2026-02-28',
      unlocked: true,
      category: 'Exercise',
    },
    {
      id: '5',
      name: 'Goal Getter',
      description: 'Achieve 5 wellness goals',
      icon: <Target className="w-8 h-8" />,
      earnedDate: '2026-03-01',
      unlocked: true,
      category: 'Goals',
    },
    {
      id: '6',
      name: 'Health Champion',
      description: 'Maintain wellness for 100 days',
      icon: <Heart className="w-8 h-8" />,
      earnedDate: null,
      unlocked: false,
      category: 'Milestones',
    },
    {
      id: '7',
      name: 'Data Detective',
      description: 'Review 50 wellness reports',
      icon: <TrendingUp className="w-8 h-8" />,
      earnedDate: null,
      unlocked: false,
      category: 'Engagement',
    },
    {
      id: '8',
      name: 'Marathon Mind',
      description: 'Maintain a 60-day streak',
      icon: <Calendar className="w-8 h-8" />,
      earnedDate: null,
      unlocked: false,
      category: 'Consistency',
    },
  ]

  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'Weight Loss Journey',
      description: 'Lose 15 kg and reach your target weight',
      progress: 10,
      target: 15,
      status: 'in-progress',
      reward: '+500 XP',
      icon: <Heart className="w-6 h-6" />,
    },
    {
      id: '2',
      title: 'Fitness Enthusiast',
      description: 'Complete 100 workout sessions',
      progress: 42,
      target: 100,
      status: 'in-progress',
      reward: '+300 XP',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      id: '3',
      title: 'Sleep Well',
      description: 'Get 8 hours of sleep for 30 consecutive days',
      progress: 18,
      target: 30,
      status: 'in-progress',
      reward: '+250 XP',
      icon: <Award className="w-6 h-6" />,
    },
    {
      id: '4',
      title: 'Meal Master',
      description: 'Log meals for 60 days',
      progress: 45,
      target: 60,
      status: 'in-progress',
      reward: '+200 XP',
      icon: <Target className="w-6 h-6" />,
    },
    {
      id: '5',
      title: 'Century Club',
      description: 'Reach 100 total log entries',
      progress: 87,
      target: 100,
      status: 'in-progress',
      reward: '+150 XP',
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ]

  const unlockedBadges = badges.filter((b) => b.unlocked)
  const totalBadges = badges.length

  const calculateLevel = (progress: number) => {
    return Math.floor(progress / 100) + 1
  }

  const totalProgress = achievements.reduce((acc, a) => acc + (a.progress / a.target) * 100, 0)
  const userLevel = calculateLevel(totalProgress)
  const xpGained = achievements.reduce((acc, a) => {
    // strip any non‑digit characters so we only parse the number portion
    const xp = parseInt(a.reward.replace(/[^\d]/g, '')) || 0
    return acc + (a.status === 'unlocked' ? xp : 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Achievements & Badges</h1>
        <p className="text-foreground/60 mt-1">Celebrate your wellness milestones and unlock rewards</p>
      </div>

      {/* Level & XP Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 border border-border bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Your Level</h3>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">{userLevel}</p>
              <p className="text-sm text-foreground/60 mt-1">Wellness Warrior</p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-foreground/60 mb-2">Level Progress</p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-full"
                  style={{ width: `${totalProgress % 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Total XP</h3>
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-4xl font-bold text-secondary">{xpGained}</p>
              <p className="text-sm text-foreground/60 mt-1">Experience Points</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Badges Earned</h3>
              <Award className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-4xl font-bold text-accent">{unlockedBadges.length}</p>
              <p className="text-sm text-foreground/60 mt-1">of {totalBadges} total</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Earned Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Earned Badges</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {unlockedBadges.map((badge) => (
            <Card
              key={badge.id}
              className="p-6 border border-border text-center hover:shadow-lg transition"
            >
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto text-primary">
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{badge.name}</h3>
                  <p className="text-xs text-foreground/60 mt-1">{badge.description}</p>
                </div>
                <p className="text-xs text-foreground/50 border-t border-border pt-3">
                  {new Date(badge.earnedDate || '').toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Locked Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Unlock More Badges</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {badges
            .filter((b) => !b.unlocked)
            .map((badge) => (
              <Card
                key={badge.id}
                className="p-6 border border-dashed border-border/50 text-center opacity-50 hover:opacity-75 transition"
              >
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{badge.name}</h3>
                    <p className="text-xs text-foreground/60 mt-1">{badge.description}</p>
                  </div>
                  <p className="text-xs text-foreground/50 border-t border-border/50 pt-3">
                    Keep going!
                  </p>
                </div>
              </Card>
            ))}
        </div>
      </section>

      {/* Active Achievements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Active Achievements</h2>
        <div className="space-y-3">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="p-6 border border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{achievement.description}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground/60">
                          {achievement.progress} / {achievement.target}
                        </span>
                        <span className="font-medium text-foreground">
                          {Math.round((achievement.progress / achievement.target) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            achievement.status === 'unlocked'
                              ? 'bg-primary'
                              : 'bg-gradient-to-r from-primary to-secondary'
                          }`}
                          style={{
                            width: `${Math.min(
                              (achievement.progress / achievement.target) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-primary text-sm">{achievement.reward}</p>
                  <p className="text-xs text-foreground/60 mt-1">
                    {achievement.status === 'unlocked' ? '✓ Completed' : 'In Progress'}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Leaderboard */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Your Stats</h2>
        <Card className="p-6 border border-border">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-sm text-foreground/60 mt-1">Days Active</p>
            </div>
            <div className="text-center border-l border-border pl-4">
              <p className="text-2xl font-bold text-secondary">18</p>
              <p className="text-sm text-foreground/60 mt-1">Goals Met</p>
            </div>
            <div className="text-center border-l border-border pl-4">
              <p className="text-2xl font-bold text-accent">7</p>
              <p className="text-sm text-foreground/60 mt-1">Day Streak</p>
            </div>
            <div className="text-center border-l border-border pl-4">
              <p className="text-2xl font-bold text-blue-600">125</p>
              <p className="text-sm text-foreground/60 mt-1">Workouts Done</p>
            </div>
            <div className="text-center border-l border-border pl-4">
              <p className="text-2xl font-bold text-cyan-600">15</p>
              <p className="text-sm text-foreground/60 mt-1">kg Lost</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
