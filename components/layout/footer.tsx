'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Clock, Database, AlertCircle, Mail, FileText } from 'lucide-react'
import { useState, useEffect } from 'react'

interface FooterProps {
  onMethodologyClick?: () => void
  onReportIssueClick?: () => void
}

export function Footer({ onMethodologyClick, onReportIssueClick }: FooterProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate last update time (in production, fetch from API)
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
    <footer className="bg-white dark:bg-dark-bg-secondary border-t border-gray-200 dark:border-gray-700 mt-4xl">
      <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl py-3xl">

        {/* Top Section - Trust Signals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-2xl pb-2xl border-b border-gray-200 dark:border-gray-700">

          {/* Data Update Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-start gap-3"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-1">
                Last Data Update
              </div>
              <div className="text-xs text-gray-600 dark:text-dark-text-tertiary">
                {formatRelativeTime(lastUpdated)}
              </div>
              <div className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-0.5">
                {formatDate(lastUpdated)}
              </div>
            </div>
          </motion.div>

          {/* Data Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-1">
                Official Data Source
              </div>
              <a
                href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                LAPD Open Data Portal
                <ExternalLink className="w-3 h-3" />
              </a>
              <div className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-0.5">
                Updated every 24 hours
              </div>
            </div>
          </motion.div>

          {/* Methodology */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-start gap-3"
          >
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-1">
                Transparent Methods
              </div>
              <button
                onClick={onMethodologyClick}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                View methodology
              </button>
              <div className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-0.5">
                Open source & documented
              </div>
            </div>
          </motion.div>
        </div>

        {/* Middle Section - Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-3">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#mission" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <button
                  onClick={onMethodologyClick}
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors"
                >
                  Methodology
                </button>
              </li>
              <li>
                <a href="#limitations" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  Limitations
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-3">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/yourusername/la-crime-map"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="/api/docs" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://data.lacity.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
                >
                  LA Open Data
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-3">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="/privacy" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/disclaimer" className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors">
                  Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@lacrimemap.com"
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Email Us
                </a>
              </li>
              <li>
                <button
                  onClick={onReportIssueClick}
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3" />
                  Report Inaccuracy
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/yourusername/la-crime-map/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-dark-text-secondary hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  Report Issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Disclaimer & Copyright */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 space-y-4">

          {/* Important Disclaimer */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
                  Important Disclaimer
                </h4>
                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                  This map is for informational and educational purposes only. Crime statistics are simplified and may not
                  reflect current conditions. Safety is multidimensional and cannot be fully captured by crime data alone.
                  Always consult official sources, local authorities, and community resources for comprehensive safety information.
                  The creators of this site are not responsible for decisions made based on this data.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright & Open Source */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600 dark:text-dark-text-tertiary">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2">
              <span>© {new Date().getFullYear()} LA Crime Map</span>
              <a
                href="https://github.com/yourusername/la-crime-map/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors inline-flex items-center gap-1"
              >
                MIT License
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>Made with data from LAPD</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/yourusername/la-crime-map"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-900 dark:hover:text-dark-text-primary transition-colors"
                aria-label="View source on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
