'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react'
import { fetchGoalProgress } from '@/lib/api'

interface Goal {
  id: string
  title: string
  description: string
  category: 'weight' | 'exercise' | 'nutrition' | 'sleep' | 'water'
  target: string
  current: string
  deadline: string
  completed: boolean
  progress: number
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Drink 3L water daily',
      description: 'Stay hydrated throughout the day',
      category: 'water',
      target: '3 L',
      current: '0 ml',
      deadline: '2026-12-31',
      completed: false,
      progress: 0,
    },
    {
      id: '2',
      title: 'Exercise 60min daily',
      description: 'Get 60 minutes of workout per day',
      category: 'exercise',
      target: '60 min',
      current: '0 min',
      deadline: '2026-12-31',
      completed: false,
      progress: 0,
    },
    {
      id: '3',
      title: 'Eat 2000 kcal daily',
      description: 'Maintain target calorie intake',
      category: 'nutrition',
      target: '2000 kcal',
      current: '0 kcal',
      deadline: '2026-12-31',
      completed: false,
      progress: 0,
    },
    {
      id: '4',
      title: 'Sleep 8 hours',
      description: 'Maintain consistent sleep schedule',
      category: 'sleep',
      target: '8 hours',
      current: '0 hours',
      deadline: '2026-12-31',
      completed: false,
      progress: 0,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'exercise' as const,
    target: '',
    deadline: '',
  })

  // Load real goal progress from daily logs
  useEffect(() => {
    const loadGoalProgress = async () => {
      const updated = await Promise.all(
        goals.map(async (goal) => {
          try {
            const data = await fetchGoalProgress(goal.category)
            return {
              ...goal,
              current: String(data.current),
              progress: Math.min(Math.max(data.progress, 0), 100),
            }
          } catch (e) {
            console.error(`Failed to load progress for ${goal.category}:`, e)
            return goal
          }
        })
      )
      setGoals(updated)
    }

    loadGoalProgress()
  }, [])

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.target && newGoal.deadline) {
      if (editingId) {
        setGoals(goals.map((g) => (g.id === editingId ? { ...g, ...newGoal } : g)))
        setEditingId(null)
      } else {
        const goal: Goal = {
          id: Date.now().toString(),
          ...newGoal,
          current: '0',
          completed: false,
          progress: 0,
        }
        setGoals([...goals, goal])
      }
      setNewGoal({ title: '', description: '', category: 'exercise', target: '', deadline: '' })
      setShowForm(false)
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setEditingId(goal.id)
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target: goal.target,
      deadline: goal.deadline,
    })
    setShowForm(true)
  }

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)))
  }

  const categoryColors: Record<string, string> = {
    weight: 'text-primary',
    exercise: 'text-secondary',
    nutrition: 'text-accent',
    sleep: 'text-blue-600',
    water: 'text-cyan-600',
  }

  const categoryBgColors: Record<string, string> = {
    weight: 'bg-primary/10',
    exercise: 'bg-secondary/10',
    nutrition: 'bg-accent/10',
    sleep: 'bg-blue-600/10',
    water: 'bg-cyan-600/10',
  }

  const completedCount = goals.filter((g) => g.completed).length
  const completionRate = Math.round((completedCount / goals.length) * 100) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Goals</h1>
          <p className="text-foreground/60 mt-1">Track your wellness objectives - changes sync with your daily logs</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? 'Cancel' : 'New Goal'}
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <p className="text-sm text-foreground/60">Total Goals</p>
          <p className="text-3xl font-bold text-primary mt-2">{goals.length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-foreground/60">Completed</p>
          <p className="text-3xl font-bold text-secondary mt-2">{completedCount}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-foreground/60">In Progress</p>
          <p className="text-3xl font-bold text-accent mt-2">{goals.filter((g) => !g.completed).length}</p>
        </Card>
        <Card className="p-4 border border-border">
          <p className="text-sm text-foreground/60">Completion Rate</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{completionRate}%</p>
        </Card>
      </div>

      {showForm && (
        <Card className="p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? 'Edit Goal' : 'Create New Goal'}
          </h3>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Goal Title</Label>
                <Input
                  placeholder="e.g., Drink more water"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  value={newGoal.category}
                  onChange={(e) =>
                    setNewGoal({
                      ...newGoal,
                      category: e.target.value as Goal['category'],
                    })
                  }
                  className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
                >
                  <option value="water">Water</option>
                  <option value="exercise">Exercise</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="sleep">Sleep</option>
                  <option value="weight">Weight</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Add details about your goal"
                value={newGoal.description}
                onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target</Label>
                <Input
                  placeholder="e.g., 3 L for water"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
            </div>

            <Button onClick={handleAddGoal} className="w-full">
              {editingId ? 'Save Changes' : 'Create Goal'}
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {goals.map((goal) => (
          <Card key={goal.id} className={`p-6 border transition ${goal.completed ? 'border-primary/20 bg-primary/5 opacity-75' : 'border-border'}`}>
            <div className="flex items-start gap-4">
              <button onClick={() => handleToggleGoal(goal.id)} className="flex-shrink-0 mt-1 text-primary">
                {goal.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-semibold text-lg ${goal.completed ? 'line-through opacity-50' : ''}`}>
                      {goal.title}
                    </h3>
                    <p className="text-sm text-foreground/60">{goal.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[goal.category]} ${categoryBgColors[goal.category]}`}>
                    {goal.category}
                  </span>
                </div>

                <div className="space-y-2 my-3">
                  <div className="flex justify-between text-sm">
                    <span>{goal.current} / {goal.target}</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-secondary h-full rounded-full" style={{ width: `${goal.progress}%` }} />
                  </div>
                </div>

                <p className="text-xs text-foreground/60">
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEditGoal(goal)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteGoal(goal.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {goals.length === 0 && (
        <Card className="p-12 text-center border border-dashed">
          <p className="text-foreground/60 mb-4">No goals yet. Create your first one!</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </Card>
      )}
    </div>
  )
}
