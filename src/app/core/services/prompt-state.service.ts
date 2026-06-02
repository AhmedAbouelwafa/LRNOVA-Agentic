import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';

export type AgentType = 'video' | 'text' | null;
export type PlanType = 'flash' | 'pro';

export interface Suggestion {
  id: string;
  icon: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class PromptStateService {
  readonly promptText = signal('');
  readonly submittedPrompt = signal('');
  readonly activeAgent = signal<AgentType>(null);
  readonly isPromptFocused = signal(false);
  readonly isGenerating = signal(false);
  readonly isAnimatingOut = signal(false);
  readonly selectedPlan = signal<PlanType>('flash');
  readonly activeTool = signal('Course Content');
  readonly loadingText = signal('Thinking...');

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

  selectAgent(agent: 'video' | 'text') {
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

  submitPrompt() {
    const text = this.promptText();
    if (!text.trim()) return;

    this.submittedPrompt.set(text);
    this.isAnimatingOut.set(true);

    // Set default active tool based on agent
    if (this.activeAgent() === 'video') {
      this.activeTool.set('Video Avatar');
    } else {
      this.activeTool.set('Course Content');
    }

    setTimeout(() => {
      this.isGenerating.set(true);
      this.router.navigate(['/results']);

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
      }, 12000);
    }, 600);
  }

  goHome() {
    this.isGenerating.set(false);
    this.isAnimatingOut.set(false);
    this.promptText.set('');
    this.submittedPrompt.set('');
    this.router.navigate(['/']);
  }
}
