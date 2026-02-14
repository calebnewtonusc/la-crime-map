'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Clock, Database, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Footer() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    const now = new Date()
    const last = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    setLastUpdated(last)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than an hour ago'
    }
  }

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section - Data Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-200 dark:border-gray-700">

          {/* Last Update */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-4"
          >
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Last Data Update
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatRelativeTime(lastUpdated)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                {formatDate(lastUpdated)}
              </p>
            </div>
          </motion.div>

          {/* Official Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Official Data Source
              </h3>
              <a
                href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                LAPD Open Data Portal
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                Updated every 24 hours
              </p>
            </div>
          </motion.div>

          {/* Open Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-4"
          >
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                Open Source
              </h3>
              <a
                href="https://github.com/calebnewtonusc/la-crime-map"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                View on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                Free & transparent methodology
              </p>
            </div>
          </motion.div>
        </div>

        {/* Important Disclaimer */}
        <div className="py-8">
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-600 rounded-r-lg p-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-2">
                  Important Disclaimer
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  This map is for informational and educational purposes only. Crime statistics are simplified and may not reflect current conditions. Safety is multidimensional and cannot be fully captured by crime data alone. Always consult official sources, local authorities, and community resources for comprehensive safety information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Links */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
              <span>© {new Date().getFullYear()} LA Crime Map</span>
              <span>•</span>
              <span>Educational Use Only</span>
              <span>•</span>
              <a
                href="#how-it-works"
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                How It Works
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/calebnewtonusc/la-crime-map"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/calebnewtonusc/la-crime-map/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
