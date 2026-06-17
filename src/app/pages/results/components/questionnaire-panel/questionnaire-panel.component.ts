import { Component, inject, signal, OnDestroy } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-questionnaire-panel',
  standalone: true,
  imports: [],
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

  ngOnDestroy() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }
}
