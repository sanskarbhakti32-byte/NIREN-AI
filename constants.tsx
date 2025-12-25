
import React from 'react';
import { 
  FileText, 
  Camera, 
  Trash2, 
  Zap, 
  AlertTriangle, 
  Search, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Video 
} from 'lucide-react';
import { Tool, ToolID } from './types';

export const TOOLS: Tool[] = [
  {
    id: ToolID.ProductDesc,
    name: 'Product Desc Generator',
    description: 'Tone-aware SEO descriptions for Amazon & more.',
    icon: 'FileText',
    color: 'bg-blue-500'
  },
  {
    id: ToolID.ImageListing,
    name: 'Image-to-Listing',
    description: 'Analyze product photos for instant listing drafts.',
    icon: 'Camera',
    color: 'bg-indigo-500'
  },
  {
    id: ToolID.AdsWaste,
    name: 'Ads Waste Detector',
    description: 'Find zero-order, high-spend keywords in reports.',
    icon: 'Trash2',
    color: 'bg-red-500'
  },
  {
    id: ToolID.PromptGen,
    name: 'Ad Prompt Generator',
    description: 'Create high-converting image/video prompts.',
    icon: 'Zap',
    color: 'bg-yellow-500'
  },
  {
    id: ToolID.ProblemFinder,
    name: 'Listing Problem Finder',
    description: 'Fix CTR and conversion issues instantly.',
    icon: 'AlertTriangle',
    color: 'bg-orange-500'
  },
  {
    id: ToolID.KeywordCluster,
    name: 'Keyword Cluster Tool',
    description: 'Group hundreds of keywords by intent.',
    icon: 'Search',
    color: 'bg-green-500'
  },
  {
    id: ToolID.ReviewAnalyzer,
    name: 'Review Analyzer',
    description: 'Extract sizing, fabric & complaint trends.',
    icon: 'MessageSquare',
    color: 'bg-purple-500'
  },
  {
    id: ToolID.BrandVoice,
    name: 'Brand Voice Trainer',
    description: 'Train AI on your unique brand personality.',
    icon: 'Target',
    color: 'bg-pink-500'
  },
  {
    id: ToolID.BusinessInsights,
    name: 'Daily Insight Bot',
    description: 'Plain English summaries of your sales data.',
    icon: 'TrendingUp',
    color: 'bg-emerald-500'
  },
  {
    id: ToolID.ReelIdeas,
    name: 'Reel & Ad Ideas',
    description: '10 hooks and scripts for viral reach.',
    icon: 'Video',
    color: 'bg-cyan-500'
  }
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText size={20} />,
  Camera: <Camera size={20} />,
  Trash2: <Trash2 size={20} />,
  Zap: <Zap size={20} />,
  AlertTriangle: <AlertTriangle size={20} />,
  Search: <Search size={20} />,
  MessageSquare: <MessageSquare size={20} />,
  Target: <Target size={20} />,
  TrendingUp: <TrendingUp size={20} />,
  Video: <Video size={20} />
};
