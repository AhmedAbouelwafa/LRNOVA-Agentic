import { Component, inject, signal, OnDestroy, effect, ViewChild, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';
import { ChatMessage } from '../../../../core/models';

@Component({
  selector: 'app-questionnaire-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './questionnaire-panel.component.html',
  styleUrl: './questionnaire-panel.component.css'
})
export class QuestionnairePanelComponent implements OnDestroy {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  /** When true, render as inline chat bubble (inside the chat thread) */
  @Input() inline = false;
  /** When in inline mode, this is the specific question message to render */
  @Input() question: ChatMessage | null = null;

  /** The currently selected option label (before submitting) */
  selectedOption = signal<string | null>(null);
  activeAudioUrl = signal<string | null>(null);
  isAutoAdvancing = signal<boolean>(false);
  private audioPlayer: HTMLAudioElement | null = null;
  private autoAdvanceTimer: any = null;
  
  displayedTitle = signal<string>('');
  private typeWriterInterval: any;

  /** Script text for the user-written script textarea */
  userScriptText = signal<string>('');

  /** Editable script text for the AI-generated script review */
  editableScript = signal<string>('');

  /** Whether the user is in edit mode for the AI-generated script */
  isEditingScript = signal<boolean>(false);

  /** Whether the manual "write your own" input is active */
  isManualInput = signal<boolean>(false);

  /** The manually typed answer text */
  manualAnswerText = signal<string>('');

  @ViewChild('audioUploadInput') audioUploadInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      const q = this.getActiveQuestion();
      if (q && q.questionnaire) {
        // Populate editable script if in review modee
        if (q.questionnaire.isScriptReview && q.questionnaire.scriptContent) {
          setTimeout(() => this.editableScript.set(q.questionnaire!.scriptContent!), 0);
        }
        setTimeout(() => this.startTypewriter(q.questionnaire!.title), 0);
      } else {
        setTimeout(() => {
          this.displayedTitle.set('');
          if (this.typeWriterInterval) {
            clearInterval(this.typeWriterInterval);
          }
        }, 0);
      }
    });
  }

  /** Get the question to render — either the input question (inline) or the active question (panel) */
  getActiveQuestion(): ChatMessage | null {
    if (this.inline && this.question) {
      return this.question;
    }
    return this.state.activeQuestion();
  }

  private startTypewriter(fullText: string) {
    if (this.typeWriterInterval) {
      clearInterval(this.typeWriterInterval);
    }
    this.displayedTitle.set('');
    let i = 0;
    this.typeWriterInterval = setInterval(() => {
      if (i < fullText.length) {
        this.displayedTitle.update(prev => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(this.typeWriterInterval);
      }
    }, 20);
  }

  /** Map index to letter badge (A, B, C, D…) */
  optionLetter(idx: number): string {
    return String.fromCharCode(65 + idx);
  }

  selectOption(label: string) {
    this.selectedOption.set(label);
  }

  /** Select an option and auto-advance to the next question after a brief delay */
  selectAndAdvance(label: string) {
    if (this.isAutoAdvancing()) return; // prevent double-click

    // If manual mode is on, turn it off
    this.isManualInput.set(false);
    this.manualAnswerText.set('');

    this.selectedOption.set(label);
    this.isAutoAdvancing.set(true);

    // Clear any existing timer
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }

    this.autoAdvanceTimer = setTimeout(() => {
      this.submitAnswer();
      this.isAutoAdvancing.set(false);
    }, 500);
  }

  /** Activate manual input mode */
  activateManualInput() {
    this.isManualInput.set(true);
    this.selectedOption.set(null);
  }

  /** Submit the manual text answer */
  submitManualAnswer() {
    const text = this.manualAnswerText().trim();
    if (!text) return;

    const q = this.getActiveQuestion();
    if (!q) return;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
    }

    this.state.answerQuestionnaire(q.id, text);
    this.selectedOption.set(null);
    this.isManualInput.set(false);
    this.manualAnswerText.set('');
  }

  playAudio(url: string, event: Event) {
    event.stopPropagation();
    
    if (this.activeAudioUrl() === url && this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
      return;
    }

    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }

    this.audioPlayer = new Audio(url);
    this.audioPlayer.play();
    this.activeAudioUrl.set(url);

    this.audioPlayer.onended = () => {
      this.activeAudioUrl.set(null);
    };
  }

  submitAnswer() {
    const q = this.getActiveQuestion();
    if (!q) return;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
    }

    const selected = this.selectedOption();
    this.state.answerQuestionnaire(q.id, selected ?? undefined);
    this.selectedOption.set(null);
    this.isManualInput.set(false);
    this.manualAnswerText.set('');
  }

  skipQuestion() {
    const q = this.getActiveQuestion();
    if (!q) return;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
    }

    this.state.answerQuestionnaire(q.id);
    this.selectedOption.set(null);
    this.isManualInput.set(false);
    this.manualAnswerText.set('');
  }

  /** Submit the user-written script */
  submitUserScript() {
    const q = this.getActiveQuestion();
    if (!q) return;
    const text = this.userScriptText().trim();
    if (!text) return;

    this.state.submitUserScript(q.id, text);
    this.userScriptText.set('');
  }

  /** Toggle edit mode for the AI-generated script review */
  toggleScriptEdit() {
    this.isEditingScript.update(v => !v);
  }

  /** Approve the script (AI-generated or after editing) */
  approveScript() {
    const q = this.getActiveQuestion();
    if (!q) return;

    const finalScript = this.editableScript().trim();
    if (!finalScript) return;

    this.state.approveScript(q.id, finalScript);
    this.isEditingScript.set(false);
  }

  /** Trigger the hidden file input for audio upload */
  triggerAudioUpload() {
    if (this.audioUploadInput) {
      this.audioUploadInput.nativeElement.click();
    }
  }

  /** Handle audio file selection */
  onAudioFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const q = this.getActiveQuestion();
      if (q) {
        this.state.submitAudioUpload(q.id, file.name);
      }
      input.value = '';
    }
  }

  ngOnDestroy() {
    if (this.typeWriterInterval) {
      clearInterval(this.typeWriterInterval);
    }
    if (this.autoAdvanceTimer) {
      clearTimeout(this.autoAdvanceTimer);
    }
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }
}
