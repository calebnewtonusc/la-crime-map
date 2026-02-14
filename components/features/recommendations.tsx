'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Map,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Calendar,
  Bookmark,
  AlertCircle,
  CheckCircle2,
  Info,
  Zap,
  TrendingDown as ChartDown,
  BarChart3,
  SlidersHorizontal
} from 'lucide-react'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData } from '@/lib/data/types'

// Types
type Priority = 'safety' | 'nightlife' | 'schools' | 'transit' | 'walkability' | 'affordability'
type Lifestyle = 'family' | 'student' | 'professional' | 'retiree' | 'creative' | 'entrepreneur'
type SortOption = 'score' | 'safety' | 'price-low' | 'price-high' | 'walkability' | 'transit'

interface UserPreferences {
  budget: number
  maxBudget: number
  priorities: Priority[]
  lifestyle: Lifestyle | null
  commuteLocation: { lat: number; lng: number } | null
  mustHaves: string[]
  dealBreakers: string[]
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
  affordabilityScore: number
  personalizedScore: number
  matchPercentage: number
  character: string
  bestFor: string[]
  notIdealFor: string[]
  costOfLiving: {
    rent: number
    groceries: number
    dining: number
    utilities: number
    total: number
  }
}

interface SavedRecommendation {
  id: string
  neighborhood: NeighborhoodWithScore
  savedAt: Date
}

