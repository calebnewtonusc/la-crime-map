'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/utils/service-worker'

/**
 * Provider component to register service worker on client side
 */
export function ServiceWorkerProvider() {
  useEffect(() => {
    // Only register in production
    if (process.env.NODE_ENV === 'production') {
      registerServiceWorker()
    }
  }, [])

  return null
}
