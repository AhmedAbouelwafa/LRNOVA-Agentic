import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

import { CanvasTab, AgentType, PlanType, Suggestion, PipelineStep, Goal, ChatMessage } from '../models';

@Injectable({ providedIn: 'root' })
export class PromptStateService {
  readonly promptText = signal('');
  readonly submittedPrompt = signal('');
  readonly activeAgent = signal<AgentType>(null);
  readonly isPromptFocused = signal(false);
  readonly isGenerating = signal(false);
  readonly isGenerationComplete = signal(false);
  readonly isAnimatingOut = signal(false);
  readonly selectedPlan = signal<PlanType>('flash');
  readonly activeTool = signal('Course Content');
  readonly loadingText = signal('Thinking...');
  readonly tourStep = signal(1); // 1=Sidebar, 2=Prompt, 3=Attach, 4=Voice, 5=SingleGoals, 6=MultiGoals, 7=Suggestions
  readonly attachedFiles = signal<File[]>([]);
  readonly chatHistory = signal<ChatMessage[]>([]);
  readonly selectedQuickTool = signal<string | null>(null);
  readonly selectedGoal = signal<Goal | null>(null);
  readonly activeGoalLevel = signal<1 | 2>(1);
  readonly canvasTabs = signal<CanvasTab[]>([]);
  readonly activeTabId = signal<string>('main');
  readonly toolSwitchWarning = signal<{ newTool: string, newPrompt: string } | null>(null);
  readonly showVideoAvatarDialog = signal(false);
  readonly showTextVideoDialog = signal(false);
  readonly pendingVideoSubType = signal<'avatar' | 'text-video' | '2d-animation' | null>(null);

