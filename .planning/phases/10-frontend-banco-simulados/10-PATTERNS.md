# Phase 10: Frontend Patterns - MedStudy

## 1. Angular Standalone Component Pattern
Components must be standalone and use the modern `inject()` pattern for dependency injection.

```typescript
@Component({
  selector: 'app-feature-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule],
  templateUrl: './feature-list.component.html',
  styleUrl: './feature-list.component.scss'
})
export class FeatureListComponent {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  
  data = this.store.selectSignal(selectFeatureEntities);
}
```

## 2. NgRx Entity Pattern
Use `createEntityAdapter` for managing lists like Question Sessions and Simulados. This simplifies CRUD operations on the client side.

```typescript
export const adapter = createEntityAdapter<Session>();
export const initialState = adapter.getInitialState({ 
  loading: false,
  currentPage: 1,
  totalCount: 0
});

export const sessionReducer = createReducer(
  initialState,
  on(SessionActions.loadSuccess, (state, { sessions, totalCount }) => 
    adapter.addMany(sessions, { ...state, totalCount, loading: false })),
  on(SessionActions.resetList, (state) => 
    adapter.removeAll({ ...state, currentPage: 1, totalCount: 0 }))
);
```

## 3. Modal Pattern (MatDialog)
Forms for creating sessions and simulados should be implemented as MatDialog components.

```typescript
// Opening the modal
this.dialog.open(SessionFormModalComponent, {
  width: '600px',
  data: { mode: 'create' },
  panelClass: 'glass-dialog' // Use glassmorphism pattern from Phase 9
});
```

## 4. CSS Theming Pattern
Use existing CSS variables to ensure consistency with the app's themes.
- Background: `var(--color-bg)`
- Primary: `var(--color-primary)`
- Surface: `var(--color-surface)`
- Border: `var(--color-border)`

## 5. Analog Files to Reuse
- **Selectors**: `src/app/store/auth/auth.selectors.ts` (State structure reference)
- **Components**: `src/app/features/auth/login/login.component.ts` (Form validation reference)
- **Layout**: `src/app/core/layout/shell/shell.component.ts` (Integration point)
- **Charts (Phase 9)**: `src/app/features/dashboard/components/evolution-chart/evolution-chart.component.ts` (Theme integration reference)
