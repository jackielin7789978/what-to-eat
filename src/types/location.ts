export interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: number
}

export type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error'

export interface GeolocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN'
  message: string
}
