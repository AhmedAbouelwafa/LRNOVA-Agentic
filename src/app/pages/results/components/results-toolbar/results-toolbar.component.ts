import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-results-toolbar',
  standalone: true,
  templateUrl: './results-toolbar.component.html',
  styleUrl: './results-toolbar.component.css'
})
export class ResultsToolbarComponent {
  protected state = inject(PromptStateService);
}
