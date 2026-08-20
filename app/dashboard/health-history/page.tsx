'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, X, AlertCircle, Edit2 } from 'lucide-react'

interface HealthCondition {
  id: string
  name: string
  diagnosis: string
  status: 'active' | 'resolved'
  startDate: string
  endDate?: string
  notes: string
}

interface Allergy {
  id: string
  allergen: string
  severity: 'mild' | 'moderate' | 'severe'
  reactions: string
  notes: string
}

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  reason: string
  startDate: string
}

export default function HealthHistoryPage() {
  const [conditions, setConditions] = useState<HealthCondition[]>([
    {
      id: '1',
      name: 'Type 2 Diabetes',
      diagnosis: 'Diagnosed 2020',
      status: 'active',
      startDate: '2020-03-15',
      notes: 'Managed with diet and exercise',
    },
    {
      id: '2',
      name: 'High Blood Pressure',
      diagnosis: 'Diagnosed 2021',
      status: 'active',
      startDate: '2021-06-20',
      notes: 'Currently taking medication',
    },
  ])

  const [allergies, setAllergies] = useState<Allergy[]>([
    {
      id: '1',
      allergen: 'Peanuts',
      severity: 'severe',
      reactions: 'Anaphylaxis',
      notes: 'Carry epi-pen at all times',
    },
    {
      id: '2',
      allergen: 'Shellfish',
      severity: 'moderate',
      reactions: 'Rash, itching',
      notes: 'Avoid all shellfish products',
    },
  ])

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Metformin',
      dosage: '1000mg',
      frequency: 'Twice daily',
      reason: 'Type 2 Diabetes',
      startDate: '2020-03-15',
    },
    {
      id: '2',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      reason: 'High Blood Pressure',
      startDate: '2021-06-20',
    },
  ])

  const [showConditionForm, setShowConditionForm] = useState(false)
  const [showAllergyForm, setShowAllergyForm] = useState(false)
  const [showMedicationForm, setShowMedicationForm] = useState(false)

  const [newCondition, setNewCondition] = useState<Partial<HealthCondition>>({
    status: 'active',
  })
  const [newAllergy, setNewAllergy] = useState<Partial<Allergy>>({
    severity: 'moderate',
  })
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({})

  const handleAddCondition = () => {
    if (newCondition.name && newCondition.diagnosis) {
      const condition: HealthCondition = {
        id: Date.now().toString(),
        name: newCondition.name || '',
        diagnosis: newCondition.diagnosis || '',
        status: newCondition.status || 'active',
        startDate: newCondition.startDate || new Date().toISOString().split('T')[0],
        endDate: newCondition.endDate,
        notes: newCondition.notes || '',
      }
      setConditions([...conditions, condition])
      setNewCondition({ status: 'active' })
      setShowConditionForm(false)
    }
  }

  const handleAddAllergy = () => {
    if (newAllergy.allergen && newAllergy.reactions) {
      const allergy: Allergy = {
        id: Date.now().toString(),
        allergen: newAllergy.allergen || '',
        severity: newAllergy.severity || 'moderate',
        reactions: newAllergy.reactions || '',
        notes: newAllergy.notes || '',
      }
      setAllergies([...allergies, allergy])
      setNewAllergy({ severity: 'moderate' })
      setShowAllergyForm(false)
    }
  }

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage && newMedication.frequency) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMedication.name || '',
        dosage: newMedication.dosage || '',
        frequency: newMedication.frequency || '',
        reason: newMedication.reason || '',
        startDate: newMedication.startDate || new Date().toISOString().split('T')[0],
      }
      setMedications([...medications, medication])
      setNewMedication({})
      setShowMedicationForm(false)
    }
  }

  const handleDeleteCondition = (id: string) => {
    setConditions(conditions.filter((c) => c.id !== id))
  }

  const handleDeleteAllergy = (id: string) => {
    setAllergies(allergies.filter((a) => a.id !== id))
  }

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter((m) => m.id !== id))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild':
        return 'bg-blue-600/10 text-blue-600'
      case 'moderate':
        return 'bg-orange-600/10 text-orange-600'
      case 'severe':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-foreground/60'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-primary/10 text-primary'
      : 'bg-muted text-foreground/60'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health History</h1>
        <p className="text-foreground/60 mt-1">Manage your medical information and health records</p>
      </div>

      {/* Medical Conditions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Medical Conditions</h2>
          <Button onClick={() => setShowConditionForm(!showConditionForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Condition
          </Button>
        </div>

        {showConditionForm && (
          <Card className="p-6 border border-border">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition-name">Condition Name</Label>
                  <Input
                    id="condition-name"
                    placeholder="e.g., Type 2 Diabetes"
                    value={newCondition.name || ''}
                    onChange={(e) => setNewCondition({ ...newCondition, name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition-status">Status</Label>
                  <select
                    id="condition-status"
                    value={newCondition.status || 'active'}
                    onChange={(e) =>
                      setNewCondition({
                        ...newCondition,
                        status: e.target.value as 'active' | 'resolved',
                      })
                    }
                    className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="active">Active</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition-diagnosis">Diagnosis Details</Label>
                <Input
                  id="condition-diagnosis"
                  placeholder="e.g., Diagnosed 2020"
                  value={newCondition.diagnosis || ''}
                  onChange={(e) => setNewCondition({ ...newCondition, diagnosis: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condition-start">Start Date</Label>
                  <Input
                    id="condition-start"
                    type="date"
                    value={newCondition.startDate || ''}
                    onChange={(e) => setNewCondition({ ...newCondition, startDate: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition-end">End Date (if resolved)</Label>
                  <Input
                    id="condition-end"
                    type="date"
                    value={newCondition.endDate || ''}
                    onChange={(e) => setNewCondition({ ...newCondition, endDate: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition-notes">Notes</Label>
                <Input
                  id="condition-notes"
                  placeholder="Any additional notes"
                  value={newCondition.notes || ''}
                  onChange={(e) => setNewCondition({ ...newCondition, notes: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddCondition} className="flex-1">
                  Add Condition
                </Button>
                <Button
                  onClick={() => {
                    setShowConditionForm(false)
                    setNewCondition({ status: 'active' })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {conditions.length > 0 ? (
            conditions.map((condition) => (
              <Card key={condition.id} className="p-4 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{condition.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(condition.status)}`}>
                        {condition.status.charAt(0).toUpperCase() + condition.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">{condition.diagnosis}</p>
                    {condition.notes && (
                      <p className="text-xs text-foreground/50 mt-2">{condition.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteCondition(condition.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 border border-dashed border-border text-center">
              <p className="text-foreground/60">No medical conditions recorded</p>
            </Card>
          )}
        </div>
      </section>

      {/* Allergies */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Allergies</h2>
          <Button onClick={() => setShowAllergyForm(!showAllergyForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Allergy
          </Button>
        </div>

        {showAllergyForm && (
          <Card className="p-6 border border-border bg-destructive/5">
            <div className="flex items-start gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-1" />
              <p className="text-sm text-destructive">
                Be accurate with allergy information as it may affect your health and safety recommendations
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allergen-name">Allergen</Label>
                  <Input
                    id="allergen-name"
                    placeholder="e.g., Peanuts"
                    value={newAllergy.allergen || ''}
                    onChange={(e) => setNewAllergy({ ...newAllergy, allergen: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergy-severity">Severity</Label>
                  <select
                    id="allergy-severity"
                    value={newAllergy.severity || 'moderate'}
                    onChange={(e) =>
                      setNewAllergy({
                        ...newAllergy,
                        severity: e.target.value as 'mild' | 'moderate' | 'severe',
                      })
                    }
                    className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
                  >
                    <option value="mild">Mild</option>
                    <option value="moderate">Moderate</option>
                    <option value="severe">Severe</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergy-reactions">Reactions</Label>
                <Input
                  id="allergy-reactions"
                  placeholder="e.g., Rash, itching, swelling"
                  value={newAllergy.reactions || ''}
                  onChange={(e) => setNewAllergy({ ...newAllergy, reactions: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergy-notes">Notes</Label>
                <Input
                  id="allergy-notes"
                  placeholder="Any additional information"
                  value={newAllergy.notes || ''}
                  onChange={(e) => setNewAllergy({ ...newAllergy, notes: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddAllergy} className="flex-1">
                  Add Allergy
                </Button>
                <Button
                  onClick={() => {
                    setShowAllergyForm(false)
                    setNewAllergy({ severity: 'moderate' })
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {allergies.length > 0 ? (
            allergies.map((allergy) => (
              <Card
                key={allergy.id}
                className={`p-4 border ${
                  allergy.severity === 'severe'
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{allergy.allergen}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(allergy.severity)}`}>
                        {allergy.severity.charAt(0).toUpperCase() + allergy.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/60">Reactions: {allergy.reactions}</p>
                    {allergy.notes && (
                      <p className="text-xs text-foreground/50 mt-2">{allergy.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAllergy(allergy.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 border border-dashed border-border text-center">
              <p className="text-foreground/60">No allergies recorded</p>
            </Card>
          )}
        </div>
      </section>

      {/* Medications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Medications</h2>
          <Button onClick={() => setShowMedicationForm(!showMedicationForm)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Medication
          </Button>
        </div>

        {showMedicationForm && (
          <Card className="p-6 border border-border">
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="med-name">Medication Name</Label>
                  <Input
                    id="med-name"
                    placeholder="e.g., Metformin"
                    value={newMedication.name || ''}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="med-dosage">Dosage</Label>
                  <Input
                    id="med-dosage"
                    placeholder="e.g., 1000mg"
                    value={newMedication.dosage || ''}
                    onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Input
                    id="med-frequency"
                    placeholder="e.g., Twice daily"
                    value={newMedication.frequency || ''}
                    onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="med-start">Start Date</Label>
                  <Input
                    id="med-start"
                    type="date"
                    value={newMedication.startDate || ''}
                    onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="med-reason">Reason for Medication</Label>
                <Input
                  id="med-reason"
                  placeholder="e.g., Type 2 Diabetes management"
                  value={newMedication.reason || ''}
                  onChange={(e) => setNewMedication({ ...newMedication, reason: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddMedication} className="flex-1">
                  Add Medication
                </Button>
                <Button
                  onClick={() => {
                    setShowMedicationForm(false)
                    setNewMedication({})
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {medications.length > 0 ? (
            medications.map((medication) => (
              <Card key={medication.id} className="p-4 border border-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{medication.name}</h3>
                    <p className="text-sm text-foreground/60 mt-1">{medication.dosage} - {medication.frequency}</p>
                    <p className="text-xs text-foreground/50 mt-1">For: {medication.reason}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteMedication(medication.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6 border border-dashed border-border text-center">
              <p className="text-foreground/60">No medications recorded</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
