import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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
  private router = inject(Router);
  isFullWidthPage = signal(false);
  isLoginPage = signal(false);

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(e => {
      const url = e.urlAfterRedirects;
      const isAppsGrid = url === '/apps' || url.startsWith('/apps?');
      this.isFullWidthPage.set(url.startsWith('/projects') || url.startsWith('/settings') || url.startsWith('/results') || isAppsGrid);
      this.isLoginPage.set(url.startsWith('/login') || url.startsWith('/register'));
    });
  }
}
