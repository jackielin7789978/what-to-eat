import type { Restaurant } from '@/types/restaurant'
import type { PlacesNearbyResponse, PlaceRaw, ApiErrorResponse } from '@/types/api'

async function fetchNearby(lat: number, lng: number, radius = 1000, category = 'random'): Promise<Restaurant[]> {
  const url = `/api/nearby-restaurants?lat=${lat}&lng=${lng}&radius=${radius}&category=${category}`
  const res = await fetch(url)

  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({
      error: 'Unknown error',
      code: 'INTERNAL_ERROR' as const,
    }))
    if (body.code === 'QUOTA_EXCEEDED') throw new Error('QUOTA_EXCEEDED')
    throw new Error(body.error)
  }

  const data: PlacesNearbyResponse = await res.json()
  return (data.places ?? []).map(transformPlace)
}

function transformPlace(raw: PlaceRaw): Restaurant {
  return {
    id: raw.id,
    displayName: raw.displayName?.text ?? '（未命名）',
    address: raw.formattedAddress ?? '',
    location: {
      lat: raw.location?.latitude ?? 0,
      lng: raw.location?.longitude ?? 0,
    },
    rating: raw.rating,
    userRatingCount: raw.userRatingCount,
    priceLevel: raw.priceLevel,
    paymentOptions: raw.paymentOptions,
    googleMapsUri: raw.googleMapsUri ?? `https://www.google.com/maps/place/?q=place_id:${raw.id}`,
    isOpen: raw.currentOpeningHours?.openNow,
  }
}

export const restaurantService = { fetchNearby }
