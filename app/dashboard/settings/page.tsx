'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Bell, Lock, Eye, Globe, Smartphone } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    dailyReminders: true,
    weeklyReport: true,
    dataPrivacy: 'private',
    theme: 'light',
  })

  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  })

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings({
      ...settings,
      [key]: value,
    })
  }

  const handlePasswordChange = () => {
    if (password.current && password.new && password.new === password.confirm) {
      setPassword({ current: '', new: '', confirm: '' })
      setShowPasswordForm(false)
      alert('Password updated successfully')
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-foreground/60 mt-1">Manage your account and preferences</p>
      </div>

      {/* Notification Settings */}
      <Card className="p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Notifications</h2>
            <p className="text-sm text-foreground/60">Manage how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-foreground/60">Receive updates via email</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                className="w-5 h-5 rounded border-border"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-foreground/60">Receive push notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                className="w-5 h-5 rounded border-border"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Daily Reminders</p>
              <p className="text-sm text-foreground/60">Get daily wellness reminders</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.dailyReminders}
                onChange={(e) => handleSettingChange('dailyReminders', e.target.checked)}
                className="w-5 h-5 rounded border-border"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-sm text-foreground/60">Receive weekly wellness summary</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.weeklyReport}
                onChange={(e) => handleSettingChange('weeklyReport', e.target.checked)}
                className="w-5 h-5 rounded border-border"
              />
            </div>
          </div>
        </div>

        <Button className="mt-6 w-full">Save Notification Settings</Button>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Privacy</h2>
            <p className="text-sm text-foreground/60">Control your data visibility</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="privacy">Profile Visibility</Label>
            <select
              id="privacy"
              value={settings.dataPrivacy}
              onChange={(e) => handleSettingChange('dataPrivacy', e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
            >
              <option value="private">Private - Only you can see your data</option>
              <option value="friends">Friends Only - Share with connections</option>
              <option value="public">Public - Everyone can see your profile</option>
            </select>
            <p className="text-xs text-foreground/50">
              Choose who can view your wellness data and profile information
            </p>
          </div>
        </div>

        <Button className="mt-6 w-full">Save Privacy Settings</Button>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Appearance</h2>
            <p className="text-sm text-foreground/60">Customize your app experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-input border border-border text-foreground"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>

        <Button className="mt-6 w-full">Save Appearance Settings</Button>
      </Card>

      {/* Security - Change Password */}
      <Card className="p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Security</h2>
            <p className="text-sm text-foreground/60">Manage your account security</p>
          </div>
        </div>

        {!showPasswordForm ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowPasswordForm(true)}
          >
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={password.current}
                onChange={(e) =>
                  setPassword({ ...password, current: e.target.value })
                }
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                value={password.new}
                onChange={(e) =>
                  setPassword({ ...password, new: e.target.value })
                }
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={password.confirm}
                onChange={(e) =>
                  setPassword({ ...password, confirm: e.target.value })
                }
                className="bg-input border-border"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePasswordChange}
                className="flex-1"
              >
                Update Password
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordForm(false)
                  setPassword({ current: '', new: '', confirm: '' })
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Connected Devices */}
      <Card className="p-6 border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center text-blue-600 flex-shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Connected Devices</h2>
            <p className="text-sm text-foreground/60">Manage your active sessions</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">Chrome on Windows</p>
              <p className="text-sm text-foreground/60">Last accessed: 2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Remove
            </Button>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg flex items-start justify-between">
            <div>
              <p className="font-medium text-foreground">Safari on iPhone</p>
              <p className="text-sm text-foreground/60">Last accessed: 1 day ago</p>
            </div>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
              Remove
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border border-destructive/50 bg-destructive/5">
        <h2 className="text-xl font-bold text-destructive mb-4">Danger Zone</h2>
        <p className="text-sm text-foreground/60 mb-4">
          These actions cannot be undone. Please be careful.
        </p>
        <Button variant="destructive" className="w-full">
          Delete Account
        </Button>
      </Card>
    </div>
  )
}
