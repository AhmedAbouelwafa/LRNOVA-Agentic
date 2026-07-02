import { Component, inject } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-credit-consumption',
  standalone: true,
  template: `
    <div class="credit-bar">
      <div class="credit-bar-left">
        <!-- Cost Chip -->
        <div class="credit-chip cost-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span class="chip-value">14</span>
          <span class="chip-label">{{ i18n.currentLang() === 'ar' ? 'رصيد مستخدم' : 'Credits Used' }}</span>
        </div>

        <!-- Duration Chip -->
        @if (state.resultType() === 'video') {
          <div class="credit-chip">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span class="chip-value">0:03</span>
            <span class="chip-label">{{ i18n.currentLang() === 'ar' ? 'مدة' : 'Duration' }}</span>
          </div>
        }
      </div>

      <div class="credit-bar-right">
        <!-- Balance -->
        <div class="credit-chip balance-chip">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
          <span class="chip-label">{{ i18n.currentLang() === 'ar' ? 'الرصيد:' : 'Balance:' }}</span>
          <span class="chip-value">49,999,005</span>
        </div>
        <!-- Status Indicator -->
        <div class="status-indicator">
          <span class="status-dot"></span>
          {{ i18n.currentLang() === 'ar' ? 'كافٍ' : 'Sufficient' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .credit-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 16px;
      background: var(--surface-primary);
      border: 1px solid var(--border-light);
      border-top: none;
      gap: 12px;
      flex-wrap: wrap;
    }

    .credit-bar-left,
    .credit-bar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .credit-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 100px;
      background: var(--surface-hover);
      border: 1px solid var(--border-light);
      font-size: 0.72rem;
      color: var(--text-muted);
      font-weight: 500;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .credit-chip svg {
      opacity: 0.6;
      flex-shrink: 0;
    }

    .credit-chip.cost-chip {
      background: rgba(139, 92, 246, 0.08);
      border-color: rgba(139, 92, 246, 0.2);
      color: #8B5CF6;
    }
    .credit-chip.cost-chip svg {
      opacity: 1;
      color: #8B5CF6;
    }
    .credit-chip.cost-chip .chip-value {
      font-weight: 700;
      color: #8B5CF6;
    }

    .chip-value {
      font-weight: 600;
      color: var(--text-heading);
    }
    .chip-label {
      color: var(--text-muted);
    }

    .credit-chip.balance-chip .chip-value {
      color: var(--text-body);
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.7rem;
      color: #00C2FF;
      font-weight: 600;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00C2FF;
      box-shadow: 0 0 6px rgba(0, 194, 255, 0.4);
    }

    /* Responsive */
    @media (max-width: 600px) {
      .credit-bar {
        padding: 5px 10px;
        gap: 6px;
      }
      .credit-chip {
        font-size: 0.68rem;
        padding: 2px 8px;
      }
    }
  `]
})
export class CreditConsumptionComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
}
