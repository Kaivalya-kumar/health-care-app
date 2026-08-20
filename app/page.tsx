'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, Apple, Zap, Target, TrendingUp, Award, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              W
            </div>
            <span className="text-xl font-bold text-foreground">WellNest</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground/70 hover:text-foreground transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition">
              How It Works
            </a>
            <a href="#why-us" className="text-sm text-foreground/70 hover:text-foreground transition">
              Why Us
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Your Personal{' '}
              <span className="text-primary">Wellness Journey</span>
            </h1>
            <p className="text-xl text-foreground/60 text-balance max-w-3xl mx-auto">
              Track your health goals, monitor daily progress, and achieve lasting wellness with comprehensive health tracking and intelligent insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Comprehensive Wellness Tracking</h2>
            <p className="text-lg text-foreground/60">Everything you need to monitor and improve your health</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Heart className="w-8 h-8" />}
              title="Health Metrics"
              description="Track weight, BMI, vital signs, and health conditions all in one dashboard"
            />
            <FeatureCard
              icon={<Target className="w-8 h-8" />}
              title="Smart Goals"
              description="Set personalized health goals and get progress tracking with milestones"
            />
            <FeatureCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Analytics"
              description="Visualize your progress with detailed charts and historical insights"
            />
            <FeatureCard
              icon={<Apple className="w-8 h-8" />}
              title="Nutrition Logs"
              description="Log meals, track calories, and monitor nutritional intake daily"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Activity Tracking"
              description="Record workouts, exercises, and daily physical activities"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8" />}
              title="Achievements"
              description="Earn badges and celebrate milestones on your wellness journey"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How WellNest Works</h2>
            <p className="text-lg text-foreground/60">Start your wellness transformation in just a few steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Sign Up', desc: 'Create your account and build your health profile' },
              { step: 2, title: 'Set Goals', desc: 'Define personalized wellness objectives' },
              { step: 3, title: 'Track Daily', desc: 'Log activities, meals, sleep, and workouts' },
              { step: 4, title: 'Achieve Goals', desc: 'Celebrate progress and earn achievements' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose WellNest?</h2>
            <p className="text-lg text-foreground/60">The complete platform for wellness tracking and health management</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: 'All-in-One Dashboard', desc: 'Monitor all your health metrics in one unified, easy-to-use interface' },
              { title: 'Personalized Tracking', desc: 'Customize your wellness goals based on your unique health profile' },
              { title: 'Medical History', desc: 'Safely store and organize your medical conditions and allergies' },
              { title: 'Smart Analytics', desc: 'Get actionable insights from your health data with visual reports' },
              { title: 'Gamification', desc: 'Stay motivated with achievement badges and progress milestones' },
              { title: 'User-Friendly', desc: 'Intuitive design that makes health tracking simple and enjoyable' },
            ].map((item, idx) => (
              <Card key={idx} className="p-6 border border-border hover:shadow-lg transition flex gap-4">
                <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/60">{item.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold">Ready to Transform Your Health?</h2>
            <p className="text-lg opacity-90 text-balance">
              Join thousands of users who have taken control of their wellness journey with WellNest.
            </p>
          </div>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get Started Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  W
                </div>
                <span className="text-lg font-bold text-foreground">WellNest</span>
              </div>
              <p className="text-sm text-foreground/60">Your personal wellness journey starts here.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#features" className="hover:text-foreground transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#about" className="hover:text-foreground transition">About</a></li>
                <li><a href="#blog" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#contact" className="hover:text-foreground transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><a href="#privacy" className="hover:text-foreground transition">Privacy</a></li>
                <li><a href="#terms" className="hover:text-foreground transition">Terms</a></li>
                <li><a href="#cookies" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2026 WellNest. All rights reserved. | Built with care for your wellness journey.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 border border-border hover:shadow-lg hover:border-primary/50 transition group">
      <div className="text-primary group-hover:scale-110 transition mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
      <p className="text-sm text-foreground/60">{description}</p>
    </Card>
  )
}
