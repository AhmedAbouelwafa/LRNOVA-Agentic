import { Component, inject, output } from '@angular/core';
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
  agentChanged = output<void>();

  selectAgent(agent: 'video' | 'text') {
    this.state.selectAgent(agent);
    this.agentChanged.emit();
  }
}
