'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
    targetWeight: '',
    gender: 'Male',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Valid email is required'
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      newErrors.age = 'You must be 18 or older'
    }

    if (!formData.height || parseInt(formData.height) < 100 || parseInt(formData.height) > 250) {
      newErrors.height = 'Height must be between 100-250 cm'
    }

    if (!formData.weight || parseFloat(formData.weight) < 30 || parseFloat(formData.weight) > 300) {
      newErrors.weight = 'Weight must be between 30-300 kg'
    }

    if (!formData.targetWeight || parseFloat(formData.targetWeight) < 30 || parseFloat(formData.targetWeight) > 300) {
      newErrors.targetWeight = 'Target weight must be between 30-300 kg'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      // Simulate signup - in production, connect to backend
      setTimeout(() => {
        localStorage.setItem('user', JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          currentWeight: parseFloat(formData.weight),
          targetWeight: parseFloat(formData.targetWeight),
          gender: formData.gender,
          createdAt: new Date().toISOString()
        }))
        localStorage.setItem('profile', JSON.stringify({
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          height: parseInt(formData.height),
          currentWeight: parseFloat(formData.weight),
          targetWeight: parseFloat(formData.targetWeight),
          gender: formData.gender,
        }))
        router.push('/dashboard')
      }, 800)
    } catch (err) {
      setErrors({ submit: 'Signup failed. Please try again.' })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-foreground">WellNest</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Start Your Wellness Journey</h1>
          <p className="text-foreground/60">Create your account and begin tracking your health</p>
        </div>

        {/* Signup Card */}
        <Card className="p-8 border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-foreground font-medium">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                type="number"
                placeholder="25"
                value={formData.age}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.age && <p className="text-xs text-destructive">{errors.age}</p>}
            </div>

            {/* Height Field */}
            <div className="space-y-2">
              <Label htmlFor="height" className="text-foreground font-medium">
                Height (cm)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                placeholder="175"
                value={formData.height}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.height && <p className="text-xs text-destructive">{errors.height}</p>}
            </div>

            {/* Weight Field */}
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-foreground font-medium">
                Weight (kg)
              </Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="75"
                step="0.1"
                value={formData.weight}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.weight && <p className="text-xs text-destructive">{errors.weight}</p>}
            </div>

            {/* Target Weight Field */}
            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-foreground font-medium">
                Target Weight (kg)
              </Label>
              <Input
                id="targetWeight"
                name="targetWeight"
                type="number"
                placeholder="70"
                step="0.1"
                value={formData.targetWeight}
                onChange={handleChange}
                disabled={isLoading}
                className="bg-input text-foreground placeholder:text-foreground/40"
              />
              {errors.targetWeight && <p className="text-xs text-destructive">{errors.targetWeight}</p>}
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-foreground font-medium">
                Gender
              </Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-md bg-input text-foreground border border-input"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-input text-foreground placeholder:text-foreground/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="bg-input text-foreground placeholder:text-foreground/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                {errors.submit}
              </div>
            )}

            {/* Terms Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-input text-primary mt-1 flex-shrink-0"
                disabled={isLoading}
              />
              <span className="text-sm text-foreground/70">
                I agree to the{' '}
                <a href="#terms" className="text-primary hover:text-primary/80 transition font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-primary hover:text-primary/80 transition font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Card>

        {/* Sign In Link */}
        <div className="text-center text-foreground/60">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition">
            Sign in here
          </Link>
        </div>

        {/* Benefits */}
        <Card className="p-4 bg-secondary/10 border border-secondary/30 space-y-3">
          <p className="text-xs font-semibold text-foreground uppercase">What you get:</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground/70">Free health dashboard</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground/70">Daily activity tracking</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs text-foreground/70">Achievement badges</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
