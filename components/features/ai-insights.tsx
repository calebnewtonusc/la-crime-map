'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Info, Lightbulb, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SmartInsight } from '@/lib/ai/generate-insights';

export function AISmartInsights() {
  const [insights, setInsights] = useState<SmartInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/insights');

      if (!response.ok) {
        throw new Error('Failed to load insights');
      }

      const data = await response.json();
      setInsights(data.insights);
    } catch (err) {
      console.error('Error loading insights:', err);
      setError('Failed to load AI insights');

      // Use fallback insights
      setInsights([
        {
          title: 'Westside Safety Premium',
          description: 'Neighborhoods like Beverly Hills and Santa Monica consistently show lower crime rates, making them ideal for families prioritizing safety.',
          type: 'comparison',
          neighborhoods: ['Beverly Hills', 'Santa Monica', 'West LA'],
        },
        {
          title: 'Car Theft Awareness',
          description: 'Car theft rates vary significantly across LA. Always park in well-lit areas and use visible steering wheel locks as deterrents.',
          type: 'tip',
        },
        {
          title: 'Improving Areas',
          description: 'Several neighborhoods show improving crime trends, offering good value for those willing to be early adopters.',
          type: 'trend',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingDown className="w-5 h-5" />;
      case 'comparison':
        return <Info className="w-5 h-5" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getColor = (type: SmartInsight['type']) => {
    switch (type) {
      case 'trend':
        return 'from-green-500 to-emerald-600';
      case 'comparison':
        return 'from-blue-500 to-cyan-600';
      case 'alert':
        return 'from-amber-500 to-orange-600';
      case 'tip':
        return 'from-purple-500 to-pink-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            AI-Powered Insights
          </h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-6 h-6 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          AI-Powered Insights
        </h2>
        <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
          Claude AI
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Insights Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
          >
            {/* Icon & Title */}
            <div className="flex items-start gap-3 mb-2">
              <div
                className={`bg-gradient-to-br ${getColor(
                  insight.type
                )} text-white rounded-lg p-2 flex-shrink-0`}
              >
                {getIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {insight.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>

            {/* Neighborhoods */}
            {insight.neighborhoods && insight.neighborhoods.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {insight.neighborhoods.map((neighborhood, nIdx) => (
                  <span
                    key={nIdx}
                    className="text-xs bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full border border-gray-300 dark:border-gray-500"
                  >
                    {neighborhood}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadInsights}
        disabled={isLoading}
        className="mt-4 text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium disabled:opacity-50"
      >
        Refresh Insights
      </button>

      {/* Footer */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
        Insights are generated by AI and refreshed hourly. They should be used
        as one factor among many when making decisions.
      </p>
    </div>
  );
}
