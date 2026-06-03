import { Component, inject, OnInit, OnDestroy, effect } from '@angular/core';
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

  onTogglePlan(event: Event) {
    this.state.togglePlan(event);
  }
}
