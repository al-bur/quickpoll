'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  percentage: number
  className?: string
  color?: string
}

export default function ProgressBar({
  percentage,
  className = '',
  color = 'bg-primary'
}: ProgressBarProps) {
  return (
    <div className={cn('w-full h-2 bg-surface-hover rounded-full overflow-hidden', className)}>
      <motion.div
        className={cn('h-full rounded-full', color)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
  )
}
