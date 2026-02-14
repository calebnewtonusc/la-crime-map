'use client';

import { useState, useEffect } from 'react';
import { NeighborhoodData } from '@/lib/data/types';
import { Sparkles, Heart, AlertCircle, MapPin, Gem, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface NeighborhoodDescriptionProps {
  neighborhood: NeighborhoodData;
}

interface Description {
  vibe: string;
  safetyContext: string;
  bestFor: string[];
  avoidIf: string[];
  hiddenGems: string;
}

export function AINeighborhoodDescription({
  neighborhood,
}: NeighborhoodDescriptionProps) {
  const [description, setDescription] = useState<Description | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDescription();
  }, [neighborhood.name]);

  const loadDescription = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/neighborhood-description?name=${encodeURIComponent(
          neighborhood.name
        )}`
      );

      if (!response.ok) {
        throw new Error('Failed to load description');
      }

      const data = await response.json();
      setDescription(data.description);
    } catch (err) {
      console.error('Error loading description:', err);
      setError('Failed to load AI description');

      // Fallback description
      setDescription({
        vibe: `${neighborhood.name} is a diverse LA neighborhood with its own unique character.`,
        safetyContext: `Crime levels are at ${neighborhood.violentCrime}/10 for violent crime and ${neighborhood.carTheft}/10 for car theft. Like most urban areas, staying aware of your surroundings is important.`,
        bestFor: ['Urban dwellers', 'LA explorers', 'Those seeking diversity'],
        avoidIf: ['Looking for suburban feel', 'Need absolute lowest crime rates'],
        hiddenGems: `Explore ${neighborhood.name} to discover its local character and hidden spots.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Neighborhood Overview
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (error || !description) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            AI Neighborhood Overview
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
      className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          AI Neighborhood Overview
        </h3>
        <span className="ml-auto text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
          Claude AI
        </span>
      </div>

      {/* Vibe */}
      <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            The Vibe
          </h4>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
          "{description.vibe}"
        </p>
      </div>

      {/* Safety Context */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
          Safety Context
        </h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {description.safetyContext}
        </p>
      </div>

      {/* Best For */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 text-green-600" />
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            Best For
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {description.bestFor.map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full border border-green-300 dark:border-green-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Avoid If */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            Might Not Be Ideal If
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {description.avoidIf.map((item, idx) => (
            <span
              key={idx}
              className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Hidden Gems */}
      <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-300 dark:border-purple-700">
        <div className="flex items-center gap-2 mb-2">
          <Gem className="w-4 h-4 text-purple-600" />
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
            Hidden Gem
          </h4>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {description.hiddenGems}
        </p>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
        AI-generated description. Visit the neighborhood to form your own
        impression.
      </p>
    </motion.div>
  );
}
