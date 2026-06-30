import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.component').then(m => m.ResultsComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./shared/components/pricing/pricing').then(m => m.Pricing)
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'settings/:sectionId',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: 'agents',
    loadComponent: () => import('./pages/apps/apps.component').then(m => m.AppsComponent)
  },
  {
    path: 'agents/:toolId',
    loadComponent: () => import('./pages/apps/apps.component').then(m => m.AppsComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
