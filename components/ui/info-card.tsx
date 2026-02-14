'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, Info, CheckCircle, AlertTriangle, LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

type InfoCardVariant = 'info' | 'success' | 'warning' | 'error'

interface InfoCardProps {
  variant?: InfoCardVariant
  title: string
  children: ReactNode
  onClose?: () => void
  className?: string
  icon?: LucideIcon
  footer?: ReactNode
  isClosable?: boolean
}

const variantStyles: Record<InfoCardVariant, {
  bg: string
  border: string
  iconBg: string
  iconColor: string
  titleColor: string
  textColor: string
}> = {
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
    textColor: 'text-blue-800 dark:text-blue-200'
  },
  success: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
    textColor: 'text-green-800 dark:text-green-200'
  },
  warning: {
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    titleColor: 'text-amber-900 dark:text-amber-100',
    textColor: 'text-amber-800 dark:text-amber-200'
  },
  error: {
    bg: 'bg-red-50 dark:bg-red-950/20',
    border: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
    textColor: 'text-red-800 dark:text-red-200'
  }
}

const defaultIcons: Record<InfoCardVariant, LucideIcon> = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle
}

export function InfoCard({
  variant = 'info',
  title,
  children,
  onClose,
  className = '',
  icon,
  footer,
  isClosable = true
}: InfoCardProps) {
  const styles = variantStyles[variant]
  const IconComponent = icon || defaultIcons[variant]

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`${styles.bg} ${styles.border} border rounded-xl shadow-lg overflow-hidden ${className}`}
        role="alert"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`${styles.iconBg} p-2 rounded-lg flex-shrink-0`}
              aria-hidden="true"
            >
              <IconComponent className={`w-5 h-5 ${styles.iconColor}`} />
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className={`text-sm font-semibold ${styles.titleColor}`}>
                  {title}
                </h3>

                {/* Close Button */}
                {isClosable && onClose && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className={`${styles.iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </motion.button>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`text-sm ${styles.textColor} leading-relaxed`}
              >
                {children}
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          {footer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`mt-4 pt-4 border-t ${styles.border}`}
            >
              {footer}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Preset variants for common use cases
export function InfoCardHelp({ title, children, onClose }: Omit<InfoCardProps, 'variant'>) {
  return (
    <InfoCard variant="info" title={title} onClose={onClose}>
      {children}
    </InfoCard>
  )
}

export function InfoCardSuccess({ title, children, onClose }: Omit<InfoCardProps, 'variant'>) {
  return (
    <InfoCard variant="success" title={title} onClose={onClose}>
      {children}
    </InfoCard>
  )
}

export function InfoCardWarning({ title, children, onClose }: Omit<InfoCardProps, 'variant'>) {
  return (
    <InfoCard variant="warning" title={title} onClose={onClose}>
      {children}
    </InfoCard>
  )
}

export function InfoCardError({ title, children, onClose }: Omit<InfoCardProps, 'variant'>) {
  return (
    <InfoCard variant="error" title={title} onClose={onClose}>
      {children}
    </InfoCard>
  )
}
