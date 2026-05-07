import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';

import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dashboardReducer } from './store/dashboard/dashboard.reducer';
import { DashboardEffects } from './store/dashboard/dashboard.effects';
import { analyticsReducer } from './store/analytics/analytics.reducer';
import { AnalyticsEffects } from './store/analytics/analytics.effects';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    loadComponent: () => import('./core/layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        providers: [
          provideState('dashboard', dashboardReducer),
          provideEffects(DashboardEffects)
        ]
      },
      {
        path: 'analytics',
        providers: [
          provideState('analytics', analyticsReducer),
          provideEffects(AnalyticsEffects)
        ],
        children: [
          { 
            path: 'area', 
            loadComponent: () => import('./features/analytics/pages/analise-area/analise-area.component').then(m => m.AnaliseAreaComponent) 
          },
          { 
            path: 'tema', 
            loadComponent: () => import('./features/analytics/pages/analise-tema/analise-tema.component').then(m => m.AnaliseTemaComponent) 
          }
        ]
      }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
