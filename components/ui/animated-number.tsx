'use client'

import { useEffect, useRef, useState } from 'react'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

interface AnimatedNumberProps {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  prefix?: string
  className?: string
  preserveValue?: boolean
  /** Aria label for screen readers */
  ariaLabel?: string
}

export function AnimatedNumber({
  value,
  duration = 1.2,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
  preserveValue = false,
  ariaLabel
}: AnimatedNumberProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true)
    }
  }, [inView, hasAnimated])

  const formattedValue = `${prefix}${value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })}${suffix}`

  return (
    <span
      ref={ref}
      className={className}
      aria-label={ariaLabel || formattedValue}
      role="status"
      aria-live="polite"
    >
      {inView ? (
        <CountUp
          start={preserveValue ? value : 0}
          end={value}
          duration={duration}
          decimals={decimals}
          suffix={suffix}
          prefix={prefix}
          separator=","
          preserveValue={preserveValue}
          useEasing={true}
          easingFn={(t, b, c, d) => {
            // Custom easing function for smoother animation
            t /= d / 2
            if (t < 1) return c / 2 * t * t * t + b
            t -= 2
            return c / 2 * (t * t * t + 2) + b
          }}
        />
      ) : (
        <span aria-hidden="true">{formattedValue}</span>
      )}
    </span>
  )
}
