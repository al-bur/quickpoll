'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { generateVoterId } from '@/lib/utils'
import SpotlightCard from '@/components/SpotlightCard'
import ProgressBar from '@/components/ProgressBar'
import CountUp from '@/components/CountUp'
import Button from '@/components/Button'
import { Share2, Check, ArrowLeft, Clock } from 'lucide-react'

interface Poll {
  id: string
  question: string
  options: string[]
  expires_at: string | null
  is_active: boolean
}

interface VoteCounts {
  [key: number]: number
}

export default function PollPage() {
  const params = useParams()
  const router = useRouter()
  const pollId = params.id as string

  const [poll, setPoll] = useState<Poll | null>(null)
  const [voteCounts, setVoteCounts] = useState<VoteCounts>({})
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0)

  useEffect(() => {
    fetchPoll()
    checkIfVoted()
    subscribeToVotes()
  }, [pollId])

  const fetchPoll = async () => {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single()

    if (error || !data) {
      router.push('/')
      return
    }

    setPoll(data)
    await fetchVoteCounts()
    setIsLoading(false)
  }

  const fetchVoteCounts = async () => {
    const { data, error } = await supabase
      .from('votes')
      .select('option_index')
      .eq('poll_id', pollId)

    if (!error && data) {
      const counts: VoteCounts = {}
      data.forEach(vote => {
        counts[vote.option_index] = (counts[vote.option_index] || 0) + 1
      })
      setVoteCounts(counts)
    }
  }

  const checkIfVoted = async () => {
    const voterId = generateVoterId()
    const { data } = await supabase
      .from('votes')
      .select('id')
      .eq('poll_id', pollId)
      .eq('voter_id', voterId)
      .single()

    if (data) {
      setHasVoted(true)
    }
  }

  const subscribeToVotes = () => {
    const channel = supabase
      .channel(`votes:${pollId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${pollId}`
        },
        () => {
          fetchVoteCounts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleVote = async () => {
    if (selectedOption === null || hasVoted) return

    const voterId = generateVoterId()

    const { error } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_index: selectedOption,
        voter_id: voterId
      })

    if (!error) {
      setHasVoted(true)
      fetchVoteCounts()
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!poll) return null

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <button
          onClick={copyLink}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Share'}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold mb-2">{poll.question}</h1>

        <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
          <span>
            <CountUp to={totalVotes} /> votes
          </span>
          {poll.expires_at && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {isExpired ? 'Expired' : `Expires ${new Date(poll.expires_at).toLocaleDateString()}`}
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {poll.options.map((option, index) => {
            const voteCount = voteCounts[index] || 0
            const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0

            return (
              <SpotlightCard
                key={index}
                selected={selectedOption === index}
                onClick={() => !hasVoted && !isExpired && setSelectedOption(index)}
                className={hasVoted || isExpired ? 'cursor-default' : ''}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{option}</span>
                  {(hasVoted || isExpired) && (
                    <span className="text-sm text-slate-400">
                      <CountUp to={voteCount} /> ({percentage.toFixed(0)}%)
                    </span>
                  )}
                </div>
                {(hasVoted || isExpired) && (
                  <ProgressBar percentage={percentage} />
                )}
              </SpotlightCard>
            )
          })}
        </div>

        {!hasVoted && !isExpired && (
          <Button
            onClick={handleVote}
            size="lg"
            className="w-full"
            disabled={selectedOption === null}
          >
            Vote
          </Button>
        )}

        {hasVoted && (
          <p className="text-center text-slate-400">
            Thanks for voting! Results update in real-time.
          </p>
        )}

        {isExpired && (
          <p className="text-center text-slate-400">
            This poll has expired.
          </p>
        )}
      </motion.div>
    </div>
  )
}
