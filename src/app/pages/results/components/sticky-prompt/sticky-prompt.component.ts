import { Component, inject } from '@angular/core';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-sticky-prompt',
  standalone: true,
  template: `
    <div class="sticky-prompt-wrapper">
      <div class="sticky-prompt">
        <input type="text" [placeholder]="i18n.t('sticky.placeholder')" />
        <button class="sticky-submit">
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
      position: fixed; bottom: 40px; left: 0; right: 0;
      display: flex; justify-content: center; pointer-events: none; z-index: 50;
    }
    .sticky-prompt {
      pointer-events: auto; display: flex; align-items: center;
      width: 100%; max-width: 680px; padding: 6px 6px 6px 20px;
      border-radius: 100px; background: rgba(255, 255, 255, 0.28);
      border: 1px solid rgba(255, 255, 255, 0.65);
      backdrop-filter: blur(35px) saturate(1.7); -webkit-backdrop-filter: blur(35px) saturate(1.7);
      box-shadow: 0 10px 40px rgba(139, 92, 246, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.5);
    }
    .sticky-prompt input {
      flex: 1; background: transparent; padding: 10px 0; font-size: 0.95rem;
      color: #1E293B; border: none; outline: none;
    }
    .sticky-submit {
      width: 40px; height: 40px; border-radius: 50%;
      background: #8B5CF6; color: white; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: none; cursor: pointer;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
    }
    .sticky-submit:hover {
      background: #7C3AED; transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
    }
  `]
})
export class StickyPromptComponent {
  protected i18n = inject(LocalizationService);
}
