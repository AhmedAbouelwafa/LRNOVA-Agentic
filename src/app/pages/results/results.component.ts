import { Component, inject, ViewChild, ElementRef, effect, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ResultsToolbarComponent } from './components/results-toolbar/results-toolbar.component';
import { ThinkingIndicatorComponent } from './components/thinking-indicator/thinking-indicator.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { PromptFieldComponent } from '../home/components/prompt-field/prompt-field.component';
import { VideoResultComponent } from './components/video-result/video-result.component';
import { QuestionnairePanelComponent } from './components/questionnaire-panel/questionnaire-panel.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    DatePipe,
    ResultsToolbarComponent,
    ThinkingIndicatorComponent,
    SkeletonCardComponent,
    PromptFieldComponent,
    VideoResultComponent,
    QuestionnairePanelComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  protected state = inject(PromptStateService);
  private router = inject(Router);
  isChatCollapsed = signal(false);
  
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  constructor() {
    // Redirect to home if accessed directly without a prompt
    if (!this.state.submittedPrompt() && this.state.chatHistory().length === 0) {
      this.router.navigate(['/']);
      return;
    }
    
    // Ensure the home prompt field is hidden if user refreshed
    this.state.isAnimatingOut.set(true);

    effect(() => {
      // Re-evaluate whenever chatHistory or generation state changes
      this.state.chatHistory();
      this.state.isGenerationComplete();

      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
