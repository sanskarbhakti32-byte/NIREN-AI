
export enum ToolID {
  ProductDesc = 'PRODUCT_DESC',
  ImageListing = 'IMAGE_LISTING',
  AdsWaste = 'ADS_WASTE',
  PromptGen = 'PROMPT_GEN',
  ProblemFinder = 'PROBLEM_FINDER',
  KeywordCluster = 'KEYWORD_CLUSTER',
  ReviewAnalyzer = 'REVIEW_ANALYZER',
  BrandVoice = 'BRAND_VOICE',
  BusinessInsights = 'BUSINESS_INSIGHTS',
  ReelIdeas = 'REEL_IDEAS'
}

export interface Tool {
  id: ToolID;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface AnalysisResult {
  title?: string;
  bullets?: string[];
  keywords?: string[];
  description?: string;
  confidence?: number;
  recommendations?: string[];
  intentGroups?: Record<string, string[]>;
  insights?: string[];
}