// Enhanced neighborhood data with comprehensive amenity scores
const NEIGHBORHOOD_AMENITIES: Record<string, {
  rent: number
  walkScore: number
  transitScore: number
  schoolRating: number
  nightlifeRating: number
  groceryCost: number
  diningCost: number
  utilitiesCost: number
  character: string
  bestFor: string[]
  notIdealFor: string[]
}> = {
  'Downtown LA': {
    rent: 2800, walkScore: 95, transitScore: 90, schoolRating: 6, nightlifeRating: 9,
    groceryCost: 450, diningCost: 500, utilitiesCost: 150,
    character: 'Urban energy meets LA culture - buzzing streets, arts district, endless dining',
    bestFor: ['Young professionals', 'Nightlife lovers', 'Public transit users'],
    notIdealFor: ['Families with young children', 'Those seeking quiet']
  },
  'Koreatown': {
    rent: 2200, walkScore: 90, transitScore: 85, schoolRating: 7, nightlifeRating: 8,
    groceryCost: 380, diningCost: 350, utilitiesCost: 140,
    character: 'Vibrant Korean culture, 24/7 dining, incredible food scene, great value',
    bestFor: ['Foodies', 'Budget-conscious', 'Night owls', 'Cultural diversity'],
    notIdealFor: ['Those needing parking', 'Early risers seeking quiet']
  },
  'Echo Park': {
    rent: 2400, walkScore: 85, transitScore: 80, schoolRating: 7, nightlifeRating: 7,
    groceryCost: 400, diningCost: 380, utilitiesCost: 145,
    character: 'Hipster haven with lake views, indie culture, trendy cafes and vintage shops',
    bestFor: ['Creatives', 'Artists', 'Bike enthusiasts', 'Coffee lovers'],
    notIdealFor: ['Car-dependent commuters', 'Luxury seekers']
  },
  'Silver Lake': {
    rent: 2600, walkScore: 88, transitScore: 75, schoolRating: 8, nightlifeRating: 7,
    groceryCost: 420, diningCost: 400, utilitiesCost: 150,
    character: 'Artsy and progressive, reservoir trails, farm-to-table dining, yoga culture',
    bestFor: ['Creatives', 'Health-conscious', 'Dog owners', 'Outdoor enthusiasts'],
    notIdealFor: ['Budget shoppers', 'Beach lovers']
  },
  'Los Feliz': {
    rent: 2700, walkScore: 85, transitScore: 70, schoolRating: 8, nightlifeRating: 6,
    groceryCost: 430, diningCost: 420, utilitiesCost: 155,
    character: 'Classic LA charm, Griffith Park access, indie theaters, relaxed sophistication',
    bestFor: ['Film buffs', 'Hikers', 'Families', 'Those seeking character'],
    notIdealFor: ['Party seekers', 'Those needing easy freeway access']
  },
  'Hollywood': {
    rent: 2500, walkScore: 92, transitScore: 88, schoolRating: 6, nightlifeRating: 9,
    groceryCost: 440, diningCost: 480, utilitiesCost: 150,
    character: 'Tourist central with entertainment industry energy, rooftop bars, star sightings',
    bestFor: ['Entertainment industry', 'Nightlife', 'Transit riders', 'Tourists at heart'],
    notIdealFor: ['Families', 'Those seeking authentic LA', 'Peace and quiet']
  },
  'West Hollywood': {
    rent: 2900, walkScore: 93, transitScore: 85, schoolRating: 7, nightlifeRating: 9,
    groceryCost: 460, diningCost: 520, utilitiesCost: 160,
    character: 'LGBTQ+ heart of LA, Sunset Strip nightlife, boutique shopping, cosmopolitan vibe',
    bestFor: ['LGBTQ+ community', 'Social butterflies', 'Walkability lovers'],
    notIdealFor: ['Budget-conscious', 'Families', 'Early birds']
  },
  'Santa Monica': {
    rent: 3500, walkScore: 90, transitScore: 80, schoolRating: 9, nightlifeRating: 8,
    groceryCost: 520, diningCost: 600, utilitiesCost: 180,
    character: 'Beach city living, ocean breeze, Third Street Promenade, healthy lifestyle',
    bestFor: ['Beach lovers', 'Families', 'Fitness enthusiasts', 'Tech workers'],
    notIdealFor: ['Budget shoppers', 'Those who hate tourists', 'Eastside commuters']
  },
  'Venice': {
    rent: 3200, walkScore: 88, transitScore: 75, schoolRating: 8, nightlifeRating: 8,
    groceryCost: 500, diningCost: 550, utilitiesCost: 175,
    character: 'Bohemian beach culture, canals, Abbot Kinney shopping, eclectic characters',
    bestFor: ['Creatives', 'Beach lifestyle', 'Bikers', 'Unique personalities'],
    notIdealFor: ['Traditionalists', 'Those seeking suburban calm']
  },
  'Marina del Rey': {
    rent: 3400, walkScore: 75, transitScore: 70, schoolRating: 8, nightlifeRating: 6,
    groceryCost: 510, diningCost: 560, utilitiesCost: 185,
    character: 'Waterfront living, yacht harbor, resort-style amenities, relaxed luxury',
    bestFor: ['Water sports', 'Professionals', 'Retirees', 'Beach access without crowds'],
    notIdealFor: ['Budget-conscious', 'Urban energy seekers', 'Non-drivers']
  },
  'West LA': {
    rent: 2800, walkScore: 80, transitScore: 75, schoolRating: 9, nightlifeRating: 5,
    groceryCost: 470, diningCost: 480, utilitiesCost: 165,
    character: 'Residential and family-friendly, good schools, central location, practical',
    bestFor: ['Families', 'Commuters', 'Students (near UCLA)', 'Practical living'],
    notIdealFor: ['Nightlife seekers', 'Those wanting neighborhood character']
  },
  'Beverly Hills': {
    rent: 4500, walkScore: 85, transitScore: 65, schoolRating: 10, nightlifeRating: 7,
    groceryCost: 650, diningCost: 800, utilitiesCost: 200,
    character: 'Luxury epitome, Rodeo Drive shopping, celebrity sightings, pristine streets',
    bestFor: ['High earners', 'Luxury seekers', 'Top schools', 'Status-conscious'],
    notIdealFor: ['Budget-conscious', 'Authenticity seekers', 'Bohemian types']
  },
  'Bel Air': {
    rent: 5000, walkScore: 60, transitScore: 50, schoolRating: 10, nightlifeRating: 3,
    groceryCost: 700, diningCost: 850, utilitiesCost: 220,
    character: 'Ultra-exclusive hillside estates, maximum privacy, scenic views, serene',
    bestFor: ['Ultra-wealthy', 'Privacy seekers', 'Families', 'Scenic beauty'],
    notIdealFor: ['Walkability', 'Social scene', 'Budget (any level)', 'Singles']
  },
  'Brentwood': {
    rent: 3800, walkScore: 70, transitScore: 60, schoolRating: 9, nightlifeRating: 4,
    groceryCost: 600, diningCost: 650, utilitiesCost: 195,
    character: 'Upscale and family-oriented, farmers market culture, safe streets, village feel',
    bestFor: ['Families', 'Professionals', 'Health-conscious', 'Safe neighborhoods'],
    notIdealFor: ['Young singles', 'Budget shoppers', 'Public transit users']
  },
  'Culver City': {
    rent: 2600, walkScore: 85, transitScore: 80, schoolRating: 8, nightlifeRating: 7,
    groceryCost: 430, diningCost: 450, utilitiesCost: 155,
    character: 'Film industry hub, revitalized downtown, tech scene, arts district, walkable',
    bestFor: ['Industry professionals', 'Tech workers', 'Foodies', 'Central location'],
    notIdealFor: ['Beach seekers', 'Those avoiding gentrification']
  },
  'Palms': {
    rent: 2300, walkScore: 78, transitScore: 78, schoolRating: 7, nightlifeRating: 6,
    groceryCost: 400, diningCost: 380, utilitiesCost: 145,
    character: 'Up-and-coming, diverse, good transit, affordable, near Culver City energy',
    bestFor: ['Budget-conscious', 'Transit riders', 'Young professionals', 'Value seekers'],
    notIdealFor: ['Those wanting established nightlife', 'Luxury seekers']
  },
  'Van Nuys': {
    rent: 1800, walkScore: 70, transitScore: 75, schoolRating: 6, nightlifeRating: 5,
    groceryCost: 360, diningCost: 320, utilitiesCost: 130,
    character: 'Valley affordability, diverse community, orange line access, practical living',
    bestFor: ['Budget-conscious', 'Valley workers', 'Families', 'Space seekers'],
    notIdealFor: ['Westside commuters', 'Walkability enthusiasts', 'Beach proximity']
  },
  'North Hollywood': {
    rent: 1900, walkScore: 75, transitScore: 80, schoolRating: 6, nightlifeRating: 6,
    groceryCost: 370, diningCost: 340, utilitiesCost: 135,
    character: 'NoHo Arts District energy, theater scene, red line station, improving rapidly',
    bestFor: ['Artists', 'Budget-conscious', 'Theater lovers', 'Metro riders'],
    notIdealFor: ['Beach lovers', 'Those wanting immediate polish']
  },
  'Sherman Oaks': {
    rent: 2400, walkScore: 75, transitScore: 70, schoolRating: 8, nightlifeRating: 5,
    groceryCost: 420, diningCost: 400, utilitiesCost: 150,
    character: 'Valley sophistication, Ventura Blvd dining, good schools, suburban feel',
    bestFor: ['Families', 'Professionals', 'Valley workers', 'Suburban seekers'],
    notIdealFor: ['Urban energy lovers', 'Beach proximity', 'Singles scene']
  },
  'Studio City': {
    rent: 2600, walkScore: 78, transitScore: 72, schoolRating: 9, nightlifeRating: 6,
    groceryCost: 440, diningCost: 420, utilitiesCost: 155,
    character: 'Charming village, industry professionals, great restaurants, family-friendly',
    bestFor: ['Entertainment industry', 'Families', 'Foodies', 'Small-town feel'],
    notIdealFor: ['Party scene', 'Budget shoppers', 'Walkability maximalists']
  },
  'Encino': {
    rent: 2800, walkScore: 65, transitScore: 65, schoolRating: 9, nightlifeRating: 4,
    groceryCost: 460, diningCost: 450, utilitiesCost: 160,
    character: 'Suburban valley living, excellent schools, spacious, safe and quiet',
    bestFor: ['Families', 'Those wanting space', 'Top schools', 'Safety-conscious'],
    notIdealFor: ['Singles', 'Walkability', 'Nightlife', 'Urban excitement']
  },
  'Burbank': {
    rent: 2200, walkScore: 80, transitScore: 78, schoolRating: 8, nightlifeRating: 6,
    groceryCost: 390, diningCost: 370, utilitiesCost: 140,
    character: 'Media city, studio proximity, safe and clean, small-town feel in the city',
    bestFor: ['Entertainment industry', 'Families', 'Safe neighborhoods', 'Value'],
    notIdealFor: ['Beach access', 'Westside workers', 'Cutting-edge cool']
  },
  'Glendale': {
    rent: 2100, walkScore: 78, transitScore: 75, schoolRating: 8, nightlifeRating: 6,
    groceryCost: 380, diningCost: 360, utilitiesCost: 138,
    character: 'Armenian culture hub, Americana mall, clean and safe, family-oriented',
    bestFor: ['Families', 'Value seekers', 'Armenian community', 'Safe living'],
    notIdealFor: ['Beach lovers', 'Nightlife seekers', 'LA proper feel']
  },
  'Inglewood': {
    rent: 1700, walkScore: 72, transitScore: 78, schoolRating: 5, nightlifeRating: 5,
    groceryCost: 350, diningCost: 310, utilitiesCost: 125,
    character: 'Rapidly transforming, SoFi Stadium energy, transit access, improving',
    bestFor: ['Budget-conscious', 'Sports fans', 'Value hunters', 'Growth areas'],
    notIdealFor: ['Those wanting established areas', 'Top schools priority']
  },
  'Compton': {
    rent: 1400, walkScore: 65, transitScore: 70, schoolRating: 4, nightlifeRating: 4,
    groceryCost: 330, diningCost: 280, utilitiesCost: 115,
    character: 'Historic community, most affordable, cultural richness, improving slowly',
    bestFor: ['Maximum affordability', 'Cultural authenticity', 'Long-term investors'],
    notIdealFor: ['Safety as top priority', 'Top schools', 'Walkability']
  },
  'South LA': {
    rent: 1500, walkScore: 68, transitScore: 75, schoolRating: 5, nightlifeRating: 4,
    groceryCost: 340, diningCost: 290, utilitiesCost: 118,
    character: 'Diverse and historic, metro access, cultural roots, emerging areas',
    bestFor: ['Affordability', 'Transit access', 'Cultural diversity', 'Space'],
    notIdealFor: ['Safety focus', 'Established amenities', 'Top schools']
  },
  'Watts': {
    rent: 1300, walkScore: 62, transitScore: 72, schoolRating: 4, nightlifeRating: 3,
    groceryCost: 325, diningCost: 275, utilitiesCost: 112,
    character: 'Most affordable LA proper, Watts Towers cultural landmark, tight-knit community',
    bestFor: ['Absolute budget minimum', 'Community-focused', 'Cultural history'],
    notIdealFor: ['Safety priority', 'Walkability', 'Dining/nightlife scene']
  },
  'Pasadena': {
    rent: 2300, walkScore: 82, transitScore: 75, schoolRating: 9, nightlifeRating: 7,
    groceryCost: 410, diningCost: 400, utilitiesCost: 148,
    character: 'Old money charm, Rose Bowl culture, Colorado Blvd dining, own identity',
    bestFor: ['Families', 'History lovers', 'Good schools', 'Small city feel'],
    notIdealFor: ['Beach access', 'Westside workers', 'Cutting-edge urban']
  },
  'Alhambra': {
    rent: 2000, walkScore: 78, transitScore: 75, schoolRating: 8, nightlifeRating: 6,
    groceryCost: 370, diningCost: 340, utilitiesCost: 135,
    character: 'San Gabriel Valley hub, Asian food mecca, affordable, good schools',
    bestFor: ['Foodies', 'Families', 'Value', 'Asian culture', 'Good schools'],
    notIdealFor: ['Beach proximity', 'Westside commute', 'Nightlife']
  },
  'East LA': {
    rent: 1600, walkScore: 70, transitScore: 78, schoolRating: 5, nightlifeRating: 5,
    groceryCost: 345, diningCost: 300, utilitiesCost: 120,
    character: 'Latino cultural heart, authentic Mexican food, affordable, strong community',
    bestFor: ['Affordability', 'Latino culture', 'Authentic food', 'Transit access'],
    notIdealFor: ['Safety focus', 'Top schools', 'Gentrified amenities']
  },
  'El Monte': {
    rent: 1500, walkScore: 68, transitScore: 72, schoolRating: 6, nightlifeRating: 4,
    groceryCost: 335, diningCost: 295, utilitiesCost: 118,
    character: 'San Gabriel Valley affordability, diverse, growing, family-oriented',
    bestFor: ['Budget-conscious families', 'Valley workers', 'Space seekers'],
    notIdealFor: ['Walkability', 'Beach access', 'Urban amenities']
  },
  'Long Beach': {
    rent: 2000, walkScore: 80, transitScore: 78, schoolRating: 7, nightlifeRating: 7,
    groceryCost: 390, diningCost: 380, utilitiesCost: 142,
    character: 'Beach city with own identity, waterfront, diverse, arts scene, affordable',
    bestFor: ['Beach lovers on budget', 'Own city feel', 'Diversity', 'Artists'],
    notIdealFor: ['LA proper proximity', 'Westside workers', 'Quick commutes']
  },
  'Torrance': {
    rent: 2400, walkScore: 70, transitScore: 68, schoolRating: 9, nightlifeRating: 5,
    groceryCost: 425, diningCost: 410, utilitiesCost: 152,
    character: 'South Bay suburban excellence, top schools, Japanese influence, safe',
    bestFor: ['Families', 'Top schools', 'Safety', 'South Bay workers', 'Asian culture'],
    notIdealFor: ['Singles', 'Nightlife', 'Walkability', 'LA proper feel']
  },
  'Redondo Beach': {
    rent: 2800, walkScore: 75, transitScore: 65, schoolRating: 9, nightlifeRating: 6,
    groceryCost: 475, diningCost: 500, utilitiesCost: 170,
    character: 'Beach town living, pier culture, family-friendly, laid-back coastal vibe',
    bestFor: ['Beach families', 'Water sports', 'Relaxed lifestyle', 'Good schools'],
    notIdealFor: ['Budget-conscious', 'Urban energy', 'LA commuters']
  },
  'Manhattan Beach': {
    rent: 3800, walkScore: 78, transitScore: 60, schoolRating: 10, nightlifeRating: 7,
    groceryCost: 600, diningCost: 700, utilitiesCost: 190,
    character: 'Beach luxury, top schools, volleyball culture, affluent and active',
    bestFor: ['High earners', 'Beach lifestyle', 'Top schools', 'Fitness culture'],
    notIdealFor: ['Budget (any)', 'Diversity seekers', 'LA urban feel']
  },
  'El Segundo': {
    rent: 2500, walkScore: 72, transitScore: 70, schoolRating: 8, nightlifeRating: 5,
    groceryCost: 440, diningCost: 430, utilitiesCost: 158,
    character: 'Aerospace hub, small-town feel, safe, near beach, good value for South Bay',
    bestFor: ['Aerospace workers', 'Families', 'Beach access', 'Small town feel'],
    notIdealFor: ['Nightlife', 'Walkability', 'Urban excitement']
  },
}

