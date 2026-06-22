import { Component, inject, output, signal, input } from '@angular/core';
import { Router } from '@angular/router';
import { PromptStateService } from '../../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../../core/services/localization.service';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  templateUrl: './agent-selector.component.html',
  styleUrl: './agent-selector.component.css'
})
export class AgentSelectorComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  private router = inject(Router);

  isGoalsGridActive = input(false);
  agentChanged = output<void>();
  goalsToggled = output<void>();

  selectLevel(level: 1 | 2, event: Event) {
    event.stopPropagation();
    this.state.activeGoalLevel.set(level);
    this.goalsToggled.emit();
  }
}
