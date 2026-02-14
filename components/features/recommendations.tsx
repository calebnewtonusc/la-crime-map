'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  DollarSign,
  Shield,
  Heart,
  Coffee,
  GraduationCap,
  Bus,
  TrendingDown,
  TrendingUp,
  MapPin,
  Star,
  Share2,
  Save,
  Shuffle,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Users,
  Briefcase,
  Baby,
  Sun,
  Map
} from 'lucide-react'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData } from '@/lib/data/types'

// Types
type Priority = 'safety' | 'nightlife' | 'schools' | 'transit'
type Lifestyle = 'family' | 'student' | 'professional' | 'retiree'

interface UserPreferences {
  budget: number
  priorities: Priority[]
  lifestyle: Lifestyle | null
  commuteLocation: { lat: number; lng: number } | null
}

interface NeighborhoodWithScore extends NeighborhoodData {
  score: number
  reasons: string[]
  pros: string[]
  cons: string[]
  similarTo: string[]
  rent: number
  walkScore: number
  transitScore: number
  schoolRating: number
  nightlifeRating: number
}

interface SavedRecommendation {
  id: string
  neighborhood: NeighborhoodWithScore
  savedAt: Date
}

// Enhanced neighborhood data with placeholder amenity scores
const NEIGHBORHOOD_AMENITIES: Record<string, {
  rent: number
  walkScore: number
  transitScore: number
  schoolRating: number
  nightlifeRating: number
}> = {
  'Downtown LA': { rent: 2800, walkScore: 95, transitScore: 90, schoolRating: 6, nightlifeRating: 9 },
  'Koreatown': { rent: 2200, walkScore: 90, transitScore: 85, schoolRating: 7, nightlifeRating: 8 },
  'Echo Park': { rent: 2400, walkScore: 85, transitScore: 80, schoolRating: 7, nightlifeRating: 7 },
  'Silver Lake': { rent: 2600, walkScore: 88, transitScore: 75, schoolRating: 8, nightlifeRating: 7 },
  'Los Feliz': { rent: 2700, walkScore: 85, transitScore: 70, schoolRating: 8, nightlifeRating: 6 },
  'Hollywood': { rent: 2500, walkScore: 92, transitScore: 88, schoolRating: 6, nightlifeRating: 9 },
  'West Hollywood': { rent: 2900, walkScore: 93, transitScore: 85, schoolRating: 7, nightlifeRating: 9 },
  'Santa Monica': { rent: 3500, walkScore: 90, transitScore: 80, schoolRating: 9, nightlifeRating: 8 },
  'Venice': { rent: 3200, walkScore: 88, transitScore: 75, schoolRating: 8, nightlifeRating: 8 },
  'Marina del Rey': { rent: 3400, walkScore: 75, transitScore: 70, schoolRating: 8, nightlifeRating: 6 },
  'West LA': { rent: 2800, walkScore: 80, transitScore: 75, schoolRating: 9, nightlifeRating: 5 },
  'Beverly Hills': { rent: 4500, walkScore: 85, transitScore: 65, schoolRating: 10, nightlifeRating: 7 },
  'Bel Air': { rent: 5000, walkScore: 60, transitScore: 50, schoolRating: 10, nightlifeRating: 3 },
  'Brentwood': { rent: 3800, walkScore: 70, transitScore: 60, schoolRating: 9, nightlifeRating: 4 },
  'Culver City': { rent: 2600, walkScore: 85, transitScore: 80, schoolRating: 8, nightlifeRating: 7 },
  'Palms': { rent: 2300, walkScore: 78, transitScore: 78, schoolRating: 7, nightlifeRating: 6 },
  'Van Nuys': { rent: 1800, walkScore: 70, transitScore: 75, schoolRating: 6, nightlifeRating: 5 },
  'North Hollywood': { rent: 1900, walkScore: 75, transitScore: 80, schoolRating: 6, nightlifeRating: 6 },
  'Sherman Oaks': { rent: 2400, walkScore: 75, transitScore: 70, schoolRating: 8, nightlifeRating: 5 },
  'Studio City': { rent: 2600, walkScore: 78, transitScore: 72, schoolRating: 9, nightlifeRating: 6 },
  'Encino': { rent: 2800, walkScore: 65, transitScore: 65, schoolRating: 9, nightlifeRating: 4 },
  'Burbank': { rent: 2200, walkScore: 80, transitScore: 78, schoolRating: 8, nightlifeRating: 6 },
  'Glendale': { rent: 2100, walkScore: 78, transitScore: 75, schoolRating: 8, nightlifeRating: 6 },
  'Inglewood': { rent: 1700, walkScore: 72, transitScore: 78, schoolRating: 5, nightlifeRating: 5 },
  'Compton': { rent: 1400, walkScore: 65, transitScore: 70, schoolRating: 4, nightlifeRating: 4 },
  'South LA': { rent: 1500, walkScore: 68, transitScore: 75, schoolRating: 5, nightlifeRating: 4 },
  'Watts': { rent: 1300, walkScore: 62, transitScore: 72, schoolRating: 4, nightlifeRating: 3 },
  'Pasadena': { rent: 2300, walkScore: 82, transitScore: 75, schoolRating: 9, nightlifeRating: 7 },
  'Alhambra': { rent: 2000, walkScore: 78, transitScore: 75, schoolRating: 8, nightlifeRating: 6 },
  'East LA': { rent: 1600, walkScore: 70, transitScore: 78, schoolRating: 5, nightlifeRating: 5 },
  'El Monte': { rent: 1500, walkScore: 68, transitScore: 72, schoolRating: 6, nightlifeRating: 4 },
  'Long Beach': { rent: 2000, walkScore: 80, transitScore: 78, schoolRating: 7, nightlifeRating: 7 },
  'Torrance': { rent: 2400, walkScore: 70, transitScore: 68, schoolRating: 9, nightlifeRating: 5 },
  'Redondo Beach': { rent: 2800, walkScore: 75, transitScore: 65, schoolRating: 9, nightlifeRating: 6 },
  'Manhattan Beach': { rent: 3800, walkScore: 78, transitScore: 60, schoolRating: 10, nightlifeRating: 7 },
  'El Segundo': { rent: 2500, walkScore: 72, transitScore: 70, schoolRating: 8, nightlifeRating: 5 },
}

