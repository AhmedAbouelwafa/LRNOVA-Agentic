export interface CanvasTab {
  id: string;
  label: string;
  icon?: string;
}

export type AgentType = 'video' | 'text' | 'slides' | null;
export type PlanType = 'flash' | 'pro';
export type Lang = 'en' | 'ar';

export interface Suggestion {
  id: string;
  icon: string;
  text: string;
  prompt: string;
  videoSubType?: 'avatar' | 'text-video' | '2d-animation';
}

export interface PipelineStep {
  toolId: string;
  tabLabel: string;
  order: number;
}

export interface Goal {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  level: 1 | 2;
  gradient: string;
  accentColor: string;
  pipeline: PipelineStep[];
  estimatedTime: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  type?: 'text' | 'questionnaire';
  questionnaire?: {
    title: string;
    options: { id: number; label: string; image?: string; audio?: string }[];
    answered?: boolean;
    step?: number;
    totalSteps?: number;
  };
}

export interface ProjectCard {
  id: string;
  title: string;
  goalId: string;
  prompt: string;
  date: Date;
  image: string;
}

export interface AppTool {
  id: string;
  slug: string;
  label: string;
  desc: string;
  icon: string;
  gradient: string;
  accentColor: string;
  image: string;
}
