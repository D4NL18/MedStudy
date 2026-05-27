import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { dashboardReducer } from './store/dashboard/dashboard.reducer';
import { DashboardEffects } from './store/dashboard/dashboard.effects';
import { analyticsReducer } from './store/analytics/analytics.reducer';
import { AnalyticsEffects } from './store/analytics/analytics.effects';
import { bancoReducer } from './store/banco/banco.reducer';
import { BancoEffects } from './store/banco/banco.effects';
import { simuladosReducer } from './store/simulados/simulados.reducer';
import { SimuladosEffects } from './store/simulados/simulados.effects';
import { reducer as competitionReducer } from './store/competition/competition.reducer';
import { CompetitionEffects } from './store/competition/competition.effects';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent),
    canActivate: [guestGuard] 
  },
  {
    path: '',
    loadComponent: () => import('./core/layout/shell.component').then(m => m.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        providers: [
          provideState('dashboard', dashboardReducer),
          provideEffects(DashboardEffects)
        ]
      },
      {
        path: 'banco-questoes',
        loadComponent: () => import('./features/banco/pages/banco-list/banco-list.component').then(m => m.BancoListComponent),
        providers: [
          provideState('banco', bancoReducer),
          provideEffects(BancoEffects)
        ]
      },
      {
        path: 'simulados',
        loadComponent: () => import('./features/simulados/pages/simulados-list/simulados-list.component').then(m => m.SimuladosListComponent),
        providers: [
          provideState('simulados', simuladosReducer),
          provideEffects(SimuladosEffects)
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
      },
      {
        path: 'aulas',
        loadComponent: () => import('./features/aulas/pages/aulas-list/aulas-list.component').then(m => m.AulasListComponent)
      },
      {
        path: 'revisoes',
        loadComponent: () => import('./features/revisao/pages/revisao-list/revisao-list.component').then(m => m.RevisaoListComponent)
      },
      {
        path: 'flashcards',
        loadComponent: () => import('./features/flashcards/pages/flashcards-list/flashcards-list.component').then(m => m.FlashcardsListComponent)
      },
      {
        path: 'flashcards/novo',
        loadComponent: () => import('./features/flashcards/pages/flashcard-form/flashcard-form.component').then(m => m.FlashcardFormComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/perfil/perfil.component').then(m => m.PerfilComponent)
      },
      {
        path: 'social',
        loadComponent: () => import('./features/social/social.component').then(m => m.SocialComponent)
      },
      {
        path: 'competicoes',
        loadComponent: () => import('./features/competicoes/competicoes.component').then(m => m.CompeticoesComponent),
        providers: [
          provideState('competition', competitionReducer),
          provideEffects(CompetitionEffects)
        ]
      }
    ]
  },
  {
    path: 'offline',
    loadComponent: () => import('./features/offline-page/offline-page').then(m => m.OfflinePageComponent)
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
