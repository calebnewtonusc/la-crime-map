'use client'

import { useEffect, useRef } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
}

export function AnimatedNumber({
  value,
  duration = 2,
  decimals = 0,
  suffix = '',
  prefix = ''
}: AnimatedNumberProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <span ref={ref}>
      {inView ? (
        <CountUp
          end={value}
          duration={duration}
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
          separator=","
        />
      ) : (
        <span>{prefix}{value.toLocaleString()}{suffix}</span>
      )}
    </span>
  )
}
