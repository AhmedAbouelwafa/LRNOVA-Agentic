import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export interface CanvasTab {
  id: string;
  label: string;
  icon?: string;
}

export type AgentType = 'video' | 'text' | 'slides' | null;
export type PlanType = 'flash' | 'pro';

export interface Suggestion {
  id: string;
  icon: string;
  text: string;
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
  readonly tourStep = signal(1); // 1=Sidebar, 2=Prompt, 3=Attach, 4=Voice, 5=Agents, 6=Suggestions
  readonly attachedFiles = signal<File[]>([]);
  readonly chatHistory = signal<ChatMessage[]>([]);
  readonly selectedQuickTool = signal<string | null>(null);
  readonly canvasTabs = signal<CanvasTab[]>([]);
  readonly activeTabId = signal<string>('main');
  readonly toolSwitchWarning = signal<{ newTool: string, newPrompt: string } | null>(null);

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
    const tool = this.selectedQuickTool();
    
    if (!tool) {
      if (this.tourStep() === 8) {
        // Mock suggestions for the tour if nothing is selected
        return [
          { id: 'def1', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Generate a full course on Machine Learning' },
          { id: 'def2', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z', text: 'Create an explainer video about DNA' },
          { id: 'def3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Build an assessment quiz for Physics' }
        ];
      }
      return [];
    }

    switch (tool) {
      case 'Video':
        return [
          { id: 'v1', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z', text: 'Create an explainer video about DNA' },
          { id: 'v2', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Generate an AI Avatar presentation' },
          { id: 'v3', icon: 'M4 4h16v16H4z', text: 'Convert my script into a video lesson' }
        ];
      case 'Text Video':
        return [
          { id: 'tv1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Convert this article to a video' },
          { id: 'tv2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Summarize my notes into a video format' },
          { id: 'tv3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Create a story video from text' }
        ];
      case 'Script':
        return [
          { id: 'sc1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Write a YouTube script for learning Python' },
          { id: 'sc2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Draft a podcast script about history' },
          { id: 'sc3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Create a short script for a commercial' }
        ];
      case 'Assessment':
        return [
          { id: 'as1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Build an assessment quiz for Physics' },
          { id: 'as2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Create a math test for 5th grade' },
          { id: 'as3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Generate multiple choice questions on biology' }
        ];
      case 'Activity':
        return [
          { id: 'ac1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Design an interactive learning activity for Spanish' },
          { id: 'ac2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Create a group activity for team building' },
          { id: 'ac3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Brainstorm engaging activities for remote learning' }
        ];
      case 'Topic':
        return [
          { id: 'tp1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Explore the topic of Quantum Computing' },
          { id: 'tp2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Deep dive into Ancient Egypt' },
          { id: 'tp3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Learn about the basics of Economics' }
        ];
      case 'Full Course Script':
        return [
          { id: 'fc1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Generate a full course script for Digital Marketing' },
          { id: 'fc2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Draft a comprehensive script for a Leadership course' },
          { id: 'fc3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Write a full script for an introductory cooking class' }
        ];
      case 'Full Course Content':
        return [
          { id: 'fcc1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Generate a full course on Machine Learning' },
          { id: 'fcc2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Create comprehensive content for a Photography course' },
          { id: 'fcc3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Build a complete curriculum for Personal Finance' }
        ];
      case 'Projects':
        return [
          { id: 'pr1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Continue working on my last project' },
          { id: 'pr2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Review my recent video creations' },
          { id: 'pr3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Organize my course materials' }
        ];
      default:
        return [];
    }
  });

  readonly videoTools = ['Video Avatar', 'Scorm Video'];
  readonly textTools = ['Course Content', 'Script', 'Assessment', 'Topic', 'Activity'];

  readonly activeTools = computed(() => {
    return this.activeAgent() === 'video' ? this.videoTools : this.textTools;
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

    // Initialize canvas tabs with the first tab
    this.canvasTabs.set([{ id: 'main', label: text.slice(0, 30) || 'Workspace' }]);
    this.activeTabId.set('main');

    const tool = this.selectedQuickTool();
    const isVideo = tool === 'Video' || tool === 'Text Video' || this.activeAgent() === 'video';
    this.activeQuestionnaire = isVideo ? this.videoFollowUpQuestions : this.defaultQuestions;

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
    if (this.activeAgent() === 'video') {
      this.activeTool.set('Video Avatar');
    } else {
      this.activeTool.set('Course Content');
    }

    setTimeout(() => {
      this.router.navigate(['/results']);

      // Ask first clarification question
      setTimeout(() => {
        this.askNextQuestion(true);
      }, 800);
      
    }, 600);
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

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.activeQuestionnaire.length) {
      // Ask next question
      setTimeout(() => {
        this.askNextQuestion();
      }, 600);
    } else {
      // Finished all questions, now start the generation
      setTimeout(() => {
        this.startGenerationProcess();
      }, 500);
    }
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
    }, 1500);

    setTimeout(() => {
      clearInterval(this.fakeLoadingInterval);
      this.isGenerationComplete.set(true);
      this.isGenerating.set(false);
    }, 12000);
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
    this.toolSwitchWarning.set(null);
    this.submitPrompt();
  }

  cancelToolSwitch() {
    this.toolSwitchWarning.set(null);
  }

  startFollowUp(type: 'video' | 'text') {
    this.currentQuestionIndex = 0;
    this.activeQuestionnaire = type === 'video' ? this.videoFollowUpQuestions : [];
    
    if (this.activeQuestionnaire.length > 0) {
      this.askNextQuestion(true);
    } else {
      this.startGenerationProcess();
    }
  }
}
