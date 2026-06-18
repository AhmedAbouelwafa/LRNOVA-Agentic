import { Component, inject, output, signal, HostListener, input } from '@angular/core';
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
  isQuickStartActive = input(false);
  agentChanged = output<void>();
  quickStartToggled = output<void>();

  toggleQuickStart(event: Event) {
    event.stopPropagation();
    this.quickStartToggled.emit();
  }

  goToProjects() {
    this.state.selectedQuickTool.set('Projects');
    this.agentChanged.emit();
  }
}
