import { Component, inject, signal, OnDestroy, effect, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

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

  /** The currently selected option label (before submitting) */
  selectedOption = signal<string | null>(null);
  activeAudioUrl = signal<string | null>(null);
  private audioPlayer: HTMLAudioElement | null = null;
  
  displayedTitle = signal<string>('');
  private typeWriterInterval: any;

  /** Script text for the user-written script textarea */
  userScriptText = signal<string>('');

  /** Editable script text for the AI-generated script review */
  editableScript = signal<string>('');

  /** Whether the user is in edit mode for the AI-generated script */
  isEditingScript = signal<boolean>(false);

  @ViewChild('audioUploadInput') audioUploadInput!: ElementRef<HTMLInputElement>;

  constructor() {
    effect(() => {
      const q = this.state.activeQuestion();
      if (q && q.questionnaire) {
        // Populate editable script if in review mode
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

  selectOption(label: string) {
    this.selectedOption.set(label);
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
    const q = this.state.activeQuestion();
    if (!q) return;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
    }

    const selected = this.selectedOption();
    this.state.answerQuestionnaire(q.id, selected ?? undefined);
    this.selectedOption.set(null);
  }

  skipQuestion() {
    const q = this.state.activeQuestion();
    if (!q) return;

    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.activeAudioUrl.set(null);
    }

    this.state.answerQuestionnaire(q.id);
    this.selectedOption.set(null);
  }

  /** Submit the user-written script */
  submitUserScript() {
    const q = this.state.activeQuestion();
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
    const q = this.state.activeQuestion();
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
      const q = this.state.activeQuestion();
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
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }
}
