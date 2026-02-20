'use client'

import { motion } from 'framer-motion'
import { Calendar, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

export type TimeFilterValue = {
  mode: 'preset' | 'season' | 'month' | 'year'
  days?: number
  season?: 'spring' | 'summer' | 'fall' | 'winter'
  month?: number
  year?: number
  label: string
}

interface TimeFilterProps {
  value: TimeFilterValue
  onChange: (value: TimeFilterValue) => void
  className?: string
}

const presets: TimeFilterValue[] = [
  { mode: 'preset', days: 30, label: 'Last 30 Days' },
  { mode: 'preset', days: 90, label: 'Last 3 Months' },
  { mode: 'preset', days: 180, label: 'Last 6 Months' },
  { mode: 'preset', days: 365, label: 'Last Year' },
]

const seasons: { value: TimeFilterValue['season']; label: string; months: string }[] = [
  { value: 'winter', label: 'Winter', months: 'Dec–Feb' },
  { value: 'spring', label: 'Spring', months: 'Mar–May' },
  { value: 'summer', label: 'Summer', months: 'Jun–Aug' },
  { value: 'fall', label: 'Fall', months: 'Sep–Nov' },
]

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const years = [2024, 2023, 2022]

export function TimeFilter({ value, onChange, className = '' }: TimeFilterProps) {
  const [activeTab, setActiveTab] = useState<'preset' | 'season' | 'month' | 'year'>('preset')
  const [isOpen, setIsOpen] = useState(false)

  const handlePreset = (preset: TimeFilterValue) => {
    onChange(preset)
    setIsOpen(false)
  }

  const handleSeason = (season: TimeFilterValue['season']) => {
    const labels = { winter: 'Winter (Dec–Feb)', spring: 'Spring (Mar–May)', summer: 'Summer (Jun–Aug)', fall: 'Fall (Sep–Nov)' }
    onChange({ mode: 'season', season, label: labels[season!] })
    setIsOpen(false)
  }

  const handleMonth = (month: number) => {
    onChange({ mode: 'month', month, year: 2024, label: `${months[month]} 2024` })
    setIsOpen(false)
  }

  const handleYear = (year: number) => {
    onChange({ mode: 'year', year, label: `Full Year ${year}` })
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Select time period"
        aria-expanded={isOpen}
      >
        <Calendar className="w-4 h-4 text-blue-500" aria-hidden="true" />
        <span>{value.label}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-500" aria-hidden="true" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full mt-2 left-0 w-72 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            role="dialog"
            aria-label="Time period selection"
          >
            {/* Tab navigation */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {(['preset', 'season', 'month', 'year'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    activeTab === tab
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-3">
              {activeTab === 'preset' && (
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.days}
                      onClick={() => handlePreset(preset)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.mode === 'preset' && value.days === preset.days
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'season' && (
                <div className="grid grid-cols-2 gap-2">
                  {seasons.map(({ value: s, label, months: m }) => (
                    <button
                      key={s}
                      onClick={() => handleSeason(s)}
                      className={`px-3 py-3 rounded-lg text-sm text-left transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.mode === 'season' && value.season === s
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-2 border-blue-300 dark:border-blue-600'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-semibold">{label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m}</div>
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'month' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {months.map((m, i) => (
                    <button
                      key={i}
                      onClick={() => handleMonth(i)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.mode === 'month' && value.month === i
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'year' && (
                <div className="space-y-1">
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => handleYear(y)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        value.mode === 'year' && value.year === y
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-semibold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      Full Year {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
