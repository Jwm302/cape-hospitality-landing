export interface PillarItem {
  id: string;
  columnNumber: number;
  title: string;
  description: string;
  iconName: string;
  focusAreas: string[];
  metricsSample: string;
}

export interface InspectionDeliverableData {
  title: string;
  description: string;
  slaHours: number;
  overallScore: number;
  propertyCategory: string;
  inspectionDate: string;
  pillarsScores: {
    name: string;
    score: number;
    benchmark: number;
  }[];
  sampleGaps: {
    category: string;
    severity: 'High' | 'Medium' | 'Low';
    finding: string;
    remedy: string;
  }[];
}

export interface PricingPackage {
  id: string;
  tierNumber: string;
  tier: string;
  title: string;
  tagline: string;
  description: string;
  isPopular?: boolean;
  additiveNote?: string;
  features: string[];
  idealFor: string;
  questionAnswered: string;
  ctaText: string;
  priceEur?: number;
  priceDisplay?: string;
  highlights?: string[];
}

export interface UspItem {
  key: string;
  title: string;
  description: string;
  icon: string;
  tagline: string;
}

export interface LeadFormData {
  name: string;
  company: string;
  corporateEmail: string;
  location?: string;
  portfolioSize?: string;
  primaryRegions?: string[];
  selectedTier?: string;
  notes?: string;
}
