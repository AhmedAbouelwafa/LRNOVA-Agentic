import { Component, inject, ViewChild, ElementRef, effect, signal } from '@angular/core';
import { CreditConsumptionComponent } from './components/credit-consumption/credit-consumption.component';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ResultsToolbarComponent } from './components/results-toolbar/results-toolbar.component';

import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { PromptFieldComponent } from '../home/components/prompt-field/prompt-field.component';
import { VideoResultComponent } from './components/video-result/video-result.component';
import { TextResultComponent } from './components/text-result/text-result.component';
import { SlidesResultComponent } from './components/slides-result/slides-result.component';
import { AgenticChatComponent } from './components/agentic-chat/agentic-chat.component';
import { VideoAvatarDialogComponent } from './components/video-avatar-dialog/video-avatar-dialog.component';
import { TextVideoDialogComponent } from './components/text-video-dialog/text-video-dialog.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    DatePipe,
    ResultsToolbarComponent,

    SkeletonCardComponent,
    PromptFieldComponent,
    VideoResultComponent,
    TextResultComponent,
    SlidesResultComponent,
    AgenticChatComponent,
    CreditConsumptionComponent,
    VideoAvatarDialogComponent,
    TextVideoDialogComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  protected state = inject(PromptStateService);
  private router = inject(Router);
  isChatCollapsed = signal(false);

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
    });
  }

  activateProAndMakeProject() {
    this.state.toolSwitchWarning.set(null); // Close modal
    this.router.navigate(['/pricing']);
  }
}
