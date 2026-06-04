import { Component, inject, OnInit, OnDestroy, effect, ViewChild, ElementRef } from '@angular/core';
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
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private tw = inject(TypewriterService);
  private placeholderWriter!: ReturnType<TypewriterService['create']>;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  protected typedPlaceholder!: ReturnType<TypewriterService['create']>;

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

  onSubmit() {
    this.state.submitPrompt();
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
