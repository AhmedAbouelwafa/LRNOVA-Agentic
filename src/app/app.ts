import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { PromptFieldComponent } from './pages/home/components/prompt-field/prompt-field.component';
import { PromptStateService } from './core/services/prompt-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, PromptFieldComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected state = inject(PromptStateService);
}
