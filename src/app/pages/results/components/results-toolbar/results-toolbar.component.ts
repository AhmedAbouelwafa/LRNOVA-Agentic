import { Component, inject } from '@angular/core';

import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-results-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './results-toolbar.component.html',
  styleUrl: './results-toolbar.component.css'
})
export class ResultsToolbarComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
}
