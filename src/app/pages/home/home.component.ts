import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AgentSelectorComponent } from './components/agent-selector/agent-selector.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { PromptStateService } from '../../core/services/prompt-state.service';
import { ParticleCanvasDirective } from '../../core/directives/particle-canvas.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroSectionComponent,
    AgentSelectorComponent,
    SuggestionsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  protected state = inject(PromptStateService);

  ngOnInit() {
    // Reset state when returning home
    this.state.isGenerating.set(false);
    this.state.isAnimatingOut.set(false);
  }

  ngOnDestroy() {}
}
