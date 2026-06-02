import { Component, signal, computed, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  protected readonly title = signal('LRNOVA');
  protected promptText = '';
  protected submittedPrompt = '';
  protected activeAgent = signal<'video' | 'text' | null>(null);
  protected isPromptFocused = signal(false);
  protected isGenerating = signal(false);
  protected selectedPlan = signal<'flash' | 'pro'>('flash');
  protected isPlanMenuOpen = signal(false);
  protected activeTool = signal('Course Content');
  protected loadingText = signal('Thinking...');

  private fakeLoadingInterval: any;
  private fakeLoadingMessages = [
    'Thinking...',
    'Analyzing context...',
    'Querying AI agent cluster...',
    'Synthesizing learning vectors...',
    'Drafting educational content...',
    'Rendering interactive modules...',
    'Finalizing layout...'
  ];

  // Suggestions
  protected suggestions = computed(() => {
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

  // Placeholder
  protected typedPlaceholder = signal('Describe what you want to create...');
  private phIndex = 0;
  private phCharIndex = 0;
  private phIsDeleting = false;
  private phPhrases = [
    'Describe what you want to create...',
    'Try: "A 5-minute video on DNA"',
    'Try: "A full course about Python"'
  ];

  @ViewChild('particleCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  protected typedHeadline = signal('Experiences');

  private phrases = [
    'Experiences',
    'LRNOVA Courses',
    'Interactive 3D',
    'LRNOVA AI Videos',
    'Smart Assessments'
  ];
  private phraseIndex = 0;
  private charIndex = 11; // Length of 'Experiences'
  private isDeleting = true;
  private typingSpeed = 100;
  private deletingSpeed = 60;
  private delayBetweenPhrases = 2000;

  private particles: Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; hue: number;
  }> = [];
  private animationId = 0;
  private mouseX = 0;
  private mouseY = 0;

  ngAfterViewInit() {
    this.initParticles();
    setTimeout(() => this.startTypewriter(), this.delayBetweenPhrases);
    setTimeout(() => this.startPlaceholderTypewriter(), 3000);
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  useSuggestion(text: string) {
    this.promptText = text;
    this.isPromptFocused.set(true);
  }

  private startPlaceholderTypewriter() {
    const currentPhrase = this.phPhrases[this.phIndex];

    if (this.phIsDeleting) {
      this.typedPlaceholder.set(currentPhrase.substring(0, this.phCharIndex - 1));
      this.phCharIndex--;
    } else {
      this.typedPlaceholder.set(currentPhrase.substring(0, this.phCharIndex + 1));
      this.phCharIndex++;
    }

    let speed = this.phIsDeleting ? 30 : 60;

    if (!this.phIsDeleting && this.phCharIndex === currentPhrase.length) {
      speed = 2500;
      this.phIsDeleting = true;
    } else if (this.phIsDeleting && this.phCharIndex === 0) {
      this.phIsDeleting = false;
      this.phIndex = (this.phIndex + 1) % this.phPhrases.length;
      speed = 500;
    }

    setTimeout(() => this.startPlaceholderTypewriter(), speed);
  }

  private startTypewriter() {
    const currentPhrase = this.phrases[this.phraseIndex];

    if (this.isDeleting) {
      this.typedHeadline.set(currentPhrase.substring(0, this.charIndex - 1));
      this.charIndex--;
    } else {
      this.typedHeadline.set(currentPhrase.substring(0, this.charIndex + 1));
      this.charIndex++;
    }

    let currentSpeed = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentPhrase.length) {
      currentSpeed = this.delayBetweenPhrases;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      currentSpeed = 500;
    }

    setTimeout(() => this.startTypewriter(), currentSpeed);
  }

  selectAgent(agent: 'video' | 'text') {
    if (this.activeAgent() === agent) {
      this.activeAgent.set(null);
      this.phPhrases = [
        'Describe what you want to create...',
        'Try: "A 5-minute video on DNA"',
        'Try: "A full course about Python"'
      ];
    } else {
      this.activeAgent.set(agent);
      if (agent === 'video') {
        this.phPhrases = [
          'Describe the video you want...',
          'Try: "Explain Quantum Physics"',
          'Try: "A historical documentary on Rome"'
        ];
      } else {
        this.phPhrases = [
          'Describe the course or script...',
          'Try: "A lesson plan for Algebra"',
          'Try: "A 10-question quiz on Biology"'
        ];
      }
    }
    this.phIndex = 0;
    this.phCharIndex = this.phPhrases[0].length;
    this.phIsDeleting = true;
    this.typedPlaceholder.set(this.phPhrases[0]);
  }

  onSubmitPrompt() {
    if (!this.promptText.trim()) return;
    this.submittedPrompt = this.promptText;
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
    }, 1500); // Change message every 1.5 seconds

    // Simulate generation process end
    setTimeout(() => {
      clearInterval(this.fakeLoadingInterval);
      // In a real app, this would update with actual results
    }, 12000); // Extend to let messages cycle
  }

  togglePlanMenu(event: Event) {
    event.stopPropagation();
    this.isPlanMenuOpen.update(v => !v);
  }

  selectPlan(plan: 'flash' | 'pro', event: Event) {
    event.stopPropagation();
    this.selectedPlan.set(plan);
    this.isPlanMenuOpen.set(false);
  }

  // Close menu when clicking outside
  closeMenus() {
    this.isPlanMenuOpen.set(false);
  }

  private initParticles() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
        hue: Math.random() > 0.5 ? 270 : 200, // purple or cyan
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.particles.forEach((p, i) => {
        // Mouse interaction — gentle push
        const dx = p.x - this.mouseX;
        const dy = p.y - this.mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          p.vx += dx * 0.00008;
          p.vy += dy * 0.00008;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(260, 70%, 55%, ${0.18 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }
}
