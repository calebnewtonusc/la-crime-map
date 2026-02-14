'use client'

import { motion } from 'framer-motion'
import { Github, ExternalLink, Mail, BookOpen, Code2, Users, Shield, Award } from 'lucide-react'

interface AboutSectionProps {
  className?: string
}

export function AboutSection({ className = '' }: AboutSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Why Trust This Data?</h3>
            <p className="text-indigo-100 text-sm mt-0.5">Transparent, open, and reliable</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        {/* Mission Statement */}
        <section className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Our Mission
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            We believe public safety data should be accessible, understandable, and actionable. This project transforms
            complex crime statistics from the Los Angeles Police Department into clear visualizations that help residents,
            researchers, and policymakers make informed decisions.
          </p>
        </section>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TrustCard
            icon={<Code2 className="w-5 h-5" />}
            title="Open Source"
            description="100% open source code available for review and contribution"
            badge="MIT License"
          />
          <TrustCard
            icon={<Shield className="w-5 h-5" />}
            title="Official Data"
            description="All statistics sourced directly from LAPD Open Data Portal"
            badge="Verified"
          />
          <TrustCard
            icon={<BookOpen className="w-5 h-5" />}
            title="Transparent Methods"
            description="Complete methodology documentation available"
            badge="Documented"
          />
          <TrustCard
            icon={<Award className="w-5 h-5" />}
            title="No Commercial Bias"
            description="Free public service with no advertising or data sales"
            badge="Non-profit"
          />
        </div>

        {/* Project Links */}
        <section className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Project Resources
          </h4>
          <div className="space-y-2">
            <ProjectLink
              href="https://github.com/yourusername/la-crime-map"
              icon={<Github className="w-4 h-4" />}
              title="View on GitHub"
              description="Source code, issues, and contribution guide"
            />
            <ProjectLink
              href="/api/docs"
              icon={<BookOpen className="w-4 h-4" />}
              title="API Documentation"
              description="Access crime data programmatically"
            />
            <ProjectLink
              href="https://data.lacity.org"
              icon={<ExternalLink className="w-4 h-4" />}
              title="LA Open Data Portal"
              description="Official source of our crime statistics"
            />
          </div>
        </section>

        {/* Technology Stack */}
        <section className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            Built With
          </h4>
          <div className="flex flex-wrap gap-2">
            <TechBadge name="Next.js 14" />
            <TechBadge name="TypeScript" />
            <TechBadge name="React Leaflet" />
            <TechBadge name="Tailwind CSS" />
            <TechBadge name="Framer Motion" />
            <TechBadge name="LAPD Open Data API" />
          </div>
        </section>

        {/* Attribution */}
        <section className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
            Attribution & Credits
          </h4>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
              <span>
                Crime data provided by the{' '}
                <a
                  href="https://data.lacity.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Los Angeles Police Department Open Data Initiative
                </a>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
              <span>
                Geographic boundaries based on LA County official neighborhood definitions
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
              <span>
                Mapping technology powered by{' '}
                <a
                  href="https://leafletjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Leaflet
                </a>
                {' '}and{' '}
                <a
                  href="https://www.openstreetmap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  OpenStreetMap
                </a>
              </span>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Get in Touch
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Questions about our methodology? Found a bug? Want to contribute? We welcome community feedback and collaboration.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/yourusername/la-crime-map/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-800 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              Report an Issue
            </a>
            <a
              href="mailto:contact@lacrimemap.com"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              Email Us
            </a>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
            Responsible Use Guidelines
          </h4>
          <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Use this data to make informed decisions about neighborhood safety</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Combine with other sources like local news and community input</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
              <span>Understand limitations and context before drawing conclusions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
              <span>Don't use scores to stigmatize communities or perpetuate stereotypes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 dark:text-red-400 mt-0.5">✗</span>
              <span>Don't make real estate decisions based solely on these metrics</span>
            </li>
          </ul>
        </section>

      </div>
    </motion.div>
  )
}

interface TrustCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge: string
}

function TrustCard({ icon, title, description, badge }: TrustCardProps) {
  return (
    <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-start gap-3 mb-2">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
            {title}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <span className="inline-flex items-center px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-medium">
          {badge}
        </span>
      </div>
    </div>
  )
}

interface ProjectLinkProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}

function ProjectLink({ href, icon, title, description }: ProjectLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all group"
    >
      <div className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/30 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          {description}
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" />
    </a>
  )
}

interface TechBadgeProps {
  name: string
}

function TechBadge({ name }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
      {name}
    </span>
  )
}
