'use client'

/**
 * TRUST SIGNALS INTEGRATION DEMO
 *
 * This file demonstrates how to integrate all trust signal components
 * into your LA Crime Map application for maximum credibility.
 *
 * Components included:
 * 1. DataSources - Shows where data comes from, update frequency, methodology
 * 2. MethodologyModal - Detailed explanation of safety score calculations
 * 3. AboutSection - Team info, open source badges, contact information
 * 4. Footer - Enhanced footer with trust signals (already integrated in MainLayout)
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DataSources } from './data-sources'
import { MethodologyModal } from './methodology-modal'
import { AboutSection } from './about-section'
import { Calculator, Database, Shield } from 'lucide-react'

export function TrustSignalsDemo() {
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
        >
          Trust Signals & Credibility Components
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          Building trust through transparency, open data, and clear communication
        </motion.p>
      </div>

      {/* Quick Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <QuickTrustCard
          icon={<Database className="w-6 h-6" />}
          title="Official Data"
          description="100% sourced from LAPD Open Data Portal"
          color="blue"
        />
        <QuickTrustCard
          icon={<Shield className="w-6 h-6" />}
          title="Transparent Methods"
          description="Open source with documented methodology"
          color="purple"
        />
        <QuickTrustCard
          icon={<Calculator className="w-6 h-6" />}
          title="Quality Assured"
          description="Data validation and quality checks"
          color="green"
        />
      </motion.div>

      {/* Section 1: Data Sources (Compact Mode) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            1. Compact Data Sources Badge
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Use this in headers or above maps to show data freshness
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <DataSources compact />
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
            View code example
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
{`import { DataSources } from '@/components/features'

// In your component:
<DataSources compact />`}
          </pre>
        </details>
      </section>

      {/* Section 2: Data Sources (Full Card) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            2. Full Data Sources Card
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Complete data transparency with update status, processing pipeline, and disclaimers
          </p>
        </div>
        <DataSources />
        <details className="text-sm">
          <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
            View code example
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
{`import { DataSources } from '@/components/features'

// In your component:
<DataSources />`}
          </pre>
        </details>
      </section>

      {/* Section 3: Methodology Modal */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            3. Methodology Modal
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Detailed explanation of safety score calculations with formulas, weights, and limitations
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <button
            onClick={() => setMethodologyOpen(true)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Open Methodology Modal
          </button>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            Click to see the full methodology explanation with formulas, weighting factors, and confidence intervals
          </p>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
            View code example
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
{`import { MethodologyModal } from '@/components/features'
import { useState } from 'react'

// In your component:
const [methodologyOpen, setMethodologyOpen] = useState(false)

return (
  <>
    <button onClick={() => setMethodologyOpen(true)}>
      View Methodology
    </button>

    <MethodologyModal
      isOpen={methodologyOpen}
      onClose={() => setMethodologyOpen(false)}
    />
  </>
)`}
          </pre>
        </details>
      </section>

      {/* Section 4: About Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            4. About Section
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Mission statement, trust badges, tech stack, attribution, and contact information
          </p>
        </div>
        <AboutSection />
        <details className="text-sm">
          <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
            View code example
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
{`import { AboutSection } from '@/components/features'

// In your component:
<AboutSection />`}
          </pre>
        </details>
      </section>

      {/* Section 5: Footer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            5. Enhanced Footer
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            The footer is already integrated into MainLayout with trust signals, data update status, and report inaccuracy button
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Footer automatically included in MainLayout</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scroll to the bottom of any page to see the enhanced footer with:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 ml-6">
              <li>• Last data update timestamp</li>
              <li>• LAPD Open Data source link</li>
              <li>• Methodology link (opens modal)</li>
              <li>• Report inaccuracy button</li>
              <li>• Disclaimer notice</li>
            </ul>
          </div>
        </div>
        <details className="text-sm">
          <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 font-medium">
            View code example
          </summary>
          <pre className="mt-2 p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-xs">
{`// Footer is already integrated in MainLayout
// No additional code needed - it appears on all pages automatically

// If you need to use it standalone:
import { Footer } from '@/components/layout/footer'

<Footer
  onMethodologyClick={() => setMethodologyOpen(true)}
  onReportIssueClick={() => window.open('...', '_blank')}
/>`}
          </pre>
        </details>
      </section>

      {/* Integration Recommendations */}
      <section className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
          Recommended Integration
        </h2>
        <div className="space-y-4 text-sm text-indigo-800 dark:text-indigo-200">
          <div>
            <h3 className="font-semibold mb-2">Main Page (app/page.tsx):</h3>
            <ul className="space-y-1 ml-6">
              <li>• Add compact DataSources badge above the map</li>
              <li>• Include AboutSection below the map</li>
              <li>• Add "View Methodology" button that opens modal</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Already Integrated:</h3>
            <ul className="space-y-1 ml-6">
              <li>• Footer with trust signals (in MainLayout)</li>
              <li>• MethodologyModal (in MainLayout, triggered by footer links)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Optional Additions:</h3>
            <ul className="space-y-1 ml-6">
              <li>• Full DataSources card on a dedicated "About" or "Data" page</li>
              <li>• AboutSection on a standalone "About Us" page</li>
              <li>• Link to methodology modal from multiple locations</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  )
}

interface QuickTrustCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'blue' | 'purple' | 'green'
}

function QuickTrustCard({ icon, title, description, color }: QuickTrustCardProps) {
  const colors = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-100',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      title: 'text-purple-900 dark:text-purple-100',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-100',
    },
  }

  const c = colors[color]

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-6`}>
      <div className={`${c.icon} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className={`${c.title} font-semibold mb-2`}>{title}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  )
}
