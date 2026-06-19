# U-s-cinema

U-s-cinema is a cinematic movie discovery and personal library app built with **React**, **TypeScript**, and **Vite**. It connects to the TMDB API and focuses on a complete small-app workflow: browsing movies, searching and filtering, opening movie details, saving favorites, managing a watchlist, and preserving local library state.

The project started as a JavaScript React practice app and has been gradually migrated to TypeScript. The current codebase uses typed API responses, typed Context state, typed pages, typed reusable components, and a stricter TypeScript setup.

## Preview

### Home

![Home page](MainFile/docs/screenshot/HomePage.png)

### Movies

![Movies page](MainFile/docs/screenshot/MoviePage.png)

### Favorites

![Favorites page](MainFile/docs/screenshot/FavPage.png)

### Watchlist

![Watchlist page](MainFile/docs/screenshot/WatchListPage.png)

### Movie Details

![Movie details UI]()

## Features

- Cinematic dashboard-style home page
- Featured movie carousel with manual switching and auto-rotation
- TMDB-powered trending, now playing, top rated, discover, and search data
- Movie catalog page with search, genre filters, sorting, and pagination
- Floating movie details modal with backdrop, poster, rating, runtime, genres, and overview
- Favorites management with add/remove behavior
- Watchlist management with `Not Started`, `Watching`, and `Watched` statuses
- Shared local library state persisted through `localStorage`
- Migration support for older `favorites` and `watchlist` local data
- Loading skeletons, empty states, error states, and image fallbacks
- Navbar search, notification dropdown, and user menu dropdown
- TypeScript coverage across API, Context, hooks, pages, and core components

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Context API
- TMDB API
- localStorage
- CSS
- ESLint

## Project Structure

```text
U-s-cinema/
├── DESIGN.md
├── README.md
└── MainFile/
    ├── docs/
    │   └── screenshot/
    ├── package.json
    └── fronted/
        ├── public/
        ├── src/
        │   ├── components/      # Reusable UI components
        │   ├── Contexts/        # Global movie library and modal contexts
        │   ├── constants/       # Genre, sort, and watch status metadata
        │   ├── css/             # Global, page, and component styles
        │   ├── hooks/           # Custom React hooks
        │   ├── pages/           # Route-level pages
        │   ├── services/        # TMDB API layer
        │   ├── types/           # Shared TypeScript models
        │   ├── utils/           # Movie formatting helpers
        │   ├── App.tsx
        │   └── main.tsx
        ├── package.json
        ├── tsconfig.json
        └── vite.config.js
```

## Getting Started

Clone the project and install dependencies from the frontend app directory:

```bash
cd MainFile/fronted
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Add your TMDB API key:

```text
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Start the development server:

```bash
npm run dev
```

The app runs on:

```text
http://localhost:5174
```

## Scripts

Run these commands inside `MainFile/fronted`:

```bash
npm run dev        # Start the Vite development server
npm run typecheck  # Run TypeScript checks
npm run lint       # Run ESLint
npm run build      # Build for production
npm run preview    # Preview the production build
```

The `MainFile/package.json` file also provides forwarding scripts for common commands:

```bash
cd MainFile
npm run dev
npm run build
npm run lint
npm run preview
```

## TypeScript Notes

The project uses TypeScript for the main app surface:

- `services/api.ts` models TMDB request and response boundaries.
- `types/movie.ts` defines movie, movie details, genre, and paged response types.
- `types/library.ts` defines library entries and watch status types.
- Context providers expose typed favorite and watchlist operations.
- Pages and core components are implemented as `.tsx`.
- `tsconfig.json` currently uses `strict: true`.

## Current Status

The app currently passes:

```bash
npm run typecheck
npm run lint
npm run build
```

Future improvements could include automated tests, accessibility audits, richer movie detail sections, trailer support, cast data, and deployment configuration.
