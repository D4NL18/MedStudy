# Patterns: Phase 13 — Testes Frontend (Angular + NgRx)

## Analogs & Patterns

### 1. Component Testing (Standalone)
**Analog:** `frontend/src/app/app.component.spec.ts` (Basic example)
**Target Pattern:** Use `MockBuilder` from `ng-mocks`.
```typescript
import { MockBuilder, MockRender } from 'ng-mocks';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  beforeEach(() => MockBuilder(DashboardComponent));
  it('should render', () => {
    const fixture = MockRender(DashboardComponent);
    expect(fixture.point.componentInstance).toBeDefined();
  });
});
```

### 2. NgRx Reducer Testing
**Analog:** `frontend/src/app/store/auth/auth.reducer.ts`
**Pattern:** Pure function testing.
```typescript
import * as fromAuth from './auth.reducer';
import * as AuthActions from './auth.actions';

describe('AuthReducer', () => {
  it('should return initial state', () => {
    const { initialState } = fromAuth;
    const action = { type: 'Unknown' } as any;
    const state = fromAuth.reducer(initialState, action);
    expect(state).toBe(initialState);
  });
});
```

### 3. NgRx Effect Testing
**Analog:** `frontend/src/app/store/auth/auth.effects.ts`
**Pattern:** `provideMockActions` + `jasmine-marbles`.
```typescript
import { provideMockActions } from '@ngrx/effects/testing';
import { hot, cold } from 'jasmine-marbles';
import { AuthEffects } from './auth.effects';

describe('AuthEffects', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        // mocks for services
      ],
    });
  });
});
```

### 4. Service Testing (with HttpClient)
**Analog:** `frontend/src/app/core/services/auth.service.ts` (if exists)
**Pattern:** `HttpClientTestingModule`.

## Files to be Tested (Phase Scope)
- `frontend/src/app/store/auth/` (Reducers, Effects, Selectors)
- `frontend/src/app/store/dashboard/`
- `frontend/src/app/features/auth/login/`
- `frontend/src/app/features/dashboard/`
- `frontend/src/app/core/auth/auth.guard.ts`
- `frontend/src/app/core/theme/theme.service.ts`
