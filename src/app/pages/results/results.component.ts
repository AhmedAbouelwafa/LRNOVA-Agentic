import { Component, inject, ViewChild, ElementRef, effect, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ResultsToolbarComponent } from './components/results-toolbar/results-toolbar.component';
import { ThinkingIndicatorComponent } from './components/thinking-indicator/thinking-indicator.component';
import { SkeletonCardComponent } from './components/skeleton-card/skeleton-card.component';
import { StickyPromptComponent } from './components/sticky-prompt/sticky-prompt.component';
import { VideoResultComponent } from './components/video-result/video-result.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    DatePipe,
    ResultsToolbarComponent,
    ThinkingIndicatorComponent,
    SkeletonCardComponent,
    StickyPromptComponent,
    VideoResultComponent
  ],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  protected state = inject(PromptStateService);
  isChatCollapsed = signal(false);
  
  @ViewChild('chatScroll') private chatScrollContainer!: ElementRef;

  constructor() {
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
