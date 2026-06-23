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
  readonly tourStep = signal(1); // 1=Sidebar, 2=Prompt, 3=Attach, 4=Voice, 5=Agents, 6=Suggestions
  readonly attachedFiles = signal<File[]>([]);
  readonly chatHistory = signal<ChatMessage[]>([]);
  readonly selectedQuickTool = signal<string | null>(null);
  readonly selectedGoal = signal<Goal | null>(null);
  readonly activeGoalLevel = signal<1 | 2>(1);
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
    const goal = this.selectedGoal();
    
    if (!goal) {
      return [
        { id: 'def1', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z', text: 'Create an explainer video about DNA' },
        { id: 'def2', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Write a YouTube script for learning Python' },
        { id: 'def3', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Build an assessment quiz for Physics' }
      ];
    }

    switch (goal.id) {
      case 'explain-it':
        return [
          { id: 'ex1', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Explain quantum entanglement' },
          { id: 'ex2', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'How does a combustion engine work?' },
          { id: 'ex3', icon: 'M9 18h6 M10 22h4 M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z', text: 'Explain inflation to a 5-year-old' }
        ];
      case 'script-it':
        return [
          { id: 'sc1', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Write a YouTube script for learning Python' },
          { id: 'sc2', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Draft a podcast script about history' },
          { id: 'sc3', icon: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z', text: 'Create a short script for a commercial' }
        ];
      case 'test-it':
        return [
          { id: 'ts1', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Build an assessment quiz for Physics' },
          { id: 'ts2', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Create a math test for 5th grade' },
          { id: 'ts3', icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11', text: 'Generate multiple choice questions on biology' }
        ];
      case 'video-clip':
        return [
          { id: 'vc1', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'Create an explainer video about DNA' },
          { id: 'vc2', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'Generate an AI Avatar presentation' },
          { id: 'vc3', icon: 'M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14v-4z M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z', text: 'Convert my script into a video lesson' }
        ];
      case 'full-course':
        return [
          { id: 'fc1', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Create a full course on Digital Marketing' },
          { id: 'fc2', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Design a comprehensive Leadership training' },
          { id: 'fc3', icon: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5', text: 'Develop an introductory cooking class' }
        ];
      case 'video-course':
        return [
          { id: 'vcrs1', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Create a video course on personal finance' },
          { id: 'vcrs2', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Design a video tutorial series for Excel' },
          { id: 'vcrs3', icon: 'M19 2H5a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V5a3 3 0 0 0-3-3z M2 7h20M2 17h20M7 2v5M17 2v5M7 17v5M17 17v5', text: 'Develop a video masterclass on photography' }
        ];
      case 'learn-kit':
        return [
          { id: 'lk1', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'Generate a learning kit for Spanish basics' },
          { id: 'lk2', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'Create a study guide for world geography' },
          { id: 'lk3', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', text: 'Compile a resource kit for learning guitar' }
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

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.activeQuestionnaire.length) {
      // Ask next question
      this.askNextQuestion();
    } else {
      // Finished all questions, now start the generation
      this.startGenerationProcess();
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
