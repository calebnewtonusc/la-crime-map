'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import {
  AIChatAssistant,
  AISmartInsights,
  AISafetyAnalysis,
  AINeighborhoodDescription,
} from '@/components/features';
import { laNeighborhoods } from '@/lib/data/neighborhoods';
import { Sparkles } from 'lucide-react';

export default function AIDemoPage() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(
    laNeighborhoods.features[0].properties
  );

  return (
    <ErrorBoundary>
      <MainLayout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero */}
          <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-12 h-12 text-purple-300" />
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                    AI-Powered Features
                  </h1>
                </div>
                <p className="text-lg sm:text-xl text-purple-200 max-w-3xl mx-auto">
                  Explore LA neighborhoods with Claude AI assistance. Get smart
                  insights, personalized recommendations, and instant answers to
                  your safety questions.
                </p>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  <span className="text-sm font-medium">Powered by</span>
                  <span className="text-sm font-bold">Claude 3.5 Sonnet</span>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            {/* AI Smart Insights */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Insights
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                AI-generated insights about crime trends, safety comparisons, and
                actionable tips.
              </p>
              <AISmartInsights />
            </motion.section>

            {/* Neighborhood Selector */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Neighborhood Analysis
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Select a neighborhood to see AI-powered descriptions and safety
                analysis.
              </p>

              {/* Neighborhood Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Neighborhood
                </label>
                <select
                  value={selectedNeighborhood.name}
                  onChange={(e) => {
                    const neighborhood = laNeighborhoods.features.find(
                      (f) => f.properties.name === e.target.value
                    );
                    if (neighborhood) {
                      setSelectedNeighborhood(neighborhood.properties);
                    }
                  }}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  {laNeighborhoods.features.map((feature) => (
                    <option key={feature.properties.name} value={feature.properties.name}>
                      {feature.properties.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Two-column layout */}
              <div className="grid md:grid-cols-2 gap-6">
                <AINeighborhoodDescription neighborhood={selectedNeighborhood} />
                <AISafetyAnalysis neighborhood={selectedNeighborhood} />
              </div>
            </motion.section>

            {/* Chat Assistant Demo */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-8 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI Chat Assistant
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Click the "Ask AI" button in the bottom right corner to start a
                conversation with Claude. Ask questions like:
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  'Is Hollywood safe for tourists?',
                  'Best neighborhood for families under $2000/mo?',
                  'Compare Venice and Santa Monica for young professionals',
                  'Where has the lowest car theft in LA?',
                  'Which neighborhoods are improving?',
                ].map((question, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <span className="text-blue-600 flex-shrink-0">•</span>
                    <span>"{question}"</span>
                  </li>
                ))}
              </ul>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-300 dark:border-blue-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  The AI assistant has access to all neighborhood crime data and
                  can provide personalized recommendations based on your
                  preferences, budget, and lifestyle.
                </p>
              </div>
            </motion.section>

            {/* Features Overview */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  title="Real-time Analysis"
                  description="Claude analyzes crime data in real-time to provide contextual insights and personalized recommendations."
                  icon="📊"
                />
                <FeatureCard
                  title="Streaming Responses"
                  description="Chat responses stream in real-time for a natural, conversational experience."
                  icon="💬"
                />
                <FeatureCard
                  title="Cached Descriptions"
                  description="Neighborhood descriptions are cached to ensure fast loading and reduce API costs."
                  icon="⚡"
                />
                <FeatureCard
                  title="Rate Limited"
                  description="Built-in rate limiting protects against abuse while ensuring fair usage for all users."
                  icon="🔒"
                />
                <FeatureCard
                  title="Error Handling"
                  description="Graceful fallbacks ensure the app works even if AI features are temporarily unavailable."
                  icon="🛡️"
                />
                <FeatureCard
                  title="Production Ready"
                  description="TypeScript, error boundaries, and comprehensive testing make this production-ready."
                  icon="✅"
                />
              </div>
            </motion.section>
          </div>
        </div>

        {/* AI Chat Assistant */}
        <AIChatAssistant />
      </MainLayout>
    </ErrorBoundary>
  );
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
