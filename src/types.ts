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
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  priceEur: number;
  title: string;
  subtitle: string;
  recommended?: boolean;
  features: string[];
  idealFor: string;
  turnaround: string;
  delivery?: string;
  minimumContract?: string;
  ctaText?: string;
  footnote?: string;
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
