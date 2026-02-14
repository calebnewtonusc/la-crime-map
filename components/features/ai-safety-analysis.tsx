'use client';

import { useState, useEffect } from 'react';
import { NeighborhoodData } from '@/lib/data/types';
import { Sparkles, TrendingDown, TrendingUp, AlertTriangle, Shield, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface SafetyAnalysisProps {
  neighborhood: NeighborhoodData;
}

interface AnalysisResult {
  overview: string;
  strengths: string[];
  concerns: string[];
  contextualInsights: string;
  safetyTips: string[];
  riskFactors: string[];
}

export function AISafetyAnalysis({ neighborhood }: SafetyAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateAnalysis();
  }, [neighborhood.name]);

  const generateAnalysis = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Analyze the safety of ${neighborhood.name} based on this data:

Violent Crime: ${neighborhood.violentCrime}/10
Car Theft: ${neighborhood.carTheft}/10
Break-ins: ${neighborhood.breakIns}/10
Petty Theft: ${neighborhood.pettyTheft}/10
Safety Score: ${neighborhood.safetyScore || 'N/A'}
Safety Percentile: ${neighborhood.overallSafetyPercentile}th percentile
Trend: ${neighborhood.trendIndicator}

Provide a detailed safety analysis in this JSON format:
{
  "overview": "2-3 sentence overview of the neighborhood's safety profile",
  "strengths": ["list", "of", "safety", "strengths"],
  "concerns": ["list", "of", "safety", "concerns"],
  "contextualInsights": "2-3 sentences providing nuanced context. For example, if violent crime is high, explain WHERE and WHEN it typically occurs (commercial vs residential, time of day, etc.)",
  "safetyTips": ["specific", "actionable", "tips", "for", "this", "area"],
  "riskFactors": ["specific", "risk", "factors", "to", "be", "aware", "of"]
}`,
            },
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate analysis');
      }

      const data = await response.json();

      // Parse JSON from response
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed: AnalysisResult = JSON.parse(jsonMatch[0]);
        setAnalysis(parsed);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error generating analysis:', err);
      setError('Failed to generate AI analysis. Please try again.');

      // Fallback analysis
      setAnalysis({
        overview: `${neighborhood.name} has a safety score of ${neighborhood.safetyScore || 'N/A'} and ranks in the ${neighborhood.overallSafetyPercentile}th percentile for overall safety.`,
        strengths: neighborhood.violentCrime < 5 ? ['Lower violent crime rates'] : [],
        concerns: neighborhood.carTheft > 8 ? ['Higher car theft rates'] : [],
        contextualInsights: `Like most urban areas, crime patterns vary by location and time. The ${neighborhood.trendIndicator} trend suggests recent changes in the area.`,
        safetyTips: [
          'Stay aware of your surroundings',
          'Park in well-lit areas',
          'Trust your instincts',
        ],
        riskFactors: ['Urban environment', 'Varying crime by location'],
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Safety Analysis
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Safety Analysis
          </h3>
        </div>
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          AI Safety Analysis
        </h3>
        <span className="ml-auto text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
          Claude AI
        </span>
      </div>

      {/* Overview */}
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {analysis.overview}
      </p>

      {/* Strengths */}
      {analysis.strengths.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              Safety Strengths
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.strengths.map((strength, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
              >
                <TrendingDown className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns */}
      {analysis.concerns.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              Areas of Concern
            </h4>
          </div>
          <ul className="space-y-1">
            {analysis.concerns.map((concern, idx) => (
              <li
                key={idx}
                className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
              >
                <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contextual Insights */}
      <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
          Context & Nuance
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {analysis.contextualInsights}
        </p>
      </div>

      {/* Safety Tips */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
          Safety Tips for {neighborhood.name}
        </h4>
        <ul className="space-y-1">
          {analysis.safetyTips.map((tip, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
            >
              <span className="text-blue-600 flex-shrink-0">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Factors */}
      {analysis.riskFactors.length > 0 && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
          <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100 mb-2">
            Risk Factors to Be Aware Of
          </h4>
          <ul className="space-y-1">
            {analysis.riskFactors.map((factor, idx) => (
              <li
                key={idx}
                className="text-sm text-amber-800 dark:text-amber-200 flex items-start gap-2"
              >
                <span className="flex-shrink-0">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
        AI-generated analysis based on crime statistics. Always visit
        neighborhoods in person and trust your own judgment.
      </p>
    </motion.div>
  );
}
