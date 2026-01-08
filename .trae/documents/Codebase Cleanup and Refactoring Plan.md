# Codebase Cleanup and Refactoring Plan

Based on the audit of the repository, the codebase is already quite lean and well-structured, but there are opportunities to remove unused assets and improve code quality by converting remaining JSX files to TypeScript.

## 1. Remove Unused Assets
The following default Next.js assets in `public/` are not used in the application and can be safely deleted:
- `public/file.svg`
- `public/globe.svg`
- `public/next.svg`
- `public/vercel.svg`
- `public/window.svg`

## 2. Refactor Components to TypeScript
To improve code quality and maintainability (as per "Ensure code quality"), the following components will be converted from `.jsx` to `.tsx` with proper type definitions:
- `src/components/AirlineAutocomplete.jsx` → `src/components/AirlineAutocomplete.tsx`
- `src/components/AirportAutocomplete.jsx` → `src/components/AirportAutocomplete.tsx`
- `src/app/dashboard/booking/BookingModal.jsx` → `src/app/dashboard/booking/BookingModal.tsx`

## 3. Verification
- **Build Validation**: Run the build process to ensure no type errors or missing dependencies.
- **Functionality Check**: Verify that the booking modal and autocomplete fields continue to work correctly after refactoring.

## Note on "789 files"
The "789 files" count mentioned likely includes `node_modules` or other build artifacts. The actual source code (`src/`) contains approximately 20 files, all of which are actively used (including the `test-api` diagnostic page).

No unused components or functions were found in `src/` that need deletion. The cleanup will focus on assets and type safety.