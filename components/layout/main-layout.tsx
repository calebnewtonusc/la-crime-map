'use client'

import { useState } from 'react'
import { Header } from './header'
import { MobileNav } from './mobile-nav'
import { Footer } from './footer'
import { MethodologyModal } from '../features/methodology-modal'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  const handleReportIssue = () => {
    window.open('https://github.com/yourusername/la-crime-map/issues/new', '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex flex-col">
      <Header
        onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        mobileMenuOpen={mobileMenuOpen}
      />
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main id="main-content" className="relative flex-1">
        {children}
      </main>
      <Footer
        onMethodologyClick={() => setMethodologyOpen(true)}
        onReportIssueClick={handleReportIssue}
      />
      <MethodologyModal
        isOpen={methodologyOpen}
        onClose={() => setMethodologyOpen(false)}
      />
    </div>
  )
}
