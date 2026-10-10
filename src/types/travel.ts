export type CategoryType = 'all' | 'culture' | 'food' | 'nature' | 'coastal';

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  category: 'culture' | 'food' | 'nature' | 'coastal';
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  location: string;
  tags: string[];
  bestTime: string;
  recommendedDuration: string;
  priceLevel: '$' | '$$' | '$$$' | 'Free';
  coordinates: {
    lat: number;
    lng: number;
    x: number; // 0-100% position on interactive visual map
    y: number; // 0-100% position on interactive visual map
  };
  highlights: string[];
  insiderTip: string;
  mustTryFood: string[];
  openingHours: string;
}

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night Supper';
export type ActivityCategory = 'food' | 'culture' | 'nature' | 'relaxation' | 'adventure' | 'coastal';

export interface Activity {
  id: string;
  timeSlot: TimeSlot;
  time: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: string;
  costEstimate: string;
  duration: string;
  insiderTip: string;
  transportToNext?: string;
  coordinates: {
    x: number; // 0-100%
    y: number; // 0-100%
    lat: number;
    lng: number;
  };
}

export interface ItineraryDay {
  dayNumber: number;
  theme: string;
  dateLabel: string;
  activities: Activity[];
}

export interface Itinerary {
  title: string;
  destination: string;
  durationDays: number;
  travelStyle: string;
  budget: string;
  pace: string;
  summary: string;
  highlights: string[];
  weatherSummary: string;
  packingEssentials: string[];
  estimatedBudgetUSD: string;
  days: ItineraryDay[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  isFallback?: boolean;
}
