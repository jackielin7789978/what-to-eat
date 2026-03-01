# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

「附近有什麼吃的？」— A Vue 3 + TypeScript SPA that finds restaurants within 1km of the user's location using Google Places API (New), with walking time via Google Routes API. Deployed on Netlify with serverless functions acting as API proxies (so the Google API key never reaches the frontend).

## Commands

```bash
# Development (requires Netlify CLI)
npm install -g netlify-cli
netlify dev          # Starts both frontend (:5173 via Vite) and functions (:8888)

# Build
npm run build        # Runs vue-tsc type check then vite build

# Code quality
npm run lint         # ESLint with auto-fix for .vue, .ts, .tsx
npm run format       # Prettier for src/**/*.{vue,ts,css} and netlify/**/*.ts

# Test a Netlify Function directly
curl "http://localhost:8888/.netlify/functions/nearby-restaurants?lat=25.05&lng=121.53"
```

**Environment variable required:** `GOOGLE_MAPS_API_KEY` — set in `.env.local` for local dev, Netlify environment variables for production.

## Architecture

### Request Flow

```
Browser → /api/* → Vite proxy (dev) or Netlify redirect (prod)
       → /.netlify/functions/:name → Google APIs (Places / Routes)
```

Frontend never holds the API key. `netlify.toml` maps `/api/*` → `/.netlify/functions/:splat`.

### Frontend Layers

- **`src/types/`** — TypeScript interfaces (`Restaurant`, `UserLocation`, `WalkingTimeResult`, raw API shapes). Single source of truth for all types.
- **`src/stores/`** — Pinia stores using Composition API style (`useRestaurantStore`, `useLocationStore`). Stores hold state and computed sorts; they do NOT call APIs directly.
- **`src/composables/`** — Business logic that bridges stores and services (`useGeolocation`, `useRestaurants`, `useWalkingTime`). Composables call services and update stores.
- **`src/services/`** — Raw `fetch` calls to `/api/*` endpoints (`restaurantService`, `walkingTimeService`).
- **`src/components/`** — Organized into `ui/` (Base* primitives: `BaseButton`, `BaseSpinner`, `BaseError`, `EmptyState`), `restaurant/` (domain components), and `layout/` (header/footer).

### Netlify Functions (`netlify/functions/`)

Each function is a standalone TypeScript file exporting a `Handler`. They validate inputs, call Google APIs server-side with the secret key, and return a unified `{ error, code }` shape on failure — never forwarding raw Google errors to the client.

`nearby-restaurants.ts` uses a **Fisher-Yates shuffle** to randomly pick 10 restaurant types from `ALL_TYPES` on each request, producing diverse results. The radius is capped at 1000m server-side.

### Walking Time Cache

`useRestaurantStore.walkingTimeCache` caches `WalkingTimeResult` by `restaurantId` for the session lifetime. Check the cache before calling the walking time service.

### Path Alias

`@` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.json`).
