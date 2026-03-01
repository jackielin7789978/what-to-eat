import type { PriceLevel, PaymentOptions } from './restaurant'

// ── Places API (New) ──────────────────────────────────────────────────────────

export interface PlaceRaw {
  id: string
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  priceLevel?: PriceLevel
  paymentOptions?: PaymentOptions
  googleMapsUri?: string
  currentOpeningHours?: {
    openNow?: boolean
  }
}

export interface PlacesNearbyResponse {
  places: PlaceRaw[]
}

// ── Routes API ────────────────────────────────────────────────────────────────

export interface RoutesResponse {
  routes: Array<{
    duration: string   // e.g. "520s"
    distanceMeters: number
  }>
}

// ── Unified error shape returned by Netlify Functions ─────────────────────────

export interface ApiErrorResponse {
  error: string
  code: 'INVALID_PARAMS' | 'UPSTREAM_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'NO_API_KEY' | 'QUOTA_EXCEEDED'
}
