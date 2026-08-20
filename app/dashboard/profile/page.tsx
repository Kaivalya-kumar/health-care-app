'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Save, X, TrendingDown } from 'lucide-react'
import { fetchWeights, addWeight } from '@/lib/api'

export default function ProfilePage() {
  // weight history will be fetched from the backend
  const [weightHistory, setWeightHistory] = useState<{ date: string; weight: number }[]>([])

  // profile data now includes the user's name and email, which will be
  // populated from the value stored in localStorage during login so the
  // user doesn't need to re-enter them each time.
  interface Profile {
    name: string
    email: string
    age: number
    height: number
    currentWeight: number
    targetWeight: number
    gender: string
  }

  const initialProfile: Profile = {
    name: '',
    email: '',
    age: 28,
    height: 180, // in cm
    currentWeight: 185, // in kg
    targetWeight: 75, // in kg
    gender: 'Male',
  }

  const [profile, setProfile] = useState<Profile>(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Profile>(initialProfile)
  const [showWeightForm, setShowWeightForm] = useState(false)
  const [newWeight, setNewWeight] = useState('')

  // Generate 14-day weight graph based on user's registered weight
  // previous days start heavier and decrease randomly (0.1–0.2kg/day) until arriving
  // at the supplied currentWeight on the final (most recent) day.
  const generateWeightGraph = (currentWeight: number) => {
    const data: { date: string; weight: number }[] = []
    const today = new Date()
    let weight = currentWeight
    const weights: number[] = []
    for (let day = 13; day >= 0; day--) {
      if (day === 13) {
        weights.unshift(weight)
      } else {
        const delta = 0.1 + Math.random() * 0.1
        weight = weight + delta
        weights.unshift(weight)
      }
    }
    for (let i = 0; i < weights.length; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (13 - i))
      data.push({ date: date.toISOString().split('T')[0], weight: parseFloat(weights[i].toFixed(1)) })
    }
    return data
  }

  // when the component mounts, load the user info from localStorage and
  // merge it into the profile state (if available).
  useEffect(() => {
    const stored = localStorage.getItem('user')
    const storedProfile = localStorage.getItem('profile')
    
    if (stored) {
      try {
        const u = JSON.parse(stored)
        const p = storedProfile ? JSON.parse(storedProfile) : {}
        setProfile((prof) => ({
          ...prof,
          name: u.name || '',
          email: u.email || '',
          age: u.age || prof.age,
          height: u.height || prof.height,
          currentWeight: u.currentWeight || p.currentWeight || prof.currentWeight,
          targetWeight: p.targetWeight || prof.targetWeight,
          gender: u.gender || prof.gender,
        }))
        setEditData((prof) => ({
          ...prof,
          name: u.name || '',
          email: u.email || '',
          age: u.age || prof.age,
          height: u.height || prof.height,
          currentWeight: u.currentWeight || p.currentWeight || prof.currentWeight,
          targetWeight: p.targetWeight || prof.targetWeight,
          gender: u.gender || prof.gender,
        }))
        // Generate weight graph from registered weight
        if (u.currentWeight) {
          setWeightHistory(generateWeightGraph(u.currentWeight))
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    // Mifflin-St Jeor equation
    let bmr: number
    if (gender.toLowerCase() === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    return Math.round(bmr)
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-500' }
    if (bmi < 25) return { label: 'Normal Weight', color: 'text-green-500' }
    if (bmi < 30) return { label: 'Overweight', color: 'text-orange-500' }
    return { label: 'Obese', color: 'text-red-500' }
  }

  const currentBMI = calculateBMI(profile.currentWeight, profile.height)
  const bmiInfo = getBMICategory(parseFloat(currentBMI))

  const handleSaveProfile = () => {
    setProfile(editData)
    setIsEditing(false)

    // update stored user info and profile details
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...u,
          name: editData.name,
          email: editData.email,
          age: editData.age,
          height: editData.height,
          currentWeight: editData.currentWeight,
          gender: editData.gender,
        }),
      )
    } catch {
      // ignore
    }
    localStorage.setItem('profile', JSON.stringify(editData))
  }

  const handleAddWeight = async () => {
    if (newWeight && !isNaN(parseFloat(newWeight))) {
      const weightNum = parseFloat(newWeight)
      try {
        const saved = await addWeight({ date: new Date().toISOString().split('T')[0], weight: weightNum })
        setWeightHistory([...weightHistory, { date: saved.date, weight: saved.weight }])
      } catch (e) {
        console.error(e)
      }
      setProfile({
        ...profile,
        currentWeight: weightNum,
      })
      setNewWeight('')
      setShowWeightForm(false)
    }
  }

  const handleEditChange = (field: string, value: any) => {
    setEditData({
      ...editData,
      [field]: value,
    })
  }

  // amount above or below target
  const weightLost = profile.currentWeight - profile.targetWeight

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-foreground/60 mt-1">Manage your health information and wellness metrics</p>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'default'}
          onClick={() => {
            if (isEditing) {
              setEditData(profile)
            }
            setIsEditing(!isEditing)
          }}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Information */}
      <Card className="p-8 border border-border">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>

            <div className="space-y-4">
                  {/* name & email are shown now; they are populated from login data
              and can be edited if the user chooses. */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Name</Label>
                {isEditing ? (
                  <Input
                    value={editData.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleEditChange('email', e.target.value)}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Age</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.age}
                    onChange={(e) => handleEditChange('age', parseInt(e.target.value))}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.age} years</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Gender</Label>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => handleEditChange('gender', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <p className="text-foreground/80">{profile.gender}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Health Metrics</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground font-medium">Height (cm)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editData.height}
                    onChange={(e) => handleEditChange('height', parseInt(e.target.value))}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.height} cm</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Current Weight (kg)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.1"
                    value={editData.currentWeight}
                    onChange={(e) => handleEditChange('currentWeight', parseFloat(e.target.value))}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.currentWeight} kg</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Target Weight (kg)</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.1"
                    value={editData.targetWeight}
                    onChange={(e) => handleEditChange('targetWeight', parseFloat(e.target.value))}
                    className="bg-input text-foreground"
                  />
                ) : (
                  <p className="text-foreground/80">{profile.targetWeight} kg</p>
                )}
              </div>

              <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
                <p className="text-sm text-foreground/70 mb-2">BMI</p>
                <p className={`text-2xl font-bold ${bmiInfo.color}`}>{currentBMI}</p>
                <p className="text-xs text-foreground/60 mt-1">{bmiInfo.label}</p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground/70 mb-2">BMR (Daily Calories)</p>
                <p className="text-2xl font-bold text-primary">{calculateBMR(profile.currentWeight, profile.height, profile.age, profile.gender)}</p>
                <p className="text-xs text-foreground/60 mt-1">Calories to maintain weight</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Weight Tracking */}
      <Card className="p-6 border border-border">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Weight Progress</h2>
              <p className="text-sm text-foreground/60 mt-1">Track your weight changes over time</p>
            </div>
            <Button
              onClick={() => setShowWeightForm(!showWeightForm)}
              variant="outline"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Weight
            </Button>
          </div>

          {showWeightForm && (
            <div className="p-4 bg-muted/50 border border-border rounded-lg space-y-3">
              <Label className="text-foreground font-medium">New Weight (kg)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter weight"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="bg-input text-foreground"
                />
                <Button onClick={handleAddWeight} size="sm">
                  <Save className="w-4 h-4 mr-1" />
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowWeightForm(false)
                    setNewWeight('')
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--foreground)" opacity={0.6} />
              <YAxis stroke="var(--foreground)" opacity={0.6} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
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

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs font-semibold text-foreground/60 uppercase">Loss Till Now</p>
              <p className="text-2xl font-bold text-accent mt-2">{weightLost.toFixed(1)} kg</p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs font-semibold text-foreground/60 uppercase">Remaining</p>
              <p className="text-2xl font-bold text-primary mt-2">{(profile.currentWeight - profile.targetWeight).toFixed(1)} kg</p>
            </div>
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <p className="text-xs font-semibold text-foreground/60 uppercase">Target</p>
              <p className="text-2xl font-bold text-secondary mt-2">{profile.targetWeight} kg</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
