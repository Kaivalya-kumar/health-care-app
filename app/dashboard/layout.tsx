'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ChatWidget } from '@/components/chat-widget'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import {
  Home,
  User,
  Target,
  BookOpen,
  History,
  Award,
  Menu,
  X,
  LogOut,
  Settings,
} from 'lucide-react'

const navigationItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: Target, label: 'Goals', href: '/dashboard/goals' },
  { icon: BookOpen, label: 'Daily Log', href: '/dashboard/daily-log' },
  { icon: History, label: 'Health History', href: '/dashboard/health-history' },
  { icon: Award, label: 'Achievements', href: '/dashboard/achievements' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [helpOpen, setHelpOpen] = useState(false)
  const { theme = 'system', setTheme } = useTheme()
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const [isClient, setIsClient] = useState(false)
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null)

  useEffect(() => {
    setIsClient(true)
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/login')
    } else {
      setUser(JSON.parse(storedUser))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (!isClient) {
    return null
  }

  return (
    // constrain the outer container to the viewport and prevent the sidebar
    // from moving when the main content scrolls
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Navigation sidebar and main content layout */}
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center font-bold">
              W
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">WellNest</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  pathname === item.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-4">
          <div className="px-4 py-3 bg-sidebar-accent/10 rounded-lg">
            <p className="text-xs font-semibold text-sidebar-foreground/60 uppercase">Account</p>
            {/* intentionally omitting user name/email – sensitive login data should not be shown in the sidebar */}
          </div>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="h-16 bg-background border-b border-border flex items-center px-6 sticky top-0 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
          <h1 className="text-xl font-semibold text-foreground flex-1">Dashboard</h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setHelpOpen(true)}>
            Help
          </Button>
          <Sheet open={helpOpen} onOpenChange={setHelpOpen}>
            <SheetContent side="right" className="w-[24rem] p-6">
              <SheetHeader>
                <SheetTitle>Need help?</SheetTitle>
              </SheetHeader>
              <ChatWidget />
            </SheetContent>
          </Sheet>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
