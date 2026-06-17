import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-thinking-indicator',
  standalone: true,
  template: `
    <div class="thinking-indicator">
      <div class="thinking-dot-group">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <span class="thinking-text">{{ translateLoading(state.loadingText()) }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .thinking-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      background: #FFFFFF;
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-top: none;
      border-radius: 0 0 14px 14px;
      margin-top: -1px;
    }
    .thinking-dot-group {
      display: flex;
      gap: 4px;
      align-items: center;
    }
    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #8B5CF6;
      animation: dotBounce 1.4s infinite ease-in-out;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotBounce {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.2); }
    }
    .thinking-text {
      font-size: 0.78rem;
      color: #6B7280;
      font-weight: 500;
      animation: labelFade 2.5s ease-in-out infinite;
    }
    @keyframes labelFade {
      0%, 100% { opacity: 0.5; }
      50% { opacity: 1; }
    }
  `]
})
export class ThinkingIndicatorComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);

  private loadingMap: Record<string, string> = {
    'Thinking...': 'loading.thinking',
    'Analyzing context...': 'loading.analyzing',
    'Querying AI agent cluster...': 'loading.querying',
    'Synthesizing learning vectors...': 'loading.synthesizing',
    'Drafting educational content...': 'loading.drafting',
    'Rendering interactive modules...': 'loading.rendering',
    'Finalizing layout...': 'loading.finalizing',
  };

  translateLoading(text: string): string {
    const key = this.loadingMap[text];
    return key ? this.i18n.t(key) : text;
  }
}
