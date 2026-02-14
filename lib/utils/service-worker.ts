'use client'

/**
 * Register the service worker for offline support and caching
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('[Service Worker] Not supported in this environment')
    return
  }

  // Wait for page to load before registering
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
      })

      console.log('[Service Worker] Registered successfully:', registration.scope)

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[Service Worker] New version available')
            // Optionally notify user about update
          }
        })
      })
    } catch (error) {
      console.error('[Service Worker] Registration failed:', error)
    }
  })
}

/**
 * Unregister the service worker
 */
export async function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log('[Service Worker] Unregistered successfully')
    }
  } catch (error) {
    console.error('[Service Worker] Unregistration failed:', error)
  }
}

/**
 * Check if the service worker is registered
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    return !!registration
  } catch (error) {
    return false
  }
}
