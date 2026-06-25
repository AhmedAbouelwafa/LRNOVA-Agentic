import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  useSuggestion(text: string) {
    this.state.promptText.set(text);
    this.state.isPromptFocused.set(true);
  }

  getTranslatedText(id: string, fallback: string): string {
    const key = 'suggestion.' + id + '.short';
    const translated = this.i18n.t(key);
    return translated !== key ? translated : fallback;
  }

  getTranslatedPrompt(id: string, fallback: string): string {
    const key = 'suggestion.' + id;
    const translated = this.i18n.t(key);
    return translated !== key ? translated : fallback;
  }
}