export function SmartRecommendationsEngine() {
  const [step, setStep] = useState<'wizard' | 'results' | 'discover' | 'compare'>('wizard')
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: 2500,
    maxBudget: 3500,
    priorities: ['safety'],
    lifestyle: null,
    commuteLocation: null,
    mustHaves: [],
    dealBreakers: []
  })
  const [savedRecommendations, setSavedRecommendations] = useState<SavedRecommendation[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodWithScore | null>(null)
  const [compareList, setCompareList] = useState<NeighborhoodWithScore[]>([])
  const [sortBy, setSortBy] = useState<SortOption>('score')
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    minSafety: 0,
    maxRent: 5000,
    minWalkScore: 0,
    minTransit: 0,
    trendingOnly: false
  })

  // Load saved recommendations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('la-crime-saved-neighborhoods')
    if (saved) {
      try {
        setSavedRecommendations(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved recommendations')
      }
    }
  }, [])

  // Save to localStorage when savedRecommendations changes
  useEffect(() => {
    if (savedRecommendations.length > 0) {
      localStorage.setItem('la-crime-saved-neighborhoods', JSON.stringify(savedRecommendations))
    }
  }, [savedRecommendations])

  // Calculate comprehensive safety score (0-100)
  const calculateSafetyScore = (neighborhood: NeighborhoodData): number => {
    // Use enhanced safety score if available
    if (neighborhood.safetyScore !== null && neighborhood.safetyScore !== undefined) {
      return neighborhood.safetyScore
    }

    // Fallback: calculate from crime data with weighted importance
    const weightedCrime = (
      neighborhood.violentCrime * 3.0 +  // Violent crime weighted most heavily
      neighborhood.carTheft * 1.5 +
      neighborhood.breakIns * 2.0 +
      neighborhood.pettyTheft * 1.0
    )

    // Scale to 0-100, where lower crime = higher score
    return Math.max(0, Math.min(100, 100 - (weightedCrime * 1.2)))
  }

  // Calculate affordability score based on budget
  const calculateAffordabilityScore = (rent: number, budget: number): number => {
    if (rent <= budget * 0.7) return 100 // Great deal!
    if (rent <= budget * 0.85) return 85
    if (rent <= budget) return 70
    if (rent <= budget * 1.1) return 50
    if (rent <= budget * 1.25) return 30
    return 10 // Way over budget
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

  // Advanced recommendation algorithm with deep personalization
  const getRecommendations = useMemo((): NeighborhoodWithScore[] => {
    const scoredNeighborhoods = laNeighborhoods.features.map(feature => {
      const neighborhood = feature.properties
      const amenities = NEIGHBORHOOD_AMENITIES[neighborhood.name] || {
        rent: 2000,
        walkScore: 70,
        transitScore: 70,
        schoolRating: 6,
        nightlifeRating: 5,
        groceryCost: 400,
        diningCost: 400,
        utilitiesCost: 150,
        character: 'Mixed-use neighborhood',
        bestFor: [],
        notIdealFor: []
      }

      let score = 0
      let personalizedScore = 0
      const reasons: string[] = []
      const pros: string[] = []
      const cons: string[] = []

      // === CORE METRICS (50% of score) ===

      // Safety score (25% - most critical)
      const safetyScore = calculateSafetyScore(neighborhood)
      const safetyWeight = preferences.priorities.includes('safety') ? 25 : 15
      score += safetyScore * (safetyWeight / 100)

      if (safetyScore >= 85) {
        reasons.push('🛡️ Exceptionally safe neighborhood')
        pros.push(`Safety: ${Math.round(safetyScore)}/100 - Top 10% safest`)
      } else if (safetyScore >= 70) {
        reasons.push('✓ Above-average safety rating')
        pros.push(`Safety: ${Math.round(safetyScore)}/100`)
      } else if (safetyScore >= 55) {
        pros.push(`Safety: ${Math.round(safetyScore)}/100`)
      } else {
        cons.push(`Lower safety score: ${Math.round(safetyScore)}/100`)
      }

      // Budget and affordability (25% - critical for most)
      const affordabilityScore = calculateAffordabilityScore(amenities.rent, preferences.budget)
      const costOfLiving = {
        rent: amenities.rent,
        groceries: amenities.groceryCost,
        dining: amenities.diningCost,
        utilities: amenities.utilitiesCost,
        total: amenities.rent + amenities.groceryCost + amenities.diningCost + amenities.utilitiesCost
      }

      score += affordabilityScore * 0.25

      if (amenities.rent <= preferences.budget * 0.75) {
        reasons.push('💰 Excellent value - well under budget!')
        pros.push(`Rent: $${amenities.rent}/mo (${Math.round((1 - amenities.rent / preferences.budget) * 100)}% under budget)`)
      } else if (amenities.rent <= preferences.budget * 0.9) {
        reasons.push('Great deal for your budget')
        pros.push(`Rent: $${amenities.rent}/mo (under budget)`)
      } else if (amenities.rent <= preferences.budget) {
        pros.push(`Rent: $${amenities.rent}/mo (fits budget)`)
      } else if (amenities.rent <= preferences.maxBudget) {
        cons.push(`Rent: $${amenities.rent}/mo (${Math.round((amenities.rent / preferences.budget - 1) * 100)}% over preferred budget)`)
      } else {
        cons.push(`Rent: $${amenities.rent}/mo (exceeds max budget)`)
        score -= 15 // Significant penalty
      }

      // === PRIORITIES (30% of score) ===
      const priorityWeight = preferences.priorities.length > 0 ? 30 / preferences.priorities.length : 0

      preferences.priorities.forEach(priority => {
        switch (priority) {
          case 'safety':
            // Already handled above with higher weight
            break
          case 'transit':
            score += amenities.transitScore * (priorityWeight / 100)
            if (amenities.transitScore >= 85) {
              reasons.push('🚇 Excellent transit - car-free friendly')
              pros.push(`Transit: ${amenities.transitScore}/100 - Metro/bus access`)
            } else if (amenities.transitScore >= 75) {
              pros.push(`Good transit access (${amenities.transitScore}/100)`)
            } else if (amenities.transitScore < 65) {
              cons.push('Limited public transit options')
            }
            break
          case 'schools':
            score += amenities.schoolRating * 10 * (priorityWeight / 100)
            if (amenities.schoolRating >= 9) {
              reasons.push('🎓 Top-tier schools (9-10 rating)')
              pros.push(`Schools: ${amenities.schoolRating}/10 - Excellent education`)
            } else if (amenities.schoolRating >= 7) {
              pros.push(`Good schools (${amenities.schoolRating}/10)`)
            } else if (amenities.schoolRating <= 5) {
              cons.push(`Schools rated ${amenities.schoolRating}/10`)
            }
            break
          case 'nightlife':
            score += amenities.nightlifeRating * 10 * (priorityWeight / 100)
            if (amenities.nightlifeRating >= 8) {
              reasons.push('🎉 Vibrant nightlife and dining scene')
              pros.push(`Nightlife: ${amenities.nightlifeRating}/10 - Bars, clubs, late-night`)
            } else if (amenities.nightlifeRating >= 6) {
              pros.push(`Active nightlife (${amenities.nightlifeRating}/10)`)
            } else if (amenities.nightlifeRating <= 4) {
              cons.push('Quiet area - limited nightlife')
            }
            break
          case 'walkability':
            score += amenities.walkScore * (priorityWeight / 100)
            if (amenities.walkScore >= 90) {
              reasons.push('🚶 Walker\'s paradise - daily errands on foot')
              pros.push(`Walk Score: ${amenities.walkScore}/100 - Highly walkable`)
            } else if (amenities.walkScore >= 80) {
              pros.push(`Very walkable (${amenities.walkScore}/100)`)
            } else if (amenities.walkScore < 70) {
              cons.push('Car-dependent area')
            }
            break
          case 'affordability':
            // Already factored into budget scoring, add bonus
            if (costOfLiving.total <= 3500) {
              score += 10
              pros.push('Low overall cost of living')
            }
            break
        }
      })

      // === LIFESTYLE FIT (20% of score) ===
      if (preferences.lifestyle) {
        let lifestyleScore = 0
        let lifestyleReasons: string[] = []

        switch (preferences.lifestyle) {
          case 'family':
            lifestyleScore = (amenities.schoolRating * 10 + safetyScore + (10 - amenities.nightlifeRating) * 5) / 2.5
            if (amenities.schoolRating >= 8 && safetyScore >= 70) {
              lifestyleReasons.push('👨‍👩‍👧‍👦 Ideal for families - safe with great schools')
            }
            if (amenities.nightlifeRating > 7) {
              cons.push('Very active nightlife may not suit families')
            }
            if (amenities.walkScore >= 75) {
              pros.push('Family-friendly walkability')
            }
            break

          case 'student':
            lifestyleScore = (amenities.transitScore + amenities.nightlifeRating * 10 + (100 - (amenities.rent / 50))) / 3
            if (amenities.rent < 2000) {
              lifestyleReasons.push('🎓 Student-budget friendly')
            }
            if (amenities.nightlifeRating >= 7 && amenities.transitScore >= 75) {
              lifestyleReasons.push('Great social scene with transit access')
            }
            if (amenities.rent < 1800) {
              pros.push('Very affordable for students')
            }
            break

          case 'professional':
            lifestyleScore = (amenities.walkScore + amenities.transitScore + amenities.nightlifeRating * 8) / 2.8
            if (amenities.walkScore >= 85 && amenities.transitScore >= 75) {
              lifestyleReasons.push('💼 Perfect for young professionals - walkable & connected')
            }
            if (amenities.nightlifeRating >= 7) {
              pros.push('Active social and dining scene')
            }
            if (costOfLiving.dining >= 500) {
              cons.push('Higher dining costs')
            }
            break

          case 'retiree':
            lifestyleScore = (safetyScore + (10 - amenities.nightlifeRating) * 8 + amenities.walkScore * 0.8) / 2.6
            if (safetyScore >= 80 && amenities.nightlifeRating <= 5) {
              lifestyleReasons.push('🌅 Peaceful and safe for retirees')
            }
            if (amenities.walkScore >= 75) {
              pros.push('Walkable for daily activities')
            }
            break

          case 'creative':
            lifestyleScore = (amenities.nightlifeRating * 10 + amenities.walkScore + (100 - (amenities.rent / 40))) / 3
            if (amenities.nightlifeRating >= 6 && amenities.rent <= 2600) {
              lifestyleReasons.push('🎨 Creative-friendly vibe and affordability')
            }
            if (amenities.bestFor.some(b => b.toLowerCase().includes('creative') || b.toLowerCase().includes('artist'))) {
              pros.push('Known for arts and creative community')
            }
            break

          case 'entrepreneur':
            lifestyleScore = (amenities.walkScore + amenities.transitScore + affordabilityScore) / 3
            if (amenities.walkScore >= 80) {
              lifestyleReasons.push('🚀 Connected neighborhood for networking')
            }
            if (costOfLiving.total <= 3800) {
              pros.push('Reasonable costs for startup life')
            }
            break
        }

        score += lifestyleScore * 0.2
        reasons.push(...lifestyleReasons)
      }

      // === TREND BONUS/PENALTY ===
      if (neighborhood.trendIndicator === 'improving') {
        reasons.push('📈 Crime trending down - improving area')
        pros.push('Safety improving over time')
        score += 8
      } else if (neighborhood.trendIndicator === 'worsening') {
        cons.push('⚠️ Crime trending up recently')
        score -= 8
      }

      // === CHARACTER & FIT ===
      if (amenities.character) {
        // Character is displayed but doesn't affect score directly
      }

      // Check bestFor alignment
      if (preferences.lifestyle && amenities.bestFor.length > 0) {
        const lifestyleMatch = amenities.bestFor.some(b =>
          b.toLowerCase().includes(preferences.lifestyle!) ||
          (preferences.lifestyle === 'professional' && b.toLowerCase().includes('young professionals'))
        )
        if (lifestyleMatch) {
          score += 5
        }
      }

      // Check notIdealFor conflicts
      if (preferences.lifestyle && amenities.notIdealFor.length > 0) {
        const lifestyleConflict = amenities.notIdealFor.some(n =>
          n.toLowerCase().includes(preferences.lifestyle!) ||
          (preferences.lifestyle === 'family' && n.toLowerCase().includes('families'))
        )
        if (lifestyleConflict) {
          score -= 5
          cons.push('May not be ideal for your lifestyle')
        }
      }

      // === CALCULATE MATCH PERCENTAGE ===
      const matchPercentage = Math.min(100, Math.max(0, score))

      // === FIND SIMILAR NEIGHBORHOODS ===
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
        personalizedScore: matchPercentage,
        matchPercentage,
        affordabilityScore,
        reasons: reasons.slice(0, 4),
        pros: pros.slice(0, 6),
        cons: cons.slice(0, 4),
        similarTo,
        costOfLiving
      }
    })

    // Apply active filters
    let filtered = scoredNeighborhoods.filter(n => {
      if (n.rent > activeFilters.maxRent) return false
      if (calculateSafetyScore(n) < activeFilters.minSafety) return false
      if (n.walkScore < activeFilters.minWalkScore) return false
      if (n.transitScore < activeFilters.minTransit) return false
      if (activeFilters.trendingOnly && n.trendIndicator !== 'improving') return false
      return true
    })

    // Sort by selected option
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score
        case 'safety':
          return calculateSafetyScore(b) - calculateSafetyScore(a)
        case 'price-low':
          return a.rent - b.rent
        case 'price-high':
          return b.rent - a.rent
        case 'walkability':
          return b.walkScore - a.walkScore
        case 'transit':
          return b.transitScore - a.transitScore
        default:
          return b.score - a.score
      }
    })

    return filtered.slice(0, 12)
  }, [preferences, sortBy, activeFilters])

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
    const alreadySaved = savedRecommendations.some(s => s.neighborhood.name === neighborhood.name)
    if (alreadySaved) {
      setSavedRecommendations(prev => prev.filter(s => s.neighborhood.name !== neighborhood.name))
    } else {
      const newSave: SavedRecommendation = {
        id: `${neighborhood.name}-${Date.now()}`,
        neighborhood,
        savedAt: new Date()
      }
      setSavedRecommendations(prev => [...prev, newSave])
    }
  }

  const isSaved = (neighborhood: NeighborhoodWithScore): boolean => {
    return savedRecommendations.some(s => s.neighborhood.name === neighborhood.name)
  }

  const toggleCompare = (neighborhood: NeighborhoodWithScore) => {
    const inCompare = compareList.some(n => n.name === neighborhood.name)
    if (inCompare) {
      setCompareList(prev => prev.filter(n => n.name !== neighborhood.name))
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 neighborhoods at a time')
        return
      }
      setCompareList(prev => [...prev, neighborhood])
    }
  }

  const isInCompare = (neighborhood: NeighborhoodWithScore): boolean => {
    return compareList.some(n => n.name === neighborhood.name)
  }

  const shareRecommendations = () => {
    const top5 = getRecommendations.slice(0, 5)
    const text = `My top LA neighborhoods from LA Crime Map:\n\n${top5.map((n, i) =>
      `${i + 1}. ${n.name}\n   Match: ${Math.round(n.matchPercentage)}% | Safety: ${Math.round(calculateSafetyScore(n))}/100 | Rent: $${n.rent}/mo`
    ).join('\n\n')}\n\nFind yours at: la-crime-map.com/recommendations`

    if (navigator.share) {
      navigator.share({
        title: 'My LA Neighborhood Recommendations',
        text
      })
    } else {
      navigator.clipboard.writeText(text)
      alert('✓ Copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-dark-bg-secondary dark:to-gray-800">
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
              recommendations={getRecommendations}
              onBack={() => setStep('wizard')}
              onSave={saveRecommendation}
              onShare={shareRecommendations}
              onSelectNeighborhood={setSelectedNeighborhood}
              selectedNeighborhood={selectedNeighborhood}
              isSaved={isSaved}
              compareList={compareList}
              toggleCompare={toggleCompare}
              isInCompare={isInCompare}
              onCompare={() => setStep('compare')}
              sortBy={sortBy}
              setSortBy={setSortBy}
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              calculateSafetyScore={calculateSafetyScore}
            />
          )}

          {step === 'compare' && (
            <CompareView
              neighborhoods={compareList}
              onBack={() => setStep('results')}
              onRemove={(neighborhood) => toggleCompare(neighborhood)}
              calculateSafetyScore={calculateSafetyScore}
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
              isSaved={isSaved(selectedNeighborhood)}
              calculateSafetyScore={calculateSafetyScore}
            />
          )}
        </AnimatePresence>
      </div>
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
      {/* Hero Header with LA Sunset Theme */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple blur-2xl opacity-30 animate-pulse"></div>
            <Sparkles className="relative w-16 h-16 text-la-sunset-orange mx-auto mb-3" />
          </div>
        </motion.div>
        <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple bg-clip-text text-transparent leading-tight">
          Find Your Perfect
          <br />
          LA Neighborhood
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Get personalized recommendations based on safety data, your budget, and lifestyle preferences
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span>Real crime data</span>
          <span>•</span>
          <Zap className="w-4 h-4 text-la-sunset-orange" />
          <span>Smart matching</span>
          <span>•</span>
          <Heart className="w-4 h-4 text-la-sunset-pink" />
          <span>Personalized results</span>
        </div>
      </div>

      {/* Quick Filters - LA Sunset Themed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-la-sunset-orange/10 via-la-sunset-pink/10 to-la-sunset-purple/10 dark:from-la-sunset-orange/5 dark:via-la-sunset-pink/5 dark:to-la-sunset-purple/5 rounded-3xl p-6 sm:p-8 border-2 border-la-sunset-orange/20 dark:border-la-sunset-purple/30 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Quick Start - Skip the Form
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickFilterButton
            icon={Shield}
            label="Safest Overall"
            description="Top security"
            onClick={() => onQuickFilter('safest')}
          />
          <QuickFilterButton
            icon={DollarSign}
            label="Best Value"
            description="Safety + affordability"
            onClick={() => onQuickFilter('value')}
          />
          <QuickFilterButton
            icon={TrendingUp}
            label="Improving Areas"
            description="Crime trending down"
            onClick={() => onQuickFilter('improving')}
          />
          <QuickFilterButton
            icon={Baby}
            label="Family-Friendly"
            description="Safe with great schools"
            onClick={() => onQuickFilter('family')}
          />
          <QuickFilterButton
            icon={GraduationCap}
            label="Student Areas"
            description="Affordable + transit"
            onClick={() => onQuickFilter('student')}
          />
          <QuickFilterButton
            icon={Shuffle}
            label="Surprise Me!"
            description="Random safe pick"
            onClick={onDiscover}
            variant="special"
          />
        </div>
      </motion.div>

      {/* Customization Form - LA Night Sky Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gradient-to-br dark:from-la-night-dark dark:to-la-night-base rounded-3xl shadow-2xl border border-gray-200 dark:border-la-sunset-purple/20 p-6 sm:p-8 space-y-8"
      >
        <div className="text-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Customize Your Search
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            The more you tell us, the better your recommendations
          </p>
        </div>

        {/* Budget Slider - Enhanced */}
        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            Monthly Rent Budget
          </label>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Preferred</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${preferences.budget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="100"
                value={preferences.budget}
                onChange={(e) => setPreferences({ ...preferences, budget: parseInt(e.target.value) })}
                className="w-full h-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full appearance-none cursor-pointer accent-green-600"
                style={{
                  background: `linear-gradient(to right, rgb(34 197 94) 0%, rgb(34 197 94) ${((preferences.budget - 1000) / 4000) * 100}%, rgb(229 231 235) ${((preferences.budget - 1000) / 4000) * 100}%, rgb(229 231 235) 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>$1,000</span>
                <span>$5,000+</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Maximum (stretch)</span>
                <span className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                  ${preferences.maxBudget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={preferences.budget}
                max="6000"
                step="100"
                value={preferences.maxBudget}
                onChange={(e) => setPreferences({ ...preferences, maxBudget: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-la-sunset-orange"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mt-1">
                <span>${preferences.budget.toLocaleString()}</span>
                <span>$6,000+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priorities - Enhanced */}
        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink rounded-lg">
              <Star className="w-4 h-4 text-white" />
            </div>
            Top Priorities
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(select all that matter)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <PriorityButton
              icon={Shield}
              label="Safety"
              selected={preferences.priorities.includes('safety')}
              onClick={() => togglePriority('safety')}
            />
            <PriorityButton
              icon={Home}
              label="Walkability"
              selected={preferences.priorities.includes('walkability')}
              onClick={() => togglePriority('walkability')}
            />
            <PriorityButton
              icon={Bus}
              label="Transit"
              selected={preferences.priorities.includes('transit')}
              onClick={() => togglePriority('transit')}
            />
            <PriorityButton
              icon={GraduationCap}
              label="Schools"
              selected={preferences.priorities.includes('schools')}
              onClick={() => togglePriority('schools')}
            />
            <PriorityButton
              icon={Coffee}
              label="Nightlife"
              selected={preferences.priorities.includes('nightlife')}
              onClick={() => togglePriority('nightlife')}
            />
            <PriorityButton
              icon={DollarSign}
              label="Affordability"
              selected={preferences.priorities.includes('affordability')}
              onClick={() => togglePriority('affordability')}
            />
          </div>
        </div>

        {/* Lifestyle - Enhanced */}
        <div>
          <label className="block text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-la-sunset-purple to-neon-cyan rounded-lg">
              <Users className="w-4 h-4 text-white" />
            </div>
            Your Lifestyle
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <LifestyleButton
              icon={Baby}
              label="Family"
              description="Kids & schools"
              selected={preferences.lifestyle === 'family'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'family' })}
            />
            <LifestyleButton
              icon={GraduationCap}
              label="Student"
              description="College life"
              selected={preferences.lifestyle === 'student'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'student' })}
            />
            <LifestyleButton
              icon={Briefcase}
              label="Professional"
              description="Career-focused"
              selected={preferences.lifestyle === 'professional'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'professional' })}
            />
            <LifestyleButton
              icon={Sun}
              label="Retiree"
              description="Peaceful living"
              selected={preferences.lifestyle === 'retiree'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'retiree' })}
            />
            <LifestyleButton
              icon={Sparkles}
              label="Creative"
              description="Arts & culture"
              selected={preferences.lifestyle === 'creative'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'creative' })}
            />
            <LifestyleButton
              icon={Zap}
              label="Entrepreneur"
              description="Startup hustle"
              selected={preferences.lifestyle === 'entrepreneur'}
              onClick={() => setPreferences({ ...preferences, lifestyle: 'entrepreneur' })}
            />
          </div>
        </div>

        {/* Submit Button - LA Sunset Gradient */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple text-white font-bold py-5 px-6 rounded-2xl shadow-2xl hover:shadow-la-sunset-orange/50 transition-all flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-la-sunset-pink to-la-sunset-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Sparkles className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Get My Personalized Recommendations</span>
          <ChevronRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
        </motion.button>

        <p className="text-center text-xs text-gray-500 dark:text-gray-500">
          Based on real LAPD crime data • Updated regularly • 100% free
        </p>
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
  isSaved: (neighborhood: NeighborhoodWithScore) => boolean
  compareList: NeighborhoodWithScore[]
  toggleCompare: (neighborhood: NeighborhoodWithScore) => void
  isInCompare: (neighborhood: NeighborhoodWithScore) => boolean
  onCompare: () => void
  sortBy: SortOption
  setSortBy: (sort: SortOption) => void
  showFilters: boolean
  setShowFilters: (show: boolean) => void
  activeFilters: any
  setActiveFilters: (filters: any) => void
  calculateSafetyScore: (neighborhood: NeighborhoodData) => number
}

function ResultsView({
  recommendations,
  onBack,
  onSave,
  onShare,
  onSelectNeighborhood,
  selectedNeighborhood,
  isSaved,
  compareList,
  toggleCompare,
  isInCompare,
  onCompare,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  activeFilters,
  setActiveFilters,
  calculateSafetyScore
}: ResultsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header with Actions */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-la-night-dark dark:to-la-night-base rounded-3xl shadow-xl border border-gray-200 dark:border-la-sunset-purple/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple bg-clip-text text-transparent">
              Your Matches
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
              {recommendations.length} personalized recommendations
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {compareList.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCompare}
                className="px-4 py-2 bg-gradient-to-r from-la-sunset-purple to-neon-cyan text-white rounded-xl flex items-center gap-2 font-semibold shadow-lg min-h-touch"
              >
                <BarChart3 className="w-4 h-4" />
                Compare ({compareList.length})
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              className="px-4 py-2 bg-la-sunset-orange text-white rounded-xl flex items-center gap-2 font-semibold hover:bg-la-sunset-pink transition-colors min-h-touch"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold min-h-touch"
            >
              Back
            </motion.button>
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-la-sunset-orange min-h-touch"
            >
              <option value="score">Best Match</option>
              <option value="safety">Safest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="walkability">Most Walkable</option>
              <option value="transit">Best Transit</option>
            </select>
          </div>
          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl flex items-center gap-2 font-semibold transition-all min-h-touch ${
                showFilters
                  ? 'bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Safety Score: {activeFilters.minSafety}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.minSafety}
                    onChange={(e) => setActiveFilters({ ...activeFilters, minSafety: parseInt(e.target.value) })}
                    className="w-full accent-green-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Rent: ${activeFilters.maxRent}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="6000"
                    step="100"
                    value={activeFilters.maxRent}
                    onChange={(e) => setActiveFilters({ ...activeFilters, maxRent: parseInt(e.target.value) })}
                    className="w-full accent-la-sunset-orange"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Walk Score: {activeFilters.minWalkScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.minWalkScore}
                    onChange={(e) => setActiveFilters({ ...activeFilters, minWalkScore: parseInt(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Transit Score: {activeFilters.minTransit}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeFilters.minTransit}
                    onChange={(e) => setActiveFilters({ ...activeFilters, minTransit: parseInt(e.target.value) })}
                    className="w-full accent-purple-600"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="trending"
                  checked={activeFilters.trendingOnly}
                  onChange={(e) => setActiveFilters({ ...activeFilters, trendingOnly: e.target.checked })}
                  className="w-5 h-5 accent-green-600 rounded"
                />
                <label htmlFor="trending" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show only improving areas (crime trending down)
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recommendations Grid */}
      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((neighborhood, index) => (
            <NeighborhoodCard
              key={neighborhood.name}
              neighborhood={neighborhood}
              rank={index + 1}
              onSave={() => onSave(neighborhood)}
              onClick={() => onSelectNeighborhood(neighborhood)}
              delay={index * 0.05}
              isSaved={isSaved(neighborhood)}
              isInCompare={isInCompare(neighborhood)}
              onToggleCompare={() => toggleCompare(neighborhood)}
              calculateSafetyScore={calculateSafetyScore}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center"
        >
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No neighborhoods match your filters
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Try adjusting your filters or preferences to see more results
          </p>
          <button
            onClick={() => setActiveFilters({
              minSafety: 0,
              maxRent: 5000,
              minWalkScore: 0,
              minTransit: 0,
              trendingOnly: false
            })}
            className="px-6 py-3 bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white rounded-xl font-semibold"
          >
            Reset Filters
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

// Compare View Component
interface CompareViewProps {
  neighborhoods: NeighborhoodWithScore[]
  onBack: () => void
  onRemove: (neighborhood: NeighborhoodWithScore) => void
  calculateSafetyScore: (neighborhood: NeighborhoodData) => number
}

function CompareView({ neighborhoods, onBack, onRemove, calculateSafetyScore }: CompareViewProps) {
  if (neighborhoods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="text-center py-12"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">No neighborhoods selected for comparison</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white rounded-xl font-semibold"
        >
          Back to Results
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gradient-to-br dark:from-la-night-dark dark:to-la-night-base rounded-3xl shadow-xl border border-gray-200 dark:border-la-sunset-purple/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple bg-clip-text text-transparent">
            Neighborhood Comparison
          </h2>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold min-h-touch"
          >
            Back to Results
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Comparing {neighborhoods.length} neighborhood{neighborhoods.length > 1 ? 's' : ''} side-by-side
        </p>
      </div>

      {/* Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-la-sunset-orange/10 via-la-sunset-pink/10 to-la-sunset-purple/10 dark:from-la-sunset-orange/5 dark:via-la-sunset-pink/5 dark:to-la-sunset-purple/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Metric</th>
                {neighborhoods.map((neighborhood) => (
                  <th key={neighborhood.name} className="px-6 py-4 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{neighborhood.name}</span>
                      <button
                        onClick={() => onRemove(neighborhood)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* Match Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Match Score
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink bg-clip-text text-transparent">
                        {Math.round(neighborhood.matchPercentage)}%
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Safety Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Safety Score
                </td>
                {neighborhoods.map((neighborhood) => {
                  const score = Math.round(calculateSafetyScore(neighborhood))
                  return (
                    <td key={neighborhood.name} className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-green-600 dark:text-green-400">{score}/100</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Monthly Rent */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Monthly Rent
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${neighborhood.rent.toLocaleString()}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Total Cost of Living */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Total Monthly Cost
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${neighborhood.costOfLiving.total.toLocaleString()}
                      </span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Rent + utilities + groceries + dining
                      </div>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Walk Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Home className="w-4 h-4 text-blue-600" />
                  Walk Score
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {neighborhood.walkScore}/100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Transit Score */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bus className="w-4 h-4 text-purple-600" />
                  Transit Score
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {neighborhood.transitScore}/100
                    </span>
                  </td>
                ))}
              </tr>

              {/* School Rating */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  School Rating
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {neighborhood.schoolRating}/10
                    </span>
                  </td>
                ))}
              </tr>

              {/* Nightlife Rating */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-orange-600" />
                  Nightlife Rating
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {neighborhood.nightlifeRating}/10
                    </span>
                  </td>
                ))}
              </tr>

              {/* Crime Trend */}
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Crime Trend
                </td>
                {neighborhoods.map((neighborhood) => (
                  <td key={neighborhood.name} className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      neighborhood.trendIndicator === 'improving'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : neighborhood.trendIndicator === 'worsening'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {neighborhood.trendIndicator === 'improving' && <TrendingDown className="w-4 h-4" />}
                      {neighborhood.trendIndicator === 'worsening' && <TrendingUp className="w-4 h-4" />}
                      {neighborhood.trendIndicator === 'improving' ? 'Improving' :
                       neighborhood.trendIndicator === 'worsening' ? 'Worsening' :
                       'Stable'}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Character Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {neighborhoods.map((neighborhood) => (
          <motion.div
            key={neighborhood.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{neighborhood.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
              "{neighborhood.character}"
            </p>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Best For:</h4>
                <div className="flex flex-wrap gap-2">
                  {neighborhood.bestFor.map((item) => (
                    <span key={item} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg text-xs font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {neighborhood.notIdealFor.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">Not Ideal For:</h4>
                  <div className="flex flex-wrap gap-2">
                    {neighborhood.notIdealFor.map((item) => (
                      <span key={item} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 rounded-lg text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Discover View Component
interface DiscoverViewProps {
  neighborhood: NeighborhoodWithScore
  onBack: () => void
  onShuffle: () => void
  onSave: (neighborhood: NeighborhoodWithScore) => void
  isSaved: boolean
  calculateSafetyScore: (neighborhood: NeighborhoodData) => number
}

function DiscoverView({ neighborhood, onBack, onShuffle, onSave, isSaved, calculateSafetyScore }: DiscoverViewProps) {
  const safetyScore = calculateSafetyScore(neighborhood)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
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
  description,
  onClick,
  variant = 'default'
}: {
  icon: any
  label: string
  description?: string
  onClick: () => void
  variant?: 'default' | 'special'
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all shadow-md hover:shadow-xl min-h-touch ${
        variant === 'special'
          ? 'bg-gradient-to-br from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple text-white border-transparent'
          : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:border-la-sunset-orange dark:hover:border-la-sunset-purple'
      }`}
    >
      <Icon className={`w-6 h-6 mb-2 ${
        variant === 'special' ? 'text-white' : 'text-la-sunset-orange dark:text-la-sunset-pink'
      }`} />
      <p className={`text-base font-bold mb-1 ${
        variant === 'special' ? 'text-white' : 'text-gray-900 dark:text-white'
      }`}>
        {label}
      </p>
      {description && (
        <p className={`text-xs ${
          variant === 'special' ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
        }`}>
          {description}
        </p>
      )}
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all shadow-sm min-h-touch ${
        selected
          ? 'bg-gradient-to-br from-la-sunset-orange/10 to-la-sunset-pink/10 dark:from-la-sunset-orange/20 dark:to-la-sunset-pink/20 border-la-sunset-orange dark:border-la-sunset-pink shadow-lg'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <Icon className={`w-7 h-7 mb-2 ${
        selected ? 'text-la-sunset-orange dark:text-la-sunset-pink' : 'text-gray-400 dark:text-gray-500'
      }`} />
      <p className={`text-sm font-bold ${
        selected ? 'text-la-sunset-orange dark:text-la-sunset-pink' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {label}
      </p>
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-la-sunset-orange to-la-sunset-pink rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  )
}

function LifestyleButton({
  icon: Icon,
  label,
  description,
  selected,
  onClick
}: {
  icon: any
  label: string
  description?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative p-4 rounded-2xl border-2 transition-all shadow-sm text-left min-h-touch ${
        selected
          ? 'bg-gradient-to-br from-la-sunset-purple/10 to-neon-cyan/10 dark:from-la-sunset-purple/20 dark:to-neon-cyan/20 border-la-sunset-purple dark:border-neon-cyan shadow-lg'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <Icon className={`w-7 h-7 mb-2 ${
        selected ? 'text-la-sunset-purple dark:text-neon-cyan' : 'text-gray-400 dark:text-gray-500'
      }`} />
      <p className={`text-sm font-bold mb-1 ${
        selected ? 'text-la-sunset-purple dark:text-neon-cyan' : 'text-gray-600 dark:text-gray-400'
      }`}>
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {description}
        </p>
      )}
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-br from-la-sunset-purple to-neon-cyan rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  )
}

function NeighborhoodCard({
  neighborhood,
  rank,
  onSave,
  onClick,
  delay,
  isSaved,
  isInCompare,
  onToggleCompare,
  calculateSafetyScore
}: {
  neighborhood: NeighborhoodWithScore
  rank: number
  onSave: () => void
  onClick: () => void
  delay: number
  isSaved: boolean
  isInCompare: boolean
  onToggleCompare: () => void
  calculateSafetyScore: (neighborhood: NeighborhoodData) => number
}) {
  const safetyScore = calculateSafetyScore(neighborhood)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }}
      className="bg-white dark:bg-gradient-to-br dark:from-la-night-dark dark:to-la-night-base rounded-3xl shadow-xl border border-gray-200 dark:border-la-sunset-purple/20 overflow-hidden group relative"
    >
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-la-sunset-orange via-la-sunset-pink to-la-sunset-purple shadow-lg flex items-center justify-center">
          <span className="text-2xl font-bold text-white">#{rank}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            onToggleCompare()
          }}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all min-w-touch min-h-touch flex items-center justify-center ${
            isInCompare
              ? 'bg-la-sunset-purple text-white'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300'
          }`}
          title="Add to comparison"
        >
          <BarChart3 className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          className={`p-3 rounded-xl shadow-lg backdrop-blur-sm transition-all min-w-touch min-h-touch flex items-center justify-center ${
            isSaved
              ? 'bg-gradient-to-br from-la-sunset-orange to-la-sunset-pink text-white'
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300'
          }`}
          title={isSaved ? 'Saved' : 'Save neighborhood'}
        >
          {isSaved ? <Bookmark className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Clickable Content */}
      <div onClick={onClick} className="cursor-pointer p-6 pt-20">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-la-sunset-orange dark:group-hover:text-la-sunset-pink transition-colors">
            {neighborhood.name}
          </h3>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink"></div>
              <span className="text-lg font-bold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink bg-clip-text text-transparent">
                {Math.round(neighborhood.matchPercentage)}% Match
              </span>
            </div>
            {neighborhood.trendIndicator === 'improving' && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Improving
              </span>
            )}
          </div>
        </div>

        {/* Character Description */}
        {neighborhood.character && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-6 line-clamp-2">
            "{neighborhood.character}"
          </p>
        )}

        {/* Safety and Price - Prominent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Safety Score */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-5 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-600 dark:bg-green-500 rounded-xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wide">
                  Safety Score
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                  {Math.round(safetyScore)}
                  <span className="text-lg text-gray-600 dark:text-gray-400">/100</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">
              {safetyScore >= 80 ? 'Excellent safety rating' :
               safetyScore >= 60 ? 'Good safety rating' :
               'Fair safety rating'}
            </p>
          </div>

          {/* Monthly Rent */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-xl">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wide">
                  Monthly Rent
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-500">
                  ${neighborhood.rent.toLocaleString()}
                </p>
              </div>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Total: ${neighborhood.costOfLiving.total.toLocaleString()}/mo
            </p>
          </div>
        </div>

        {/* Why This Neighborhood */}
        {neighborhood.reasons.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-br from-la-sunset-orange/5 via-la-sunset-pink/5 to-la-sunset-purple/5 dark:from-la-sunset-orange/10 dark:via-la-sunset-pink/10 dark:to-la-sunset-purple/10 rounded-2xl border border-la-sunset-orange/20 dark:border-la-sunset-purple/30">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-la-sunset-orange" />
              Why we recommend this:
            </h4>
            <div className="space-y-2">
              {neighborhood.reasons.map((reason, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-la-sunset-orange flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amenity Scores */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Home className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{neighborhood.walkScore}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Walk</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Bus className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{neighborhood.transitScore}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Transit</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{neighborhood.schoolRating}/10</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Schools</p>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Coffee className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{neighborhood.nightlifeRating}/10</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Nightlife</p>
          </div>
        </div>

        {/* Pros & Cons */}
        {(neighborhood.pros.length > 0 || neighborhood.cons.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {neighborhood.pros.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-green-600 dark:text-green-400 mb-2 uppercase tracking-wide">
                  Highlights
                </h5>
                <ul className="space-y-1">
                  {neighborhood.pros.slice(0, 3).map((pro, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {neighborhood.cons.length > 0 && (
              <div>
                <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">
                  Consider
                </h5>
                <ul className="space-y-1">
                  {neighborhood.cons.slice(0, 3).map((con, i) => (
                    <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                      <Info className="w-3 h-3 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Similar Neighborhoods */}
        {neighborhood.similarTo.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Similar neighborhoods:
            </p>
            <div className="flex flex-wrap gap-2">
              {neighborhood.similarTo.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* View Details CTA */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Click for full details</span>
            <ChevronRight className="w-5 h-5 text-la-sunset-orange group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
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
