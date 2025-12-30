'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Button from '@/components/Button'
import { supabase } from '@/lib/supabase'
import { generatePollId } from '@/lib/utils'
import { Plus, Trash2, ArrowLeft } from 'lucide-react'

export default function CreatePoll() {
  const router = useRouter()
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [expiresIn, setExpiresIn] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ''])
    }
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validOptions = options.filter(o => o.trim())
    if (!question.trim() || validOptions.length < 2) {
      alert('Please enter a question and at least 2 options')
      return
    }

    setIsLoading(true)

    try {
      const pollId = generatePollId()
      const expiresAt = expiresIn
        ? new Date(Date.now() + expiresIn * 60 * 60 * 1000).toISOString()
        : null

      const { error } = await supabase
        .from('polls')
        .insert({
          id: pollId,
          question: question.trim(),
          options: validOptions,
          expires_at: expiresAt,
          is_active: true
        })

      if (error) throw error

      router.push(`/poll/${pollId}`)
    } catch (error) {
      console.error('Error creating poll:', error)
      alert('Failed to create poll. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-6">Create a Poll</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What would you like to ask?"
              className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              maxLength={200}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Options</label>
            <div className="space-y-3">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                    maxLength={100}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                type="button"
                onClick={addOption}
                className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary-hover transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add option
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Expires in (optional)</label>
            <select
              value={expiresIn || ''}
              onChange={(e) => setExpiresIn(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
            >
              <option value="">Never</option>
              <option value="1">1 hour</option>
              <option value="24">24 hours</option>
              <option value="168">7 days</option>
            </select>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Poll'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
