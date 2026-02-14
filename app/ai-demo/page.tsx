'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import {
  AIChatAssistant,
  AISmartInsights,
  AISafetyAnalysis,
  AINeighborhoodDescription,
} from '@/components/features';
import { laNeighborhoods } from '@/lib/data/neighborhoods';
import { Brain, MessageSquare, TrendingUp, Shield } from 'lucide-react';

export default function AIDemoPage() {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(
    laNeighborhoods.features[0].properties
  );

  return (
    <ErrorBoundary>
      <MainLayout>
        <div className="min-h-screen bg-white dark:bg-night-sky-darker">
          {/* Hero */}
          <section className="relative bg-gradient-to-br from-night-sky-dark via-night-sky-darker to-black py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-white">
                AI-Powered Safety Intelligence
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get instant answers, smart insights, and personalized recommendations powered by Claude AI
              </p>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
            {/* AI Smart Insights */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-sunset-orange to-sunset-pink rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Smart Insights
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    AI-generated crime trends and safety comparisons
                  </p>
                </div>
              </div>
              <AISmartInsights />
            </section>

            {/* Neighborhood Analysis */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-sunset-orange to-sunset-pink rounded-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Neighborhood Intelligence
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Deep analysis of any LA neighborhood
                  </p>
                </div>
              </div>

              {/* Neighborhood Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose a neighborhood to analyze
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
                  className="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sunset-orange bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base"
                >
                  {laNeighborhoods.features.map((feature) => (
                    <option key={feature.properties.name} value={feature.properties.name}>
                      {feature.properties.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analysis Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                <AINeighborhoodDescription neighborhood={selectedNeighborhood} />
                <AISafetyAnalysis neighborhood={selectedNeighborhood} />
              </div>
            </section>

            {/* Chat Assistant CTA */}
            <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-200 dark:border-gray-700">
              <div className="max-w-3xl mx-auto text-center space-y-6">
                <div className="inline-flex p-3 bg-gradient-to-br from-sunset-orange to-sunset-pink rounded-xl">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Ask Claude Anything
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Click the chat button in the bottom right to ask questions about LA neighborhoods, safety, and crime data
                </p>
                <div className="grid sm:grid-cols-2 gap-4 text-left">
                  {[
                    'Is Hollywood safe for tourists?',
                    'Best neighborhoods for families?',
                    'Compare Venice and Santa Monica',
                    'Where has the lowest car theft?',
                  ].map((question, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <span className="text-sunset-orange font-bold">Q:</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {question}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                AI-Powered Features
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  title="Real-Time Analysis"
                  description="Instant insights from 114 LA neighborhoods and thousands of crime incidents"
                />
                <FeatureCard
                  title="Personalized Advice"
                  description="Get recommendations tailored to your budget, lifestyle, and safety priorities"
                />
                <FeatureCard
                  title="Always Learning"
                  description="Powered by Claude 3.5 Sonnet with continuous updates and improvements"
                />
              </div>
            </section>
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
}

function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-sunset-orange dark:hover:border-sunset-orange transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
