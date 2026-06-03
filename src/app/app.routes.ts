import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: '**',
    redirectTo: ''
  }
];
