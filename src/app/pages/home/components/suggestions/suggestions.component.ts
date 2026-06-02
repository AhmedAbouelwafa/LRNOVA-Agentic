import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-suggestions',
  standalone: true,
  templateUrl: './suggestions.component.html',
  styleUrl: './suggestions.component.css'
})
export class SuggestionsComponent {
  protected state = inject(PromptStateService);

  useSuggestion(text: string) {
    this.state.promptText.set(text);
    this.state.isPromptFocused.set(true);
  }
}
