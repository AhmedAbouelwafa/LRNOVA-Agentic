import { Component, inject, OnInit, OnDestroy, effect, ViewChild, ElementRef, Input, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { TypewriterService } from '../../../../core/services/typewriter.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-prompt-field',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prompt-field.component.html',
  styleUrl: './prompt-field.component.css'
})
export class PromptFieldComponent implements OnInit, OnDestroy {
  @Input() mode: 'home' | 'chat' = 'home';
  @HostBinding('class.chat-mode') get isChatMode() { return this.mode === 'chat'; }

  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private tw = inject(TypewriterService);
  private router = inject(Router);
  private placeholderWriter!: ReturnType<TypewriterService['create']>;

  get canRemoveTool(): boolean {
    return this.mode !== 'chat' && !this.router.url.startsWith('/apps');
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected typedPlaceholder!: ReturnType<TypewriterService['create']>;

  get showDropdown(): boolean {
    return this.router.url.startsWith('/apps');
  }

  isAppDropdownOpen = false;

  availableTools = [
    { id: 'Video', slug: 'video', label: 'Video' },
    { id: 'Text Video', slug: 'text-video', label: 'Text Video' },
    { id: 'Script', slug: 'script', label: 'Script' },
    { id: 'Assessment', slug: 'assessment', label: 'Assessment' },
    { id: 'Activity', slug: 'activity', label: 'Activity' },
    { id: 'Topic', slug: 'topic', label: 'Topic' },
    { id: 'Slides', slug: 'slides', label: 'Slides' },
    { id: 'Full Course Script', slug: 'course-script', label: 'Course Script' },
    { id: 'Full Course Content', slug: 'course-content', label: 'Course Content' }
  ];

  @HostListener('document:click')
  closeDropdown() {
    this.isAppDropdownOpen = false;
  }

  toggleAppDropdown(event: Event) {
    if (this.showDropdown) {
      this.isAppDropdownOpen = !this.isAppDropdownOpen;
      event.stopPropagation();
    }
  }

  switchTool(tool: any) {
    this.isAppDropdownOpen = false;
    this.router.navigate(['/apps', tool.slug]);
  }


  constructor() {
    // React to language changes
    effect(() => {
      const lang = this.i18n.currentLang();
      if (this.placeholderWriter) {
        this.updatePhrasesForCurrentState();
      }
    });
  }

  private getDefaultPhrases(): string[] {
    return [
      this.i18n.t('prompt.default.1'),
      this.i18n.t('prompt.default.2'),
      this.i18n.t('prompt.default.3'),
    ];
  }
  private getVideoPhrases(): string[] {
    return [
      this.i18n.t('prompt.video.1'),
      this.i18n.t('prompt.video.2'),
      this.i18n.t('prompt.video.3'),
    ];
  }
  private getTextPhrases(): string[] {
    return [
      this.i18n.t('prompt.text.1'),
      this.i18n.t('prompt.text.2'),
      this.i18n.t('prompt.text.3'),
    ];
  }

  private updatePhrasesForCurrentState() {
    const agent = this.state.activeAgent();
    if (agent === 'video') {
      this.placeholderWriter.updatePhrases(this.getVideoPhrases());
    } else if (agent === 'text') {
      this.placeholderWriter.updatePhrases(this.getTextPhrases());
    } else {
      this.placeholderWriter.updatePhrases(this.getDefaultPhrases());
    }
  }

  ngOnInit() {
    this.typedPlaceholder = this.tw.create({
      phrases: this.getDefaultPhrases(),
      typingSpeed: 60,
      deletingSpeed: 30,
      delayBetweenPhrases: 2500
    });
    this.placeholderWriter = this.typedPlaceholder;
    this.placeholderWriter.start(3000);
  }

  ngOnDestroy() {
    this.placeholderWriter.destroy();
  }

  onAgentChanged() {
    this.updatePhrasesForCurrentState();
  }

  showCreditPreviewModal = false;

  onSubmit() {
    if (this.mode === 'chat') {
      this.submitFollowUp();
    } else {
      this.showCreditPreviewModal = true;
    }
  }

  confirmGenerate() {
    this.showCreditPreviewModal = false;
    this.state.submitPrompt();
  }

  cancelGenerate() {
    this.showCreditPreviewModal = false;
  }

  private submitFollowUp() {
    const text = this.state.promptText().trim();
    if (!text && this.state.attachedFiles().length === 0) return;

    let currentTool = this.state.selectedQuickTool();
    const selectedGoal = this.state.selectedGoal();

    if (!currentTool && selectedGoal) {
      if (selectedGoal.level === 1 && selectedGoal.pipeline.length > 0) {
        currentTool = selectedGoal.pipeline[0].toolId;
      } else {
        currentTool = 'Projects';
      }
    } else if (!currentTool) {
      currentTool = 'Projects';
    }

    const isProjects = currentTool === 'Projects' || (selectedGoal && selectedGoal.level === 2);

    const toolKeywords: Record<string, string> = {
      'slides': 'Slides',
      'course': 'Course Content',
      'video': 'Video',
      'activity': 'Activity',
      'assessment': 'Assessment',
      'script': 'Script',
      'topic': 'Topic'
    };

    const lower = text.toLowerCase();
    const matchedKey = Object.keys(toolKeywords).find(k => lower.includes(k));

    if (matchedKey) {
      const detectedTool = toolKeywords[matchedKey];

      if (isProjects) {
        // Projects Scenario: Add new tab
        this.state.addFollowUpMessage(text || 'Attached files', 'user');
        this.state.promptText.set('');
        this.state.attachedFiles.set([]);

        this.state.addCanvasTab(text);
        this.processFollowUp(currentTool);
      } else {
        // Tool Scenario: Different tool keyword detected -> Show Warning
        // Use loose matching to avoid false positives on same tool
        const isSameTool = currentTool.toLowerCase().includes(detectedTool.toLowerCase()) || detectedTool.toLowerCase().includes(currentTool.toLowerCase());
        if (!isSameTool) {
          this.state.toolSwitchWarning.set({ newTool: detectedTool, newPrompt: text });
          return;
        } else {
          this.state.addFollowUpMessage(text || 'Attached files', 'user');
          this.state.promptText.set('');
          this.state.attachedFiles.set([]);
          this.processFollowUp(currentTool);
        }
      }
    } else {
      // Normal flow, no keywords
      this.state.addFollowUpMessage(text || 'Attached files', 'user');
      this.state.promptText.set('');
      this.state.attachedFiles.set([]);
      this.processFollowUp(currentTool);
    }
  }

  private processFollowUp(tool: string | null) {
    if (tool === 'Video' || tool === 'Text Video') {
      this.state.startFollowUp('video');
      return;
    }

    // Simulate agent response for non-video workflows
    this.state.isGenerationComplete.set(false);
    this.state.loadingText.set('Acknowledging dashboard visibility...');

    let msgIndex = 0;
    const msgs = [
      'Analyzing requirements...',
      'Executing actions...',
      'Finalizing outputs...'
    ];

    const interval = setInterval(() => {
      if (msgIndex < msgs.length) {
        this.state.loadingText.set(msgs[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(interval);
        this.state.isGenerationComplete.set(true);
        this.state.addFollowUpMessage('[ThoughtProcess] Acknowledging dashboard visibility | Analyzed your request and executed the necessary changes to the dashboard components.', 'agent');
        this.state.addFollowUpMessage('I have updated the result based on your instructions. Let me know if there is anything else you need!', 'agent');
      }
    }, 1200);
  }

  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.state.addFiles(input.files);
      // Reset input so the same file can be selected again if removed
      input.value = '';
    }
  }

  removeFile(index: number) {
    this.state.removeFile(index);
  }

  onTogglePlan(event: Event) {
    this.state.togglePlan(event);
  }

  isRecording = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        // Create a File object so it integrates with existing attachedFiles
        const audioFile = new File([audioBlob], `Voice_Record_${new Date().toLocaleTimeString().replace(/:/g, '-')}.webm`, { type: 'audio/webm' });

        // Add to attached files
        this.state.addFiles([audioFile]);

        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('Please allow microphone access to record audio.');
    }
  }

  private stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }
}
