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
  isPreferences?: boolean;
  questionnaire?: {
    title: string;
    options: { id: number; label: string; image?: string; audio?: string; description?: string }[];
    answered?: boolean;
    /** The answer the user selected or typed */
    selectedAnswer?: string;
    step?: number;
    totalSteps?: number;
    /** When true, show a textarea for user to write their own script */
    isScriptInput?: boolean;
    /** When true, show a script review panel with approve/edit actions */
    isScriptReview?: boolean;
    /** When true, render the script review in the canvas panel instead of chat */
    showInCanvas?: boolean;
    /** The script content (AI-generated or user-written) */
    scriptContent?: string;
    /** When true, show a file upload input instead of radio options */
    isFileUpload?: boolean;
    /** Accepted file types for upload (e.g. 'audio/*') */
    acceptFileTypes?: string;
    /** Disable the "Type your own answer" option */
    disableManualInput?: boolean;
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
