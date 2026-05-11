# Phase 14 Gap Closure Plan

## 1. Remove LocalStorage Persistence
- **File:** `frontend/src/app/store/auth/auth.effects.ts`
- **Action:** Delete calls to `localStorage.setItem('token', ...)` and `localStorage.setItem('refreshToken', ...)` in the `loginSuccess` and `refreshSuccess` effects.
- **Rationale:** Since we migrated to secure HttpOnly cookies, storing tokens in LocalStorage is redundant and insecure.

## 2. Update Logout logic
- **File:** `frontend/src/app/store/auth/auth.effects.ts`
- **Action:** Ensure `localStorage.removeItem('token')` and `localStorage.removeItem('refreshToken')` are called during logout (for cleanup of legacy data if any).

## 3. Verify Store selectors
- **File:** `frontend/src/app/store/auth/auth.reducer.ts`
- **Action:** Ensure the initial state does NOT attempt to read from `localStorage` if cookies are intended to be the source of truth for the backend.
- **Note:** The frontend Store can still hold the token in memory (non-persistent) for the `Authorization` header fallback, but it must not persist to `localStorage`.

## 4. Final UAT Re-verification
- Run Test 1 again to confirm `localStorage` is empty after login.
