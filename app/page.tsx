'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { BarChart3, Zap, Share2, Clock } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-accent" />,
      title: 'Instant Creation',
      description: 'Create a poll in seconds. No account needed.'
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: 'Real-time Results',
      description: 'Watch votes come in live as people respond.'
    },
    {
      icon: <Share2 className="w-6 h-6 text-secondary" />,
      title: 'Easy Sharing',
      description: 'Share via link. Works on any device.'
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-400" />,
      title: 'Auto Expiration',
      description: 'Set polls to close automatically.'
    }
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          QuickPoll
        </h1>
        <p className="text-xl text-slate-400 mb-8 max-w-md">
          Create instant polls and get real-time feedback. No sign-up required.
        </p>

        <Button
          size="lg"
          onClick={() => router.push('/create')}
          className="mb-12"
        >
          Create a Poll
        </Button>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-4 w-full max-w-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-surface rounded-xl p-4 border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <div className="mb-2">{feature.icon}</div>
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-slate-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
