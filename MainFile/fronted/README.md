# U-s-cinema Frontend

React + TypeScript + Vite frontend for the U-s-cinema movie browsing app.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Stack

- React
- TypeScript
- Vite
- React Router
- Context API
- TMDB API
- localStorage

## Notes

The app has been migrated from JavaScript to TypeScript. Core business types live in `src/types`, API requests are typed in `src/services/api.ts`, reusable state is managed through typed Context modules, and shared UI logic such as the featured carousel is extracted into `src/hooks`.
