export interface WalkingTimeRequest {
  originLat: number
  originLng: number
  destLat: number
  destLng: number
}

export interface WalkingTimeResult {
  durationSeconds: number
  distanceMeters: number
  formattedDuration: string // e.g. "約 8 分鐘"
}

export type WalkingTimeStatus = 'idle' | 'loading' | 'success' | 'error'
