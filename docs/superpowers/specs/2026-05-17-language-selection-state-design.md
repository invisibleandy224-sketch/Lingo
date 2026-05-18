# Language Selection State Integration Design

**Date:** 2026-05-17
**Status:** Draft

## Overview

Integrate persistent language selection state using Zustand with AsyncStorage. Authenticated users without a selected language are routed to the language selection screen. After selecting a language, they access the home screen. A logout button returns users to the sign-in/sign-up flow.

## Architecture

### State Management

**Store:** `store/useLanguageStore.ts`
- **State:** `selectedLanguageId: string | null`
- **Actions:**
  - `setSelectedLanguage(id: string)` - persists selection to AsyncStorage
  - `clearLanguage()` - removes selection from AsyncStorage
- **Persistence:** Zustand `persist` middleware with `@react-native-async-storage/async-storage`

### Routing Flow

```
Not authenticated → /onboarding → /sign-in or /sign-up
Authenticated, no language → /language-select
Authenticated, has language → / (home screen)
```

**Transitions:**
- Login success → check language store → route accordingly
- Language selection "Continue" → save to store → navigate to `/language/[id]`
- Home screen logout → `signOut()` → redirects to `/onboarding`
- Home screen "Reset Language" → `clearLanguage()` → redirects to `/language-select`

## Components

### 1. `store/useLanguageStore.ts` (New)

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageStore {
  selectedLanguageId: string | null;
  setSelectedLanguage: (id: string) => void;
  clearLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setSelectedLanguage: (id) => set({ selectedLanguageId: id }),
      clearLanguage: () => set({ selectedLanguageId: null }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
```

### 2. `app/index.tsx` (Modified)

**Changes:**
- Import `useLanguageStore`
- On load, check `selectedLanguageId`:
  - If `null` → `router.replace("/language-select")`
  - If set → show existing home UI unchanged
- Preserve existing logout button in header (top right)
- Add "Reset Language" button below header for testing purposes

**UI Preservation:**
- All existing UI elements remain exactly as-is
- Only routing logic and reset button are added

### 3. `app/language-select.tsx` (Modified)

**Changes:**
- Import `useLanguageStore`
- Initialize `selectedId` from store instead of hardcoded "es"
- On "Continue" press:
  1. Call `setSelectedLanguage(selectedId)`
  2. Navigate to `/language/[id]`

### 4. Dependencies

Install:
```bash
npm install zustand @react-native-async-storage/async-storage
```

Note: Both packages already exist in package-lock.json from expo dependencies, but explicit installation ensures they're in package.json.

## Data Flow

1. **User logs in**
   - Clerk auth succeeds
   - `index.tsx` checks `useLanguageStore.selectedLanguageId`
   - If null → redirect to `/language-select`
   - If set → show home screen

2. **User selects language**
   - Taps language card → updates local `selectedId` state
   - Taps "Continue" → `setSelectedLanguage(id)` persists to AsyncStorage
   - Navigates to `/language/[id]`

3. **User returns to app**
   - AsyncStorage hydrates store on app load
   - `index.tsx` reads persisted `selectedLanguageId`
   - Routes to home screen if language exists

4. **User resets language (testing)**
   - Taps "Reset Language" button on home screen
   - `clearLanguage()` removes from AsyncStorage
   - Redirects to `/language-select`

5. **User logs out**
   - Taps logout button on home screen
   - `signOut()` clears Clerk session
   - Redirects to `/onboarding`

## Error Handling

- **No languages in store:** Handled by routing to `/language-select`
- **Invalid language ID:** `language/[id].tsx` already shows "Language not found" state
- **AsyncStorage failure:** Zustand persist middleware handles silently; store falls back to initial state

## Testing Strategy

1. Fresh login → verify redirect to `/language-select`
2. Select language + Continue → verify persistence and navigation to `/language/[id]`
3. Restart app → verify home screen loads with selected language
4. Tap "Reset Language" → verify redirect to `/language-select`
5. Logout → verify redirect to `/onboarding`
6. Re-login → verify redirect to `/language-select` (since language was cleared)
