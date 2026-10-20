export type ServiceTierKey = 'VIRTUAL_AUDIT' | 'PHYSICAL_AUDIT' | 'PARTNERSHIP';

export interface ServiceTier {
  key: ServiceTierKey;
  tierNumber: string;
  badge: string;
  badgeColor: string;
  title: string;
  shortLabel: string;
  tagline: string;
  description: string;
  isFree?: boolean;
  isPopular?: boolean;
  priceDisplay: string;
  ctaText: string;
  features: string[];
  questionAnswered: string;
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
