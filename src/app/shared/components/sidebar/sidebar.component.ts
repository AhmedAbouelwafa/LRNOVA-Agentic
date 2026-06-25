import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PromptStateService } from '../../../core/services/prompt-state.service';
import { LocalizationService } from '../../../core/services/localization.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  protected state = inject(PromptStateService);
  protected i18n = inject(LocalizationService);
  protected router = inject(Router);

  isCompactMode(): boolean {
    return this.router.url.startsWith('/results');
  }
}
