export type PriceLevel =
  | 'PRICE_LEVEL_UNSPECIFIED'
  | 'PRICE_LEVEL_FREE'
  | 'PRICE_LEVEL_INEXPENSIVE'
  | 'PRICE_LEVEL_MODERATE'
  | 'PRICE_LEVEL_EXPENSIVE'
  | 'PRICE_LEVEL_VERY_EXPENSIVE'

export interface PaymentOptions {
  acceptsCreditCards?: boolean
  acceptsDebitCards?: boolean
  acceptsCashOnly?: boolean
  acceptsNfc?: boolean
}

export interface Restaurant {
  id: string
  displayName: string
  address: string
  location: {
    lat: number
    lng: number
  }
  rating?: number
  userRatingCount?: number
  priceLevel?: PriceLevel
  paymentOptions?: PaymentOptions
  googleMapsUri: string
  distanceMeters?: number // straight-line Haversine distance
  isOpen?: boolean        // from currentOpeningHours.openNow
}

export type RestaurantListStatus = 'idle' | 'loading' | 'success' | 'error'

export type RestaurantCategory =
  | 'random'
  | 'taiwanese'
  | 'japanese'
  | 'korean'
  | 'chinese'
  | 'hot_pot'
  | 'southeast_asian'
  | 'western'
  | 'italian'
  | 'cafe_dessert'
  | 'drinks'
  | 'vegetarian'
  | 'fast_food'
