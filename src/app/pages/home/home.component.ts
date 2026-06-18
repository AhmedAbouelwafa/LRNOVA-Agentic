import { Component, inject, OnInit, OnDestroy, signal, HostListener } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AgentSelectorComponent } from './components/agent-selector/agent-selector.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { ToolsListComponent } from './components/tools-list/tools-list.component';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ParticleCanvasDirective } from '../../core/directives/particle-canvas.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    AgentSelectorComponent,
    SuggestionsComponent,
    ToolsListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  protected state = inject(PromptStateService);
  isToolsListVisible = signal(false);

  @HostListener('document:click')
  onDocumentClick() {
    if (this.isToolsListVisible()) {
      this.isToolsListVisible.set(false);
    }
  }

  toggleToolsList() {
    // Timeout prevents document click from immediately closing it
    setTimeout(() => {
      this.isToolsListVisible.update(v => !v);
    });
  }

  ngOnInit() {
    // Reset state when returning home
    this.state.isGenerating.set(false);
    this.state.isAnimatingOut.set(false);
  }

  ngOnDestroy() {}
}
