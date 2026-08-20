'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

function getBotResponse(userMessage: string) {
  const msg = userMessage.toLowerCase()
  // try to read profile data from storage
  let profile: any = {}
  try {
    profile = JSON.parse(localStorage.getItem('profile') || '{}')
  } catch {}
  const weight = profile.currentWeight || 0
  const height = profile.height || 0

  // helper to compute BMI and category
  const calculateBMI = (w: number, h: number) => {
    if (!w || !h) return null
    const ht = h / 100
    return w / (ht * ht)
  }
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'underweight'
    if (bmi < 25) return 'normal weight'
    if (bmi < 30) return 'overweight'
    return 'obese'
  }

  if (msg.includes('help')) {
    return (
      "I'm here to assist with general wellness questions. " +
      'You can ask about weight loss tips, healthy eating, hydration, or simple illness advice.'
    )
  }

  if (msg.match(/(how many|how much).*water/) || msg.includes('water')) {
    if (!weight) {
      return 'I can calculate a personalised water goal if you add your weight to your profile.'
    }
    const litres = (weight * 0.033 + height * 0.0005).toFixed(1)
    const bmi = calculateBMI(weight, height)
    const bmiMsg = bmi
      ? ` Your BMI is ${bmi.toFixed(1)} (${getBMICategory(bmi)}).`
      : ''
    return `Based on your weight (${weight}kg) and height (${height}cm) you should drink about ${litres} L of water per day.${bmiMsg}`
  }

  if (msg.includes('run')) {
    if (!weight) {
      return 'To suggest a running distance I need your weight information. Please update your profile with your current weight.'
    }
    let kms = Math.max(3, Math.round(weight / 10))
    if (height) {
      kms = Math.round(kms * (height / 170))
    }
    const bmi = calculateBMI(weight, height)
    const bmiMsg = bmi
      ? ` (your BMI is ${bmi.toFixed(1)} – ${getBMICategory(bmi)})`
      : ''
    return `A reasonable starting target is around ${kms} km per day, adjusting based on how you feel and your fitness level.${bmiMsg}`
  }

  if (msg.includes('weight') || msg.includes('lose') || msg.includes('exercise')) {
    return (
      'To lose weight, aim for a balanced diet with a calorie deficit, ' +
      'regular physical activity (walking, cycling, strength training), and consistency. ' +
      'Stay patient and consult a professional if needed.'
    )
  }

  if (msg.includes('throat') || msg.includes('sore')) {
    return (
      'For a sore throat try warm salt-water gargles, stay hydrated, and rest your voice. ' +
      'If pain is severe or persists see a healthcare provider.'
    )
  }

  if (msg.includes('fever') || msg.includes('cold') || msg.includes('sick') || msg.includes('flu')) {
    return (
      "I'm not a medical professional, but for mild symptoms rest, stay hydrated, " +
      'take over-the-counter fever reducers if appropriate, and see a doctor if things worsen.'
    )
  }

  if (msg.includes('eat') || msg.includes('food') || msg.includes('diet')) {
    return (
      'A balanced diet includes fruits, vegetables, lean proteins, and whole grains. ' +
      'Avoid too much sugar or processed foods.'
    )
  }

  if (msg.includes('bmi')) {
    if (weight && height) {
      const bmi = calculateBMI(weight, height)
      return bmi
        ? `Your BMI is ${bmi.toFixed(1)}, which is considered ${getBMICategory(
            bmi,
          )}.` // note: getBMICategory returns text now, not object
        : 'Unable to calculate BMI with the information provided.'
    }
    return 'I need both weight and height in your profile to calculate BMI.'
  }

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return 'Hello! How can I help you today?'
  }

  return (
    'Thanks for your question. Generally, maintain good hydration, get enough sleep, ' +
    'and stay active. For anything specific, consider speaking to a healthcare professional.'
  )
}

export function ChatWidget() {
  const [messages, setMessages] = React.useState([] as Message[])
  const [input, setInput] = React.useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg: Message = { sender: 'user', text: input }
    const botMsg: Message = { sender: 'bot', text: getBotResponse(input) }
    setMessages((current: Message[]) => [...current, userMsg, botMsg])
    setInput('')
  }

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Wellness Chat</h2>
      <Card className="p-4 max-h-[50vh] overflow-auto space-y-2">
        {messages.map((m: Message, idx: number) => (
          <div
            key={idx}
            className={
              m.sender === 'user'
                ? 'text-right text-foreground'
                : 'text-left text-foreground/80'
            }
          >
            <span className="inline-block bg-secondary/10 p-2 rounded">
              {m.text}
            </span>
          </div>
        ))}
      </Card>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your message..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  )
}