export function SmartRecommendationsEngine() {
  const [step, setStep] = useState<'wizard' | 'results' | 'discover'>('wizard')
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 2500,
    priorities: ['safety'],
    lifestyle: null,
    commuteLocation: null
  })
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodWithScore | null>(null)

  // Calculate safety score (0-100)
  const calculateSafetyScore = (neighborhood: NeighborhoodData): number => {
    const totalCrime = neighborhood.violentCrime + neighborhood.carTheft +
                       neighborhood.breakIns + neighborhood.pettyTheft
    // Lower crime = higher score. Scale inversely with max crime ~80
    return Math.max(0, Math.min(100, 100 - (totalCrime * 1.5)))
  }

  // Calculate similarity between neighborhoods
  const calculateSimilarity = (n1: NeighborhoodData, n2: NeighborhoodData): number => {
    const a1 = NEIGHBORHOOD_AMENITIES[n1.name] || { rent: 2000, walkScore: 70, transitScore: 70, schoolRating: 6, nightlifeRating: 5 }
    const a2 = NEIGHBORHOOD_AMENITIES[n2.name] || { rent: 2000, walkScore: 70, transitScore: 70, schoolRating: 6, nightlifeRating: 5 }

    const rentDiff = Math.abs(a1.rent - a2.rent) / 5000
    const walkDiff = Math.abs(a1.walkScore - a2.walkScore) / 100
    const transitDiff = Math.abs(a1.transitScore - a2.transitScore) / 100
    const crimeDiff = Math.abs(
      (n1.violentCrime + n1.carTheft + n1.breakIns + n1.pettyTheft) -
      (n2.violentCrime + n2.carTheft + n2.breakIns + n2.pettyTheft)
    ) / 80

    return 100 - ((rentDiff + walkDiff + transitDiff + crimeDiff) * 25)
  }

  // Smart recommendation algorithm
  const getRecommendations = useMemo((): NeighborhoodWithScore[] => {
    const scoredNeighborhoods = laNeighborhoods.features.map(feature => {
      const neighborhood = feature.properties
      const amenities = NEIGHBORHOOD_AMENITIES[neighborhood.name] || {
        rent: 2000,
        walkScore: 70,
        transitScore: 70,
        schoolRating: 6,
        nightlifeRating: 5
      }

      let score = 0
      const reasons: string[] = []
      const pros: string[] = []
      const cons: string[] = []

      // Safety score (40% weight - most important)
      const safetyScore = calculateSafetyScore(neighborhood)
      score += safetyScore * 0.4
      if (safetyScore >= 80) {
        reasons.push('Excellent safety record')
        pros.push(`Safety score: ${Math.round(safetyScore)}/100`)
      } else if (safetyScore >= 60) {
        pros.push(`Good safety (${Math.round(safetyScore)}/100)`)
      } else {
        cons.push('Below average safety rating')
      }

      // Budget match (20% weight)
      const budgetDiff = Math.abs(amenities.rent - preferences.budget)
      const budgetScore = Math.max(0, 100 - (budgetDiff / preferences.budget) * 100)
      score += budgetScore * 0.2
      if (amenities.rent <= preferences.budget * 0.9) {
        reasons.push('Great value for your budget')
        pros.push(`Rent: $${amenities.rent}/mo (under budget)`)
      } else if (amenities.rent <= preferences.budget) {
        pros.push(`Rent: $${amenities.rent}/mo (in budget)`)
      } else {
        cons.push(`Rent: $${amenities.rent}/mo (over budget)`)
      }

      // Priorities (30% weight total)
      const priorityWeight = 30 / Math.max(preferences.priorities.length, 1)
      preferences.priorities.forEach(priority => {
        switch (priority) {
          case 'safety':
            score += safetyScore * (priorityWeight / 100)
            break
          case 'transit':
            score += amenities.transitScore * (priorityWeight / 100)
            if (amenities.transitScore >= 80) {
              reasons.push('Excellent public transit access')
              pros.push(`Transit score: ${amenities.transitScore}/100`)
            }
            break
          case 'schools':
            score += amenities.schoolRating * 10 * (priorityWeight / 100)
            if (amenities.schoolRating >= 8) {
              reasons.push('Top-rated schools nearby')
              pros.push(`School rating: ${amenities.schoolRating}/10`)
            }
            break
          case 'nightlife':
            score += amenities.nightlifeRating * 10 * (priorityWeight / 100)
            if (amenities.nightlifeRating >= 7) {
              reasons.push('Vibrant nightlife scene')
              pros.push(`Nightlife rating: ${amenities.nightlifeRating}/10`)
            }
            break
        }
      })

      // Lifestyle match (10% weight)
      if (preferences.lifestyle) {
        let lifestyleScore = 0
        switch (preferences.lifestyle) {
          case 'family':
            lifestyleScore = (amenities.schoolRating * 10 + safetyScore) / 2
            if (amenities.schoolRating >= 8 && safetyScore >= 70) {
              reasons.push('Ideal for families')
            }
            if (amenities.nightlifeRating > 7) {
              cons.push('May be too lively for families')
            }
            break
          case 'student':
            lifestyleScore = (amenities.transitScore + amenities.nightlifeRating * 10 +
                            (100 - (amenities.rent / 50))) / 3
            if (amenities.rent < 2000) {
              reasons.push('Affordable for students')
            }
            if (amenities.nightlifeRating >= 7) {
              pros.push('Great social scene')
            }
            break
          case 'professional':
            lifestyleScore = (amenities.walkScore + amenities.transitScore +
                            amenities.nightlifeRating * 10) / 3
            if (amenities.walkScore >= 80 && amenities.transitScore >= 75) {
              reasons.push('Perfect for young professionals')
            }
            break
          case 'retiree':
            lifestyleScore = (safetyScore + (10 - amenities.nightlifeRating) * 10 +
                            amenities.walkScore) / 3
            if (safetyScore >= 80 && amenities.nightlifeRating <= 5) {
              reasons.push('Peaceful and safe for retirees')
            }
            break
        }
        score += lifestyleScore * 0.1
      }

      // Add walkability pros/cons
      if (amenities.walkScore >= 85) {
        pros.push(`Very walkable (${amenities.walkScore}/100)`)
      } else if (amenities.walkScore < 70) {
        cons.push('Limited walkability')
      }

      // Crime trend analysis
      if (neighborhood.trendIndicator === 'improving') {
        reasons.push('Crime rates improving')
        pros.push('Safety trending up')
        score += 5
      } else if (neighborhood.trendIndicator === 'worsening') {
        cons.push('Crime rates increasing')
        score -= 5
      }

      // Find similar neighborhoods
      const similarTo = laNeighborhoods.features
        .filter(f => f.properties.name !== neighborhood.name)
        .map(f => ({
          name: f.properties.name,
          similarity: calculateSimilarity(neighborhood, f.properties)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(n => n.name)

      return {
        ...neighborhood,
        ...amenities,
        score: Math.min(100, Math.max(0, score)),
        reasons: reasons.slice(0, 3),
        pros: pros.slice(0, 5),
        cons: cons.slice(0, 3),
        similarTo
      }
    })

    return scoredNeighborhoods
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [preferences])

  // Quick filter functions
  const getSafestNeighborhoods = (): NeighborhoodWithScore[] => {
    return getRecommendations.slice().sort((a, b) =>
      calculateSafetyScore(b) - calculateSafetyScore(a)
    ).slice(0, 5)
  }

  const getBestValue = (): NeighborhoodWithScore[] => {
    return getRecommendations.filter(n =>
      calculateSafetyScore(n) >= 70 && n.rent <= 2500
    ).sort((a, b) => {
      const scoreA = calculateSafetyScore(a) / (a.rent / 1000)
      const scoreB = calculateSafetyScore(b) / (b.rent / 1000)
      return scoreB - scoreA
    }).slice(0, 5)
  }

  const getImprovingAreas = (): NeighborhoodWithScore[] => {
    return getRecommendations.filter(n =>
      n.trendIndicator === 'improving'
    ).slice(0, 5)
  }

  const getFamilyFriendly = (): NeighborhoodWithScore[] => {
    return getRecommendations.filter(n =>
      n.schoolRating >= 8 && calculateSafetyScore(n) >= 70
    ).sort((a, b) => b.schoolRating - a.schoolRating).slice(0, 5)
  }

  const getStudentAreas = (): NeighborhoodWithScore[] => {
    return getRecommendations.filter(n =>
      n.rent <= 2200 && n.transitScore >= 75
    ).sort((a, b) => (b.transitScore + b.nightlifeRating * 10) -
                     (a.transitScore + a.nightlifeRating * 10)).slice(0, 5)
  }

  const getRandomSafeNeighborhood = (): NeighborhoodWithScore => {
    const safe = getRecommendations.filter(n => calculateSafetyScore(n) >= 70)
    return safe[Math.floor(Math.random() * safe.length)] || getRecommendations[0]
  }

  // Save/share handlers
  const saveRecommendation = (neighborhood: NeighborhoodWithScore) => {
    const newSave: SavedRecommendation = {
      id: `${neighborhood.name}-${Date.now()}`,
      neighborhood,
      savedAt: new Date()
    }
    setSavedRecommendations(prev => [...prev, newSave])
  }

  const shareRecommendations = () => {
    const top5 = getRecommendations.slice(0, 5)
    const text = `My top LA neighborhoods:\n${top5.map((n, i) =>
      `${i + 1}. ${n.name} (Score: ${Math.round(n.score)}/100)`
    ).join('\n')}\n\nGenerated by LA Crime Map`

    if (navigator.share) {
      navigator.share({
        title: 'My LA Neighborhood Recommendations',
        text
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AnimatePresence mode="wait">
        {step === 'wizard' && (
          <WizardView
            preferences={preferences}
            setPreferences={setPreferences}
            onComplete={() => setStep('results')}
            onQuickFilter={(filter) => {
              let results: NeighborhoodWithScore[] = []
              switch (filter) {
                case 'safest': results = getSafestNeighborhoods(); break
                case 'value': results = getBestValue(); break
                case 'improving': results = getImprovingAreas(); break
                case 'family': results = getFamilyFriendly(); break
                case 'student': results = getStudentAreas(); break
              }
              if (results.length > 0) {
                setStep('results')
              }
            }}
            onDiscover={() => {
              const random = getRandomSafeNeighborhood()
              setSelectedNeighborhood(random)
              setStep('discover')
            }}
          />
        )}

        {step === 'results' && (
          <ResultsView
            recommendations={getRecommendations.slice(0, 5)}
            onBack={() => setStep('wizard')}
            onSave={saveRecommendation}
            onShare={shareRecommendations}
            onSelectNeighborhood={setSelectedNeighborhood}
            selectedNeighborhood={selectedNeighborhood}
          />
        )}

        {step === 'discover' && selectedNeighborhood && (
          <DiscoverView
            neighborhood={selectedNeighborhood}
            onBack={() => setStep('wizard')}
            onShuffle={() => {
              const random = getRandomSafeNeighborhood()
              setSelectedNeighborhood(random)
            }}
            onSave={saveRecommendation}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Wizard View Component
interface WizardViewProps {
  preferences: UserPreferences
  setPreferences: (prefs: UserPreferences) => void
  onComplete: () => void
  onQuickFilter: (filter: 'safest' | 'value' | 'improving' | 'family' | 'student') => void
  onDiscover: () => void
}

function WizardView({ preferences, setPreferences, onComplete, onQuickFilter, onDiscover }: WizardViewProps) {
  const togglePriority = (priority: Priority) => {
    setPreferences({
      ...preferences,
      priorities: preferences.priorities.includes(priority)
        ? preferences.priorities.filter(p => p !== priority)
        : [...preferences.priorities, priority]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          <Sparkles className="w-12 h-12 text-neon-cyan mx-auto mb-2" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
          Find Your Perfect Neighborhood
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Answer a few questions and we'll recommend the best LA neighborhoods for your lifestyle
        </p>
      </div>

      {/* Quick Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Filters
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickFilterButton
            icon={Shield}
            label="Safest Overall"
            onClick={() => onQuickFilter('safest')}
          />
          <QuickFilterButton
            icon={DollarSign}
            label="Best Value"
            onClick={() => onQuickFilter('value')}
          />
          <QuickFilterButton
            icon={TrendingDown}
            label="Improving Areas"
            onClick={() => onQuickFilter('improving')}
          />
          <QuickFilterButton
            icon={Baby}
            label="Family-Friendly"
            onClick={() => onQuickFilter('family')}
          />
          <QuickFilterButton
            icon={GraduationCap}
            label="Student Areas"
            onClick={() => onQuickFilter('student')}
          />
          <QuickFilterButton
            icon={Shuffle}
            label="Discover Random"
            onClick={onDiscover}
            variant="special"
          />
        </div>
      </motion.div>

      {/* Wizard Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 space-y-8"
      >
        {/* Budget Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Monthly Budget
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={preferences.budget}
              onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>$1,000</span>
              <span className="text-2xl font-bold text-neon-cyan">${preferences.budget.toLocaleString()}</span>
              <span>$5,000</span>
            </div>
          </div>
        </div>

        {/* Priorities */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <Star className="w-4 h-4 inline mr-2" />
            Priorities (select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <PriorityButton
              icon={Shield}
              label="Safety"
              selected={preferences.priorities.includes('safety')}
              onClick={() => togglePriority('safety')}
            />
            <PriorityButton
              icon={Coffee}
              label="Nightlife"
              selected={preferences.priorities.includes('nightlife')}
              onClick={() => togglePriority('nightlife')}
            />
            <PriorityButton
              icon={GraduationCap}
              label="Schools"
              selected={preferences.priorities.includes('schools')}
              onClick={() => togglePriority('schools')}
            />
            <PriorityButton
              icon={Bus}
              label="Transit"
              selected={preferences.priorities.includes('transit')}
              onClick={() => togglePriority('transit')}
            />
          </div>
        </div>

        {/* Lifestyle */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
            <Users className="w-4 h-4 inline mr-2" />
            Lifestyle
          </label>
          <div className="grid grid-cols-2 gap-3">
            <LifestyleButton
              icon={Baby}
              label="Family"
              selected={preferences.lifestyle === 'family'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'family' })}
            />
            <LifestyleButton
              icon={GraduationCap}
              label="Student"
              selected={preferences.lifestyle === 'student'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'student' })}
            />
            <LifestyleButton
              icon={Briefcase}
              label="Professional"
              selected={preferences.lifestyle === 'professional'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'professional' })}
            />
            <LifestyleButton
              icon={Sun}
              label="Retiree"
              selected={preferences.lifestyle === 'retiree'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'retiree' })}
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Get Recommendations
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Results View Component
interface ResultsViewProps {
  recommendations: NeighborhoodWithScore[]
  onBack: () => void
  onSave: (neighborhood: NeighborhoodWithScore) => void
  onShare: () => void
  onSelectNeighborhood: (neighborhood: NeighborhoodWithScore) => void
  selectedNeighborhood: NeighborhoodWithScore | null
}

function ResultsView({
  recommendations,
  onBack,
  onSave,
  onShare,
  onSelectNeighborhood,
  selectedNeighborhood
}: ResultsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Top 5 Neighborhoods
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Based on your preferences and priorities
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back
          </motion.button>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((neighborhood, index) => (
          <NeighborhoodCard
            key={neighborhood.name}
            neighborhood={neighborhood}
            rank={index + 1}
            onSave={() => onSave(neighborhood)}
            onClick={() => onSelectNeighborhood(neighborhood)}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Map View Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-5 h-5 text-neon-cyan" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Map View
          </h3>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl h-64 flex items-center justify-center border-2 border-dashed border-blue-300 dark:border-blue-700">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400">
              Interactive map view coming soon
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Discover View Component
interface DiscoverViewProps {
  neighborhood: NeighborhoodWithScore
  onBack: () => void
  onShuffle: () => void
  onSave: (neighborhood: NeighborhoodWithScore) => void
}

function DiscoverView({ neighborhood, onBack, onShuffle, onSave }: DiscoverViewProps) {
  const safetyScore = Math.max(0, Math.min(100, 100 - (
    (neighborhood.violentCrime + neighborhood.carTheft +
     neighborhood.breakIns + neighborhood.pettyTheft) * 1.5
  )))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-neon-cyan to-neon-purple p-8 text-white text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-4xl font-bold mb-2">{neighborhood.name}</h2>
          <p className="text-blue-100 text-lg">
            Discover this hidden gem in LA
          </p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Safety Score - Prominent */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-800 dark:text-green-400 mb-1">
                  SAFETY SCORE
                </p>
                <p className="text-5xl font-bold text-green-600 dark:text-green-500">
                  {Math.round(safetyScore)}
                  <span className="text-2xl text-gray-600 dark:text-gray-400">/100</span>
                </p>
              </div>
              <Shield className="w-16 h-16 text-green-600 dark:text-green-500 opacity-50" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatBadge icon={DollarSign} label="Rent" value={`$${neighborhood.rent}/mo`} />
            <StatBadge icon={Home} label="Walk Score" value={`${neighborhood.walkScore}/100`} />
            <StatBadge icon={Bus} label="Transit" value={`${neighborhood.transitScore}/100`} />
            <StatBadge icon={GraduationCap} label="Schools" value={`${neighborhood.schoolRating}/10`} />
          </div>

          {/* Pros & Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-2">
                <Check className="w-4 h-4" /> Pros
              </h4>
              <ul className="space-y-1">
                {neighborhood.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <X className="w-4 h-4" /> Cons
              </h4>
              <ul className="space-y-1">
                {neighborhood.cons.length > 0 ? neighborhood.cons.map((con, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                    <X className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    {con}
                  </li>
                )) : (
                  <li className="text-sm text-gray-500 dark:text-gray-400">No major drawbacks</li>
                )}
              </ul>
            </div>
          </div>

          {/* Similar Neighborhoods */}
          {neighborhood.similarTo.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                Similar to:
              </h4>
              <div className="flex flex-wrap gap-2">
                {neighborhood.similarTo.map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 bg-white dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSave(neighborhood)}
              className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />
              Save
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onShuffle}
              className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <Shuffle className="w-5 h-5" />
              Discover Another
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Wizard
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

// Helper Components
function QuickFilterButton({
  icon: Icon,
  label,
  onClick,
  variant = 'default'
}: {
  icon: any
  label: string
  onClick: () => void
  variant?: 'default' | 'special'
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-all ${
        variant === 'special'
          ? 'bg-gradient-to-r from-neon-cyan to-neon-purple text-white border-transparent'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
      }`}
    >
      <Icon className={`w-5 h-5 mb-2 ${
        variant === 'special' ? 'text-white' : 'text-blue-600 dark:text-blue-400'
      }`} />
      <p className={`text-sm font-semibold ${
        variant === 'special' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        {label}
      </p>
    </motion.button>
  )
}

function PriorityButton({
  icon: Icon,
  label,
  selected,
  onClick
}: {
  icon: any
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <Icon className={`w-6 h-6 mb-2 ${
        selected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
      }`} />
      <p className={`text-sm font-semibold ${
        selected ? 'text-blue-900 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {label}
      </p>
      {selected && (
        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 absolute top-2 right-2" />
      )}
    </motion.button>
  )
}

function LifestyleButton({
  icon: Icon,
  label,
  selected,
  onClick
}: {
  icon: any
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-4 rounded-xl border-2 transition-all ${
        selected
          ? 'bg-purple-50 dark:bg-purple-950/30 border-purple-500 dark:border-purple-600'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <Icon className={`w-6 h-6 mb-2 ${
        selected ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
      }`} />
      <p className={`text-sm font-semibold ${
        selected ? 'text-purple-900 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {label}
      </p>
    </motion.button>
  )
}

function NeighborhoodCard({
  neighborhood,
  rank,
  onSave,
  onClick,
  delay
}: {
  neighborhood: NeighborhoodWithScore
  rank: number
  onSave: () => void
  onClick: () => void
  delay: number
}) {
  const safetyScore = Math.max(0, Math.min(100, 100 - (
    (neighborhood.violentCrime + neighborhood.carTheft +
     neighborhood.breakIns + neighborhood.pettyTheft) * 1.5
  )))

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-neon-cyan to-neon-purple text-white font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center">
            {rank}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {neighborhood.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Match Score: {Math.round(neighborhood.score)}/100
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <Save className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </motion.button>
      </div>

      {/* Safety Score Badge */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-xl p-4 mb-4 border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600 dark:text-green-500" />
            <div>
              <p className="text-xs font-semibold text-green-800 dark:text-green-400">
                SAFETY SCORE
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                {Math.round(safetyScore)}/100
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-600 dark:text-gray-400">Monthly Rent</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              ${neighborhood.rent}
            </p>
          </div>
        </div>
      </div>

      {/* Reasons */}
      {neighborhood.reasons.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Why this neighborhood:
          </h4>
          <div className="space-y-1">
            {neighborhood.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-neon-cyan flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 dark:text-gray-400">{reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Home className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{neighborhood.walkScore}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Bus className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{neighborhood.transitScore}</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <GraduationCap className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{neighborhood.schoolRating}/10</p>
        </div>
        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <Coffee className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-auto mb-1" />
          <p className="text-xs text-gray-600 dark:text-gray-400">{neighborhood.nightlifeRating}/10</p>
        </div>
      </div>

      {/* Similar To */}
      {neighborhood.similarTo.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Similar to:</p>
          <div className="flex flex-wrap gap-1">
            {neighborhood.similarTo.map((name) => (
              <span
                key={name}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-700 dark:text-gray-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

function StatBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      </div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  )
}
