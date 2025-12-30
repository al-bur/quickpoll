'use client'

import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  separator?: string
}

export default function CountUp({
  to,
  from = 0,
  duration = 0.5,
  className = '',
  separator = ','
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(from)

  const damping = 20 + 40 * (1 / duration)
  const stiffness = 100 * (1 / duration)

  const springValue = useSpring(motionValue, { damping, stiffness })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  const formatValue = useCallback(
    (latest: number) => {
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }
      const formattedNumber = Intl.NumberFormat('en-US', options).format(Math.round(latest))
      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber
    },
    [separator]
  )

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(from)
    }
  }, [from, formatValue])

  useEffect(() => {
    if (isInView) {
      motionValue.set(to)
    }
  }, [isInView, motionValue, to])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest)
      }
    })
    return () => unsubscribe()
  }, [springValue, formatValue])

  return <span className={className} ref={ref} />
}
