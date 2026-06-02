import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ResultsToolbarComponent } from './components/results-toolbar/results-toolbar.component';
import { ThinkingIndicatorComponent } from './components/thinking-indicator/thinking-indicator.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { StickyPromptComponent } from './components/sticky-prompt/sticky-prompt.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    ResultsToolbarComponent,
    ThinkingIndicatorComponent,
    SkeletonCardComponent,
    StickyPromptComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  protected state = inject(PromptStateService);
}
