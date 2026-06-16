import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

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
    options: { id: number; label: string }[];
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
    const agent = this.activeAgent();
    if (agent === 'video') {
      return [
        { id: 'v1', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z', text: 'Create an explainer video about DNA' },
        { id: 'v2', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Generate an AI Avatar presentation' },
        { id: 'v3', icon: 'M4 4h16v16H4z', text: 'Convert my script into a video lesson' }
      ];
    } else if (agent === 'text') {
      return [
        { id: 't1', icon: 'M4 4h16v16H4z M12 8v8 M8 12h8', text: 'Generate a full course on Machine Learning' },
        { id: 't2', icon: 'M9 12h6 M9 16h6 M4 4h16v16H4z', text: 'Draft a lesson plan for 5th grade math' },
        { id: 't3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Build an assessment quiz for Physics' }
      ];
    }
    return [
      { id: 'n1', icon: 'M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', text: 'Generate a full course on Machine Learning' },
      { id: 'n2', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z M4 6h10a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z', text: 'Create an explainer video about DNA' },
      { id: 'n3', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Build an assessment quiz for Physics' }
    ];
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
  private clarificationQuestions = [
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

  submitPrompt() {
    const text = this.promptText();
    // Allow submission if text OR files exist
    if (!text.trim() && this.attachedFiles().length === 0) return;

    this.submittedPrompt.set(text);
    this.isAnimatingOut.set(true);
    this.currentQuestionIndex = 0;

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
    const q = this.clarificationQuestions[this.currentQuestionIndex];
    const total = this.clarificationQuestions.length;
    
    this.chatHistory.update(history => [...history, {
      id: Date.now().toString(),
      role: 'agent',
      content: isFirst ? 'Great topic! Let me ask a few questions to make sure we build the right content.' : 'Got it. Next question:',
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

    // If user selected an answer, add it as a user message
    if (answerLabel) {
      this.addFollowUpMessage(answerLabel, 'user');
    } else {
      this.addFollowUpMessage('Skip', 'user');
    }

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex < this.clarificationQuestions.length) {
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
    this.router.navigate(['/']);
  }
}
