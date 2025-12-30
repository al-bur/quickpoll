import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateVoterId(): string {
  if (typeof window === 'undefined') return ''
  let voterId = localStorage.getItem('voter_id')
  if (!voterId) {
    voterId = crypto.randomUUID()
    localStorage.setItem('voter_id', voterId)
  }
  return voterId
}

export function formatTimeAgo(date: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function generatePollId(): string {
  return Math.random().toString(36).substring(2, 8)
}
