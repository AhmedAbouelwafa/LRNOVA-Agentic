import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-thinking-indicator',
  standalone: true,
  template: `
    <div class="thinking-indicator">
      <svg class="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
      </svg>
      <span class="thinking-text gradient-text">{{ state.loadingText() }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .thinking-indicator { display: flex; align-items: center; gap: 12px; margin-top: 10px; }
    .spinner { color: #8B5CF6; animation: spin 1.5s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .thinking-text { font-size: 1rem; font-weight: 500; animation: pulseOpacity 2s infinite ease-in-out; }
    @keyframes pulseOpacity { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    .gradient-text {
      background: linear-gradient(135deg, #00D4FF 0%, #8B5CF6 50%, #A855F7 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
      animation: gradientShift 8s ease infinite, pulseOpacity 2s infinite ease-in-out;
      background-size: 200% 200%;
    }
    @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
  `]
})
export class ThinkingIndicatorComponent {
  protected state = inject(PromptStateService);
}
