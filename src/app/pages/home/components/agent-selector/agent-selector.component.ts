import { Component, inject, output } from '@angular/core';
import { PromptStateService } from '../../../../core/services/prompt-state.service';

@Component({
  selector: 'app-agent-selector',
  standalone: true,
  templateUrl: './agent-selector.component.html',
  styleUrl: './agent-selector.component.css'
})
export class AgentSelectorComponent {
  protected state = inject(PromptStateService);
  agentChanged = output<void>();

  selectAgent(agent: 'video' | 'text') {
    this.state.selectAgent(agent);
    this.agentChanged.emit();
  }
}
