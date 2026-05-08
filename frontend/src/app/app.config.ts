import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideServiceWorker } from '@angular/service-worker';
import { themeReducer } from './store/theme/theme.reducer';
import { authReducer } from './store/auth/auth.reducer';
import { AuthEffects } from './store/auth/auth.effects';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { studyPlanFeature } from './store/study-plan/study-plan.reducer';
import { StudyPlanEffects } from './store/study-plan/study-plan.effects';
import { revisionFeature } from './store/revision/revision.reducer';
import { RevisionEffects } from './store/revision/revision.effects';
import { flashcardsFeature } from './store/flashcards/flashcards.reducer';
import { FlashcardsEffects } from './store/flashcards/flashcards.effects';
import { LucideAngularModule, Diamond, ChevronRight, CheckCircle, Calendar, Clock, Play, AlertCircle, X, RotateCw, Check, AlertTriangle, Plus, Search, Filter, Edit, Trash2 } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    importProvidersFrom(LucideAngularModule.pick({ 
      Diamond, ChevronRight, CheckCircle, Calendar, Clock, Play, AlertCircle, X, RotateCw, Check, AlertTriangle,
      Plus, Search, Filter, Edit, Trash2
    })),
    provideStore({ 
      theme: themeReducer,
      auth: authReducer,
      [studyPlanFeature.name]: studyPlanFeature.reducer,
      [revisionFeature.name]: revisionFeature.reducer,
      [flashcardsFeature.name]: flashcardsFeature.reducer
    }),
    provideEffects([AuthEffects, StudyPlanEffects, RevisionEffects, FlashcardsEffects]),
    provideMarkdown(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
