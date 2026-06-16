import { Component, inject, signal } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-questionnaire-panel',
  standalone: true,
  imports: [],
  templateUrl: './questionnaire-panel.component.html',
  styleUrl: './questionnaire-panel.component.css'
})
export class QuestionnairePanelComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  /** The currently selected option label (before submitting) */
  selectedOption = signal<string | null>(null);

  selectOption(label: string) {
    this.selectedOption.set(label);
  }

  submitAnswer() {
    const q = this.state.activeQuestion();
    if (!q) return;

    const selected = this.selectedOption();
    this.state.answerQuestionnaire(q.id, selected ?? undefined);
    this.selectedOption.set(null);
  }

  skipQuestion() {
    const q = this.state.activeQuestion();
    if (!q) return;

    this.state.answerQuestionnaire(q.id);
    this.selectedOption.set(null);
  }
}
