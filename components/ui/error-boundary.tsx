'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className="flex items-center justify-center min-h-[400px] p-8"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 mb-6">
              <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-3">
              Something Went Wrong
            </h2>
            <p className="text-base text-gray-600 dark:text-dark-text-secondary mb-6 leading-relaxed">
              We encountered an unexpected error while loading this content. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="min-w-[160px] min-h-[44px] px-6 py-3 bg-neon-cyan dark:bg-la-sunset-purple text-white font-medium rounded-lg hover:bg-neon-cyan/90 dark:hover:bg-la-sunset-purple/90 focus:outline-none focus:ring-2 focus:ring-neon-cyan dark:focus:ring-la-sunset-purple focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-all duration-200 shadow-sm hover:shadow-md"
              aria-label="Refresh page to retry"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div
      className="flex items-center justify-center min-h-[400px] p-8"
      role="alert"
      aria-live="polite"
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-3">
          Unable to Load Data
        </h2>
        <p className="text-base text-gray-600 dark:text-dark-text-secondary mb-6 leading-relaxed">
          {message || 'We are experiencing difficulty loading this information. Please try again.'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="min-w-[140px] min-h-[44px] px-6 py-3 bg-neon-cyan dark:bg-la-sunset-purple text-white font-medium rounded-lg hover:bg-neon-cyan/90 dark:hover:bg-la-sunset-purple/90 focus:outline-none focus:ring-2 focus:ring-neon-cyan dark:focus:ring-la-sunset-purple focus:ring-offset-2 dark:focus:ring-offset-dark-bg-primary transition-all duration-200 shadow-sm hover:shadow-md"
            aria-label="Retry loading data"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  )
}
