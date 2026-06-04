import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalizationService } from '../../../../core/services/localization.service';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-sticky-prompt',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="sticky-prompt-wrapper">
      <div class="sticky-prompt">
        <input type="text"
          [placeholder]="i18n.t('sticky.placeholder')"
          [ngModel]="stickyText()"
          (ngModelChange)="stickyText.set($event)"
          (keydown.enter)="onSubmitFollowUp()" />
        <button class="sticky-submit" [class.has-text]="stickyText().trim().length > 0" (click)="onSubmitFollowUp()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .sticky-prompt-wrapper {
      display: flex; justify-content: center; width: 100%;
      padding: 12px 16px; background: rgba(255, 255, 255, 0.4);
      border-top: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 0 0 24px 24px;
    }
    .sticky-prompt {
      display: flex; align-items: center;
      width: 100%; padding: 6px 6px 6px 16px;
      border-radius: 100px; background: rgba(255, 255, 255, 0.8);
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), inset 0 1px 1px rgba(255, 255, 255, 1);
    }
    .sticky-prompt input {
      flex: 1; background: transparent; padding: 8px 0; font-size: 0.9rem;
      color: #1E293B; border: none; outline: none; min-width: 0;
    }
    .sticky-submit {
      width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
      background: rgba(0, 0, 0, 0.04); color: #64748B; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: none; cursor: pointer;
    }
    .sticky-submit.has-text {
      background: #8B5CF6; color: white;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
    }
    .sticky-submit:hover {
      background: #7C3AED; transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
    }
    
    /* RTL */
    :host-context(html[dir="rtl"]) .sticky-prompt {
      padding: 6px 16px 6px 6px;
    }
  `]
})
export class StickyPromptComponent {
  protected i18n = inject(LocalizationService);
  private state = inject(PromptStateService);
  readonly stickyText = signal('');

  onSubmitFollowUp() {
    const text = this.stickyText().trim();
    if (!text) return;

    // Add user message to history
    this.state.addFollowUpMessage(text, 'user');
    this.stickyText.set('');

    // Trigger a brief regeneration cycle
    this.state.isGenerationComplete.set(false);
    this.state.loadingText.set('Processing follow-up...');

    let msgIndex = 0;
    const msgs = ['Analyzing your request...', 'Applying changes...', 'Finalizing...'];
    const interval = setInterval(() => {
      if (msgIndex < msgs.length) {
        this.state.loadingText.set(msgs[msgIndex]);
        msgIndex++;
      } else {
        clearInterval(interval);
      }
    }, 1500);

    setTimeout(() => {
      clearInterval(interval);
      this.state.isGenerationComplete.set(true);
      // Simulate agent response
      this.state.addFollowUpMessage('I have updated the result based on your instructions.', 'agent');
    }, 5000);
  }
}


