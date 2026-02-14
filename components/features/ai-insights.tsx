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
      <div className="bg-white dark:bg-dark-bg-secondary rounded-card p-lg shadow-card border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-sm mb-md">
          <div className="p-sm bg-gradient-to-br from-la-sunset-purple/10 to-la-sunset-pink/10 dark:from-la-sunset-purple/20 dark:to-la-sunset-pink/20 rounded-button">
            <Sparkles className="w-6 h-6 text-la-sunset-purple" />
          </div>
          <h2 className="text-heading-lg font-bold text-gray-900 dark:text-white">
            AI-Powered Insights
          </h2>
        </div>
        <div className="flex items-center justify-center py-4xl">
          <Loader2 className="w-8 h-8 animate-spin text-la-sunset-purple" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-bg-secondary rounded-card p-lg shadow-card border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center gap-sm mb-lg">
        <div className="p-sm bg-gradient-to-br from-la-sunset-purple/10 to-la-sunset-pink/10 dark:from-la-sunset-purple/20 dark:to-la-sunset-pink/20 rounded-button">
          <Sparkles className="w-6 h-6 text-la-sunset-purple" />
        </div>
        <h2 className="text-heading-lg font-bold text-gray-900 dark:text-white">
          AI-Powered Insights
        </h2>
        <span className="ml-auto text-caption bg-la-sunset-purple text-white px-sm py-xxs rounded-badge font-semibold">
          Claude AI
        </span>
      </div>

      {error && (
        <div className="mb-md p-md bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-button text-body-sm border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {/* Insights Grid */}
      <div className="grid gap-md md:grid-cols-2">
        {insights.map((insight, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-800 rounded-button p-md border border-gray-200 dark:border-gray-700 hover:shadow-card-hover transition-all duration-200"
          >
            {/* Icon & Title */}
            <div className="flex items-start gap-sm mb-sm">
              <div
                className={`bg-gradient-to-br ${getColor(
                  insight.type
                )} text-white rounded-button p-sm flex-shrink-0 shadow-lg`}
              >
                {getIcon(insight.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-heading-sm font-bold text-gray-900 dark:text-gray-100 mb-xs">
                  {insight.title}
                </h3>
                <p className="text-body-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            </div>

            {/* Neighborhoods */}
            {insight.neighborhoods && insight.neighborhoods.length > 0 && (
              <div className="mt-sm flex flex-wrap gap-xs">
                {insight.neighborhoods.map((neighborhood, nIdx) => (
                  <span
                    key={nIdx}
                    className="text-caption bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-sm py-xxs rounded-badge border border-gray-300 dark:border-gray-600 font-medium"
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
        className="mt-md text-body-sm text-la-sunset-purple hover:text-la-sunset-pink dark:text-la-sunset-pink dark:hover:text-la-sunset-orange font-semibold disabled:opacity-50 transition-colors duration-200"
      >
        Refresh Insights
      </button>

      {/* Footer */}
      <p className="text-body-xs text-gray-500 dark:text-gray-400 mt-md italic leading-relaxed">
        Insights are generated by AI and refreshed hourly. They should be used
        as one factor among many when making decisions.
      </p>
    </div>
  );
}