  /** The currently active (unanswered) questionnaire message, or null */
  readonly activeQuestion = computed(() => {
    const history = this.chatHistory();
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.type === 'questionnaire' && msg.questionnaire && !msg.questionnaire.answered) {
        return msg;
      }
    }
    return null;
  });

  private fakeLoadingInterval: any;
  private readonly fakeLoadingMessages = [
    'Thinking...',
    'Analyzing context...',
    'Querying AI agent cluster...',
    'Synthesizing learning vectors...',
    'Drafting educational content...',
    'Rendering interactive modules...',
    'Finalizing layout...'
  ];

  readonly suggestions = computed<Suggestion[]>(() => {
    const goal = this.selectedGoal();
    const quickTool = this.selectedQuickTool();
    
    if (quickTool === 'Activity' || (goal && goal.pipeline && goal.pipeline.some(p => p.toolId === 'Activity'))) {
      return [
        { id: 'act1', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', text: 'Ice Breakers', prompt: 'Create a fun ice breaker activity to get students introduced to each other.' },
        { id: 'act2', icon: 'M13 10V3L4 14h7v7l9-11h-7z', text: 'Energizers', prompt: 'Design a quick 5-minute energizer activity to wake up the classroom.' },
        { id: 'act3', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Quizzes & Polls', prompt: 'Generate a short interactive poll or quiz to gauge student understanding.' },
        { id: 'act4', icon: 'M11.5 21A9.5 9.5 0 1 0 2 11.5a9.5 9.5 0 0 0 9.5 9.5z M11.5 6v5.5l4.5 4.5', text: 'Game', prompt: 'Develop an educational game related to the core topic.' },
        { id: 'act5', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Tasks', prompt: 'Provide a set of clear, actionable tasks for students to complete independently.' },
        { id: 'act6', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', text: 'Roleplay', prompt: 'Design a roleplay scenario where students act out a real-world situation.' },
        { id: 'act7', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Experiment', prompt: 'Outline a hands-on experiment that students can perform to test the theory.' },
        { id: 'act8', icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', text: 'Group Discussions', prompt: 'Create guided discussion questions for small groups to debate.' },
        { id: 'act9', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Writing Exercises', prompt: 'Draft a creative writing exercise to help students reflect on the topic.' },
        { id: 'act10', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Problem-solving Tasks', prompt: 'Formulate a complex problem-solving task for students to solve.' },
        { id: 'act11', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z', text: 'Case Studies', prompt: 'Write a detailed real-world case study for students to analyze.' },
        { id: 'act12', icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75', text: 'Collaborative Projects', prompt: 'Design a collaborative project where students work together over a week.' },
        { id: 'act13', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', text: 'Individual Projects', prompt: 'Outline an individual research project for students to complete.' },
        { id: 'act14', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Collaborative Presentations', prompt: 'Set up a task for students to create and deliver a group presentation.' },
        { id: 'act15', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Individual Presentations', prompt: 'Provide guidelines for an individual student presentation.' },
        { id: 'act16', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Peer Reviews', prompt: 'Create a peer review rubric and activity for students to evaluate each other.' }
      ];
    }

    // When a specific tool is selected (e.g. from the Apps page dropdown), show tool-specific suggestions
    if (quickTool && !goal) {
      switch (quickTool) {
        case 'Video Avatar':
          return [
            { id: 'ex1', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Quantum Entanglement', prompt: 'Explain quantum entanglement', videoSubType: 'avatar' },
            { id: 'ex2', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'DNA Explained', prompt: 'Create an explainer video about DNA', videoSubType: 'avatar' },
            { id: 'ex3', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Solar System Tour', prompt: 'Explain the solar system and its planets', videoSubType: 'avatar' }
          ];
        case 'Text Video':
          return [
            { id: 'tv1', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'Python Tutorial', prompt: 'Create a video lesson for learning Python', videoSubType: 'text-video' },
            { id: 'tv2', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'History of Rome', prompt: 'Make a documentary-style video about the history of Rome', videoSubType: 'text-video' },
            { id: 'tv3', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'Climate Change', prompt: 'Generate a text video explaining climate change', videoSubType: 'text-video' }
          ];
        case 'Script':
          return [
            { id: 'sc1', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Python Script', prompt: 'Write a YouTube script for learning Python' },
            { id: 'sc2', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'History Podcast', prompt: 'Draft a podcast script about history' },
            { id: 'sc3', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Commercial Script', prompt: 'Create a short script for a commercial' }
          ];
        case 'Assessment':
          return [
            { id: 'ts1', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Physics Quiz', prompt: 'Build an assessment quiz for Physics' },
            { id: 'ts2', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Math Test (5th Grade)', prompt: 'Create a math test for 5th grade' },
            { id: 'ts3', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Biology MCQ', prompt: 'Generate multiple choice questions on biology' }
          ];
        case 'Topic':
          return [
            { id: 'ex1', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Quantum Entanglement', prompt: 'Explain quantum entanglement' },
            { id: 'ex2', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Combustion Engine', prompt: 'How does a combustion engine work?' },
            { id: 'ex3', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Inflation Basics', prompt: 'Explain inflation to a 5-year-old' }
          ];
        case 'Slides':
          return [
            { id: 'sl1', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Marketing Pitch', prompt: 'Generate slides for a marketing pitch' },
            { id: 'sl2', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Climate Change', prompt: 'Create a presentation on climate change' },
            { id: 'sl3', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'QBR Slides', prompt: 'Design slides for quarterly business review' }
          ];
        case 'Full Course Script':
          return [
            { id: 'fc1', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Digital Marketing Course', prompt: 'Create a full course on Digital Marketing' },
            { id: 'fc2', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Leadership Training', prompt: 'Design a comprehensive Leadership training' },
            { id: 'fc3', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Cooking Class', prompt: 'Develop an introductory cooking class' }
          ];
        case 'Full Course Content':
          return [
            { id: 'fc1', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Digital Marketing Course', prompt: 'Create a full course on Digital Marketing' },
            { id: 'fc2', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Leadership Training', prompt: 'Design a comprehensive Leadership training' },
            { id: 'fc3', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Cooking Class', prompt: 'Develop an introductory cooking class' }
          ];
        default:
          // Activity is already handled above; fall through to defaults
          break;
      }
    }

    if (!goal) {
      return [
        { id: 'def1', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z', text: 'DNA Video', prompt: 'Create an explainer video about DNA' },
        { id: 'def2', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Python Script', prompt: 'Write a YouTube script for learning Python' },
        { id: 'def3', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Physics Quiz', prompt: 'Build an assessment quiz for Physics' }
      ];
    }

    switch (goal.id) {
      case 'explain-it':
        return [
          { id: 'ex1', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Quantum Entanglement', prompt: 'Explain quantum entanglement' },
          { id: 'ex2', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Combustion Engine', prompt: 'How does a combustion engine work?' },
          { id: 'ex3', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Inflation Basics', prompt: 'Explain inflation to a 5-year-old' }
        ];
      case 'script-it':
        return [
          { id: 'sc1', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Python Script', prompt: 'Write a YouTube script for learning Python' },
          { id: 'sc2', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'History Podcast', prompt: 'Draft a podcast script about history' },
          { id: 'sc3', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Commercial Script', prompt: 'Create a short script for a commercial' }
        ];
      case 'test-it':
        return [
          { id: 'ts1', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Physics Quiz', prompt: 'Build an assessment quiz for Physics' },
          { id: 'ts2', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Math Test (5th Grade)', prompt: 'Create a math test for 5th grade' },
          { id: 'ts3', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Biology MCQ', prompt: 'Generate multiple choice questions on biology' }
        ];
      case 'slides':
        return [
          { id: 'sl1', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Marketing Pitch', prompt: 'Generate slides for a marketing pitch' },
          { id: 'sl2', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'Climate Change', prompt: 'Create a presentation on climate change' },
          { id: 'sl3', icon: 'M2 3h20v14H2z M2 7h20 M8 21h8 M12 17v4', text: 'QBR Slides', prompt: 'Design slides for quarterly business review' }
        ];
      case 'video-clip':
        return [
          { id: 'vc1', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z', text: 'Video Avatar', prompt: 'Create a Video Avatar', videoSubType: 'avatar' },
          { id: 'vc2', icon: 'M4 6h16v10H4z M2 6h20 M9 21h6 M12 16v5 M7 10h2 M15 10h2', text: 'Text Video', prompt: 'Generate a Text Video', videoSubType: 'text-video' },
          { id: 'vc3', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: '2D Animation', prompt: 'Make a 2D Animation', videoSubType: '2d-animation' }
        ];
      case 'full-course':
        return [
          { id: 'fc1', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Digital Marketing Course', prompt: 'Create a full course on Digital Marketing' },
          { id: 'fc2', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Leadership Training', prompt: 'Design a comprehensive Leadership training' },
          { id: 'fc3', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Cooking Class', prompt: 'Develop an introductory cooking class' }
        ];
      case 'video-course':
        return [
          { id: 'vcrs1', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Finance Video Course', prompt: 'Create a video course on personal finance' },
          { id: 'vcrs2', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Excel Video Tutorials', prompt: 'Design a video tutorial series for Excel' },
          { id: 'vcrs3', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Photography Masterclass', prompt: 'Develop a video masterclass on photography' }
        ];
      case 'learn-kit':
        return [
          { id: 'lk1', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'Spanish Basics Kit', prompt: 'Generate a learning kit for Spanish basics' },
          { id: 'lk2', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'World Geography Guide', prompt: 'Create a study guide for world geography' },
          { id: 'lk3', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'Guitar Learning Kit', prompt: 'Compile a resource kit for learning guitar' }
        ];
      default:
        return [];
    }
  });


  readonly videoTools = ['Video Avatar', 'Text Video'];
  readonly textTools = ['Script', 'Assessment', 'Activity', 'Topic', 'Course Script', 'Course Content'];

  readonly activeTools = computed(() => {
    return this.activeAgent() === 'video' ? this.videoTools : this.textTools;
  });

  /**
   * Determines the type of result to display in the canvas.
   * 'video' — video player, 'slides' — embedded slides, 'text' — generated text content
   */
  readonly resultType = computed<'video' | 'slides' | 'text'>(() => {
    const agent = this.activeAgent();
    const tool = this.selectedQuickTool();
    const goal = this.selectedGoal();
    const tabId = this.activeTabId();

    // If we're in a multi-tool goal and looking at a specific tab
    if (goal?.level === 2 && tabId && tabId !== 'main') {
      if (tabId.includes('video')) return 'video';
      if (tabId.includes('slides')) return 'slides';
      return 'text'; // Default to text for script, assessment, content, activity
    }

    // Video agent or video-related tools/goals
    if (agent === 'video' || tool === 'Video Avatar' || tool === 'Text Video') return 'video';
    if (goal?.id === 'video-clip') return 'video';

    // Slides agent, slides tool, or slides goal
    if (agent === 'slides' || tool === 'Slides' || goal?.id === 'slides') return 'slides';

    // Everything else is text (including 'main' tab of multi-tool goals)
    return 'text';
  });

  constructor(private router: Router) {}

  selectAgent(agent: 'video' | 'text' | 'slides') {
    if (this.activeAgent() === agent) {
      this.activeAgent.set(null);
    } else {
      this.activeAgent.set(agent);
    }
  }

  togglePlan(event: Event) {
    event.stopPropagation();
    this.selectedPlan.update(p => p === 'flash' ? 'pro' : 'flash');
  }

  addFiles(files: FileList | File[] | null) {
    if (!files) return;
    const current = this.attachedFiles();
    const newFiles = Array.from(files);
    this.attachedFiles.set([...current, ...newFiles]);
  }

  removeFile(index: number) {
    const current = this.attachedFiles();
    const updated = [...current];
    updated.splice(index, 1);
    this.attachedFiles.set(updated);
  }

  private currentQuestionIndex = 0;
  private activeQuestionnaire: any[] = [];
  private defaultQuestions = [
    {
      title: 'Who is this lesson for?',
      options: [
        { id: 1, label: 'Elementary school students (ages 8-11)' },
        { id: 2, label: 'Middle school students (ages 11-14)' },
        { id: 3, label: 'High school students (ages 14-18)' },
        { id: 4, label: 'College / university students' },
        { id: 5, label: 'General adult audience' }
      ]
    },
    {
      title: 'What should the primary tone be?',
      options: [
        { id: 1, label: 'Fun and engaging' },
        { id: 2, label: 'Professional and formal' },
        { id: 3, label: 'Inspirational and storytelling' }
      ]
    },
    {
      title: 'How long should the video be?',
      options: [
        { id: 1, label: 'Short summary (1-2 minutes)' },
        { id: 2, label: 'Standard overview (3-5 minutes)' },
        { id: 3, label: 'In-depth explanation (10+ minutes)' }
      ]
    },
    {
      title: 'Do you want to include a quiz at the end?',
      options: [
        { id: 1, label: 'Yes, add a quick assessment' },
        { id: 2, label: 'No, just the lesson content' }
      ]
    }
  ];

  private videoFollowUpQuestions = [
    {
      title: 'Select Avatar',
      options: [
        { id: 1, label: 'Male Professional', image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=150&q=80' },
        { id: 2, label: 'Female Professional', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80' },
        { id: 3, label: 'Casual Male', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
        { id: 4, label: 'Casual Female', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80' }
      ]
    },
    {
      title: 'Select Audio',
      options: [
        { id: 1, label: 'English - Male (Deep)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
        { id: 2, label: 'English - Female (Clear)', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
        { id: 3, label: 'Arabic - Male', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
        { id: 4, label: 'Arabic - Female', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
      ]
    }
  ];

  submitPrompt() {
    const text = this.promptText();
    // Allow submission if text OR files exist
    if (!text.trim() && this.attachedFiles().length === 0) return;

    this.submittedPrompt.set(text);
    this.isAnimatingOut.set(true);
    this.currentQuestionIndex = 0;

    // Initialize canvas tabs with the first tab or the project pipeline
    const goal = this.selectedGoal();
    if (goal && goal.level === 2 && goal.pipeline) {
      const tabs = [
        { id: 'main', label: 'Overview' },
        ...goal.pipeline.map((step, idx) => ({
          id: `tab-${step.toolId.toLowerCase().replace(/\s+/g, '-')}-${idx}`,
          label: step.tabLabel
        }))
      ];
      this.canvasTabs.set(tabs);
      this.activeTabId.set('main');
    } else {
      this.canvasTabs.set([{ id: 'main', label: text.slice(0, 30) || 'Workspace' }]);
      this.activeTabId.set('main');
    }

    const tool = this.selectedQuickTool();
    const subType = this.pendingVideoSubType();
    const hasVideoWord = !tool && !goal && text.toLowerCase().includes('video');
    const isVideo = tool === 'Video Avatar' || tool === 'Text Video' || this.activeAgent() === 'video' || hasVideoWord;
    const isVideoClipGoal = goal?.id === 'video-clip';
    const isVideoAvatarTool = tool === 'Video Avatar';
    const isTextVideoTool = tool === 'Text Video';

    // If user selected a specific video-clip suggestion with a sub-type, or a specific video tool directly,
    // skip the "What video do you want?" questionnaire and go straight to the dialog
    if ((isVideoClipGoal && subType) || isVideoAvatarTool || isTextVideoTool) {
      // Add initial prompt to chat history
      if (text.trim()) {
        this.chatHistory.set([{
          id: Date.now().toString(),
          role: 'user',
          content: text,
          timestamp: new Date()
        }]);
      }

      this.activeTool.set(tool || 'Video Avatar');
      this.router.navigate(['/results']);

      const actualSubType = subType || (isVideoAvatarTool ? 'avatar' : (isTextVideoTool ? 'text-video' : null));

      // Add agent acknowledgement
      this.chatHistory.update(history => [...history, {
        id: Date.now().toString() + '-ack',
        role: 'agent',
        content: 'Great choice! Let me set up your ' + (actualSubType === 'avatar' ? 'AI Avatar' : actualSubType === 'text-video' ? 'Text Video' : '2D Animation') + ' video.',
        timestamp: new Date()
      }]);

      // Open the correct dialog after a short delay for the navigation to settle
      setTimeout(() => {
        if (actualSubType === 'avatar') {
          this.showVideoAvatarDialog.set(true);
        } else if (actualSubType === 'text-video') {
          this.showTextVideoDialog.set(true);
        } else {
          // 2D Animation: use default questionnaire flow
          this.activeQuestionnaire = this.defaultQuestions;
          this.askNextQuestion(true);
        }
        this.pendingVideoSubType.set(null);
      }, 500);
      return;
    }

    if (hasVideoWord) {
      this.activeQuestionnaire = [
        {
          title: 'What video do you want?',
          options: [
            { id: 1, label: 'Video Avatar' },
            { id: 2, label: 'Text Video' },
            { id: 3, label: '2D Animation' }
          ]
        },
        ...this.videoFollowUpQuestions
      ];
    } else if (isVideoClipGoal) {
      // Video clip goal without a specific sub-type: ask what kind of video
      this.activeQuestionnaire = [
        {
          title: 'What video do you want?',
          options: [
            { id: 1, label: 'Video Avatar' },
            { id: 2, label: 'Text Video' },
            { id: 3, label: '2D Animation' }
          ]
        },
        ...this.videoFollowUpQuestions
      ];
    } else {
      this.activeQuestionnaire = isVideo ? this.videoFollowUpQuestions : this.defaultQuestions;
    }

    // Add initial prompt to chat history
    if (text.trim()) {
      this.chatHistory.set([{
        id: Date.now().toString(),
        role: 'user',
        content: text,
        timestamp: new Date()
      }]);
    }

    // Set default active tool based on agent
    if (this.activeAgent() === 'video' || isVideoClipGoal) {
      this.activeTool.set('Video Avatar');
    } else {
      this.activeTool.set('Course Content');
    }

    this.router.navigate(['/results']);

    // Ask first clarification question
    this.askNextQuestion(true);
  }

  private askNextQuestion(isFirst: boolean = false) {
    const q = this.activeQuestionnaire[this.currentQuestionIndex];
    const total = this.activeQuestionnaire.length;
    
    this.chatHistory.update(history => [...history, {
      id: Date.now().toString(),
      role: 'agent',
      content: isFirst ? 'Great topic! Let me ask a few questions to make sure we build the right content.' : '',
      type: 'questionnaire',
      questionnaire: {
        title: q.title,
        options: q.options,
        answered: false,
        step: this.currentQuestionIndex + 1,
        totalSteps: total
      },
      timestamp: new Date()
    }]);
  }

  answerQuestionnaire(messageId: string, answerLabel?: string) {
    // Mark questionnaire as answered
    this.chatHistory.update(history => 
      history.map(msg => 
        msg.id === messageId && msg.questionnaire 
          ? { ...msg, questionnaire: { ...msg.questionnaire, answered: true } }
          : msg
      )
    );

    if (answerLabel === 'Video Avatar') {
      this.showVideoAvatarDialog.set(true);
      return;
    }
    
    if (answerLabel === 'Text Video') {
      this.showTextVideoDialog.set(true);
      return;
    }

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.activeQuestionnaire.length) {
      // Ask next question
      this.askNextQuestion();
    } else {
      // Finished all questions, now start the generation
      this.startGenerationProcess();
    }
  }

  confirmVideoAvatarDialog(data: any) {
    this.showVideoAvatarDialog.set(false);
    this.addFollowUpMessage('Configured Video Avatar: ' + data.avatar.label + ', ' + data.audio.label, 'user');
    this.startGenerationProcess();
  }

  cancelVideoAvatarDialog() {
    this.showVideoAvatarDialog.set(false);
    this.startGenerationProcess();
  }

  confirmTextVideoDialog(data: any) {
    this.showTextVideoDialog.set(false);
    this.addFollowUpMessage(`Configured Text Video: Style ${data.style.label}, Duration ${data.duration}`, 'user');
    this.startGenerationProcess();
  }

  cancelTextVideoDialog() {
    this.showTextVideoDialog.set(false);
    this.startGenerationProcess();
  }

  private startGenerationProcess() {
    this.isGenerating.set(true);
    
    // Cycle through fake loading messages
    let msgIndex = 0;
    this.loadingText.set(this.fakeLoadingMessages[0]);
    this.fakeLoadingInterval = setInterval(() => {
      msgIndex++;
      if (msgIndex < this.fakeLoadingMessages.length) {
        this.loadingText.set(this.fakeLoadingMessages[msgIndex]);
      } else {
        clearInterval(this.fakeLoadingInterval);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(this.fakeLoadingInterval);
      this.isGenerationComplete.set(true);
      this.isGenerating.set(false);
    }, 4000);
  }

  addFollowUpMessage(content: string, role: 'user' | 'agent') {
    this.chatHistory.update(history => [
      ...history,
      {
        id: Date.now().toString() + Math.random().toString(36).substring(7),
        role,
        content,
        timestamp: new Date()
      }
    ]);
  }

  goHome() {
    this.isGenerating.set(false);
    this.isGenerationComplete.set(false);
    this.isAnimatingOut.set(false);
    this.promptText.set('');
    this.submittedPrompt.set('');
    this.attachedFiles.set([]);
    this.chatHistory.set([]);
    this.canvasTabs.set([]);
    this.activeTabId.set('main');
    this.selectedGoal.set(null);
    this.selectedQuickTool.set(null);
    this.pendingVideoSubType.set(null);
    this.router.navigate(['/']);
  }

  addCanvasTab(label: string): void {
    const id = 'tab-' + Date.now();
    this.canvasTabs.update(tabs => [...tabs, { id, label: label.slice(0, 30) }]);
    this.activeTabId.set(id);
  }

  setActiveTab(id: string): void {
    this.activeTabId.set(id);
  }

  removeCanvasTab(id: string): void {
    this.canvasTabs.update(tabs => tabs.filter(t => t.id !== id));
    if (this.activeTabId() === id) {
      const remaining = this.canvasTabs();
      this.activeTabId.set(remaining.length > 0 ? remaining[0].id : 'main');
    }
  }

  confirmToolSwitch() {
    const warning = this.toolSwitchWarning();
    if (!warning) return;
    
    this.chatHistory.set([]);
    this.canvasTabs.set([]);
    this.activeTabId.set('main');
    
    this.promptText.set(warning.newPrompt);
    this.selectedQuickTool.set(warning.newTool);
    this.selectedGoal.set(null);
    this.activeGoalLevel.set(1);
    this.toolSwitchWarning.set(null);
    this.submitPrompt();
  }

  cancelToolSwitch() {
    this.toolSwitchWarning.set(null);
  }

  startFollowUp(type: 'video' | 'text', hasVideoWord: boolean = false) {
    this.currentQuestionIndex = 0;
    
    if (type === 'video') {
      if (hasVideoWord) {
        this.activeQuestionnaire = [
          {
            title: 'What video do you want?',
            options: [
              { id: 1, label: 'Video Avatar' },
              { id: 2, label: 'Text Video' },
              { id: 3, label: '2D Animation' }
            ]
          },
          ...this.videoFollowUpQuestions
        ];
      } else {
        this.activeQuestionnaire = this.videoFollowUpQuestions;
      }
    } else {
      this.activeQuestionnaire = [];
    }
    
    if (this.activeQuestionnaire.length > 0) {
      this.askNextQuestion(true);
    } else {
      this.startGenerationProcess();
    }
  }
}
