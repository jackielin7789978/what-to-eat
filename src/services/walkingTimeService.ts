import type { WalkingTimeRequest } from '@/types/walkingTime'
import type { ApiErrorResponse } from '@/types/api'

interface WalkingTimeRaw {
  durationSeconds: number
  distanceMeters: number
}

async function fetchWalkingTime(req: WalkingTimeRequest): Promise<WalkingTimeRaw> {
  const { originLat, originLng, destLat, destLng } = req
  const url =
    `/api/walking-time` +
    `?originLat=${originLat}&originLng=${originLng}` +
    `&destLat=${destLat}&destLng=${destLng}`

  const res = await fetch(url)

  if (!res.ok) {
    const body: ApiErrorResponse = await res.json().catch(() => ({
      error: 'Unknown error',
      code: 'INTERNAL_ERROR',
    }))
    throw new Error(body.error)
  }

  return res.json()
}

export const walkingTimeService = { fetchWalkingTime }
