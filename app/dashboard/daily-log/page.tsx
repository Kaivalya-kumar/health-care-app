'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { fetchLogs, createLog, deleteLog, updateLog } from '@/lib/api'
import { Apple, Droplet, Zap, Moon, ChevronDown, Plus, X, CheckCircle2, Circle } from 'lucide-react'

interface LogEntry {
  id: string
  date: string // YYYY-MM-DD
  type: 'food' | 'water' | 'workout' | 'sleep'
  title: string
  value: string
  calories?: number
  duration?: number
  completed: boolean
  time: string
}

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)

  // fetch logs when the date changes
  useEffect(() => {
    setLoading(true)
    fetchLogs(selectedDate)
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedDate])

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean
  }>({
    food: true,
    water: true,
    workout: true,
    sleep: true,
  })

  const [showForms, setShowForms] = useState<{
    [key: string]: boolean
  }>({
    food: false,
    water: false,
    workout: false,
    sleep: false,
  })

  const [newEntries, setNewEntries] = useState<{
    [key: string]: Partial<LogEntry>
  }>({
    food: { title: '', calories: undefined },
    water: { value: '' },
    workout: { title: '', duration: undefined },
    sleep: { value: '' },
  })

  const toggleSection = (type: string) => {
    setExpandedSections({
      ...expandedSections,
      [type]: !expandedSections[type],
    })
  }

  const handleAddEntry = async (type: 'food' | 'water' | 'workout' | 'sleep') => {
    const entry = newEntries[type]

    let payload: Partial<LogEntry> | null = null

    if (type === 'food' && entry.title && entry.calories) {
      payload = {
        type: 'food',
        date: selectedDate,
        title: entry.title,
        value: `${entry.calories} kcal`,
        calories: entry.calories,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    } else if (type === 'water' && entry.value) {
      payload = {
        type: 'water',
        date: selectedDate,
        title: 'Water intake',
        value: entry.value,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    } else if (type === 'workout' && entry.title && entry.duration) {
      payload = {
        type: 'workout',
        date: selectedDate,
        title: entry.title,
        value: `${entry.duration} min`,
        duration: entry.duration,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    } else if (type === 'sleep' && entry.value) {
      payload = {
        type: 'sleep',
        date: selectedDate,
        title: 'Sleep',
        value: entry.value,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      }
    }

    if (payload) {
      try {
        const saved = await createLog(payload)
        setLogs([...logs, saved])
        // reset form
        setNewEntries({
          ...newEntries,
          food: { title: '', calories: undefined },
          water: { value: '' },
          workout: { title: '', duration: undefined },
          sleep: { value: '' },
        })
        setShowForms({ ...showForms, [type]: false })
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteLog(id)
      setLogs(logs.filter((log) => log.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleToggleEntry = async (id: string) => {
    const entry = logs.find((l) => l.id === id)
    if (!entry) return
    const updated = { ...entry, completed: !entry.completed }
    try {
      await updateLog(updated)
      setLogs(
        logs.map((log) => (log.id === id ? updated : log))
      )
    } catch (e) {
      console.error(e)
    }
  }

  const getLogsByType = (type: 'food' | 'water' | 'workout' | 'sleep') => {
    return logs.filter((log) => log.type === type)
  }

  const getTotalCalories = () => {
    return logs
      .filter((log) => log.type === 'food')
      .reduce((total, log) => total + (log.calories || 0), 0)
  }

  const getTotalWater = () => {
    const waterLogs = logs.filter((log) => log.type === 'water')
    return waterLogs.length > 0
      ? waterLogs.reduce((total, log) => total + parseInt(log.value || '0'), 0)
      : 0
  }

  const getTotalExerciseTime = () => {
    return logs
      .filter((log) => log.type === 'workout')
      .reduce((total, log) => total + (log.duration || 0), 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Log</h1>
          <p className="text-foreground/60 mt-1">Track your food, water, exercise, and sleep</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-input border-border"
          />
        </div>
      </div>

      {/* Daily Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase">Calories</p>
              <p className="text-2xl font-bold text-primary mt-1">{getTotalCalories()}</p>
              <p className="text-xs text-foreground/50 mt-1">of 2000 kcal</p>
            </div>
            <Apple className="w-8 h-8 text-primary opacity-50" />
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase">Water</p>
              <p className="text-2xl font-bold text-secondary mt-1">{getTotalWater()}</p>
              <p className="text-xs text-foreground/50 mt-1">of 3000 ml</p>
            </div>
            <Droplet className="w-8 h-8 text-secondary opacity-50" />
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase">Exercise</p>
              <p className="text-2xl font-bold text-accent mt-1">{getTotalExerciseTime()}</p>
              <p className="text-xs text-foreground/50 mt-1">min today</p>
            </div>
            <Zap className="w-8 h-8 text-accent opacity-50" />
          </div>
        </Card>

        <Card className="p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase">Sleep</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">7.5</p>
              <p className="text-xs text-foreground/50 mt-1">hours</p>
            </div>
            <Moon className="w-8 h-8 text-blue-600 opacity-50" />
          </div>
        </Card>
      </div>

      {/* Log Sections */}
      <LogSection
        icon={<Apple className="w-5 h-5" />}
        title="Food Intake"
        type="food"
        entries={getLogsByType('food')}
        isExpanded={expandedSections.food || false}
        onToggle={() => toggleSection('food')}
        onDelete={handleDeleteEntry}
        onToggleEntry={handleToggleEntry}
        showForm={showForms.food || false}
        onShowForm={() => setShowForms({ ...showForms, food: !showForms.food })}
        onAddEntry={() => handleAddEntry('food')}
        newEntry={newEntries.food}
        onNewEntryChange={(field, value) =>
          setNewEntries({
            ...newEntries,
            food: { ...newEntries.food, [field]: value },
          })
        }
        formFields={[
          { label: 'Food Item', field: 'title', type: 'text', placeholder: 'e.g., Chicken with rice' },
          { label: 'Calories', field: 'calories', type: 'number', placeholder: '350' },
        ]}
      />

      <LogSection
        icon={<Droplet className="w-5 h-5" />}
        title="Water Intake"
        type="water"
        entries={getLogsByType('water')}
        isExpanded={expandedSections.water || false}
        onToggle={() => toggleSection('water')}
        onDelete={handleDeleteEntry}
        onToggleEntry={handleToggleEntry}
        showForm={showForms.water || false}
        onShowForm={() => setShowForms({ ...showForms, water: !showForms.water })}
        onAddEntry={() => handleAddEntry('water')}
        newEntry={newEntries.water}
        onNewEntryChange={(field, value) =>
          setNewEntries({
            ...newEntries,
            water: { ...newEntries.water, [field]: value },
          })
        }
        formFields={[
          { label: 'Amount (ml)', field: 'value', type: 'number', placeholder: '500' },
        ]}
      />

      <LogSection
        icon={<Zap className="w-5 h-5" />}
        title="Exercise"
        type="workout"
        entries={getLogsByType('workout')}
        isExpanded={expandedSections.workout || false}
        onToggle={() => toggleSection('workout')}
        onDelete={handleDeleteEntry}
        onToggleEntry={handleToggleEntry}
        showForm={showForms.workout || false}
        onShowForm={() => setShowForms({ ...showForms, workout: !showForms.workout })}
        onAddEntry={() => handleAddEntry('workout')}
        newEntry={newEntries.workout}
        onNewEntryChange={(field, value) =>
          setNewEntries({
            ...newEntries,
            workout: { ...newEntries.workout, [field]: value },
          })
        }
        formFields={[
          { label: 'Exercise', field: 'title', type: 'text', placeholder: 'e.g., Running' },
          { label: 'Duration (min)', field: 'duration', type: 'number', placeholder: '30' },
        ]}
      />

      <LogSection
        icon={<Moon className="w-5 h-5" />}
        title="Sleep"
        type="sleep"
        entries={getLogsByType('sleep')}
        isExpanded={expandedSections.sleep || false}
        onToggle={() => toggleSection('sleep')}
        onDelete={handleDeleteEntry}
        onToggleEntry={handleToggleEntry}
        showForm={showForms.sleep || false}
        onShowForm={() => setShowForms({ ...showForms, sleep: !showForms.sleep })}
        onAddEntry={() => handleAddEntry('sleep')}
        newEntry={newEntries.sleep}
        onNewEntryChange={(field, value) =>
          setNewEntries({
            ...newEntries,
            sleep: { ...newEntries.sleep, [field]: value },
          })
        }
        formFields={[
          { label: 'Hours', field: 'value', type: 'number', step: '0.5', placeholder: '8' },
        ]}
      />
    </div>
  )
}

interface LogSectionProps {
  icon: React.ReactNode
  title: string
  type: 'food' | 'water' | 'workout' | 'sleep'
  entries: LogEntry[]
  isExpanded: boolean
  onToggle: () => void
  onDelete: (id: string) => void
  onToggleEntry: (id: string) => void
  showForm: boolean
  onShowForm: () => void
  onAddEntry: () => void
  newEntry: Partial<LogEntry>
  onNewEntryChange: (field: string, value: any) => void
  formFields: Array<{ label: string; field: string; type: string; placeholder: string; step?: string }>
}

function LogSection({
  icon,
  title,
  type,
  entries,
  isExpanded,
  onToggle,
  onDelete,
  onToggleEntry,
  showForm,
  onShowForm,
  onAddEntry,
  newEntry,
  onNewEntryChange,
  formFields,
}: LogSectionProps) {
  const colorMap = {
    food: 'text-primary',
    water: 'text-secondary',
    workout: 'text-accent',
    sleep: 'text-blue-600',
  }

  const bgColorMap = {
    food: 'bg-primary/10',
    water: 'bg-secondary/10',
    workout: 'bg-accent/10',
    sleep: 'bg-blue-600/10',
  }

  return (
    <Card className="border border-border overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition"
      >
        <div className="flex items-center gap-3">
          <div className={`${bgColorMap[type] as string} p-2 rounded-lg ${colorMap[type] as string}`}>
            {icon}
          </div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <span className="text-xs bg-muted text-foreground/60 px-2 py-1 rounded">
            {entries.length}
          </span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="border-t border-border">
          {/* Entries List */}
          <div className="p-4 space-y-2 bg-muted/20">
            {entries.length > 0 ? (
              entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-3 rounded-lg flex items-center justify-between transition ${
                    entry.completed
                      ? 'bg-muted/50'
                      : 'bg-background border border-border'
                  }`}
                >
                  <button
                    onClick={() => onToggleEntry(entry.id)}
                    className="flex-shrink-0"
                  >
                    {entry.completed ? (
                      <CheckCircle2 className={`w-5 h-5 ${colorMap[type] as string}`} />
                    ) : (
                      <Circle className="w-5 h-5 text-foreground/30" />
                    )}
                  </button>
                  <div className="flex-1 ml-3 min-w-0">
                    <p className={`font-medium text-sm ${
                      entry.completed
                        ? 'line-through text-foreground/50'
                        : 'text-foreground'
                    }`}>
                      {entry.title}
                    </p>
                    <p className="text-xs text-foreground/50">{entry.time}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`font-semibold text-sm ${colorMap[type] as string}`}>
                      {entry.value}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(entry.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground/50 text-center py-2">No entries yet</p>
            )}
          </div>

          {/* Form */}
          {showForm && (
            <div className="p-4 border-t border-border bg-background space-y-3">
              {formFields.map((field) => (
                <div key={field.field} className="space-y-2">
                  <Label htmlFor={field.field}>{field.label}</Label>
                  <Input
                    id={field.field}
                    type={field.type}
                    step={field.step}
                    placeholder={field.placeholder}
                    value={newEntry[field.field as keyof LogEntry] || ''}
                    onChange={(e) => onNewEntryChange(field.field, field.type === 'number' ? parseInt(e.target.value) : e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={onAddEntry} className="flex-1">
                  Add Entry
                </Button>
                <Button onClick={onShowForm} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Add Button */}
          {!showForm && (
            <button
              onClick={onShowForm}
              className="w-full p-3 flex items-center justify-center gap-2 text-primary hover:bg-primary/5 transition border-t border-border"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Add Entry</span>
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
