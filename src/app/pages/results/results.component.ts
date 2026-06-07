import { Component, inject, ViewChild, ElementRef, effect, signal, HostListener } from '@angular/core';
import { Router } from '@angular/router';
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
  private eRef = inject(ElementRef);
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isChatCollapsed()) return;

    const chatPanel = this.eRef.nativeElement.querySelector('.chat-panel');
    // If the click is outside the chat panel, collapse it
    if (chatPanel && !chatPanel.contains(event.target as Node)) {
      this.isChatCollapsed.set(true);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
