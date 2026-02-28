import { ref } from 'vue'
import { useRestaurantStore } from '@/stores/useRestaurantStore'
import { useLocationStore } from '@/stores/useLocationStore'
import { walkingTimeService } from '@/services/walkingTimeService'
import type { WalkingTimeStatus } from '@/types/walkingTime'

function formatDuration(seconds: number): string {
  const minutes = Math.ceil(seconds / 60)
  return `約 ${minutes} 分鐘`
}

export function useWalkingTime(restaurantId: string, destLat: number, destLng: number) {
  const restaurantStore = useRestaurantStore()
  const locationStore = useLocationStore()

  const status = ref<WalkingTimeStatus>('idle')
  const formattedDuration = ref<string | null>(null)
  const error = ref<string | null>(null)

  // Check cache first
  const cached = restaurantStore.getCachedWalkingTime(restaurantId)
  if (cached) {
    status.value = 'success'
    formattedDuration.value = cached.formattedDuration
  }

  async function fetch() {
    // Return from cache if available
    const cached = restaurantStore.getCachedWalkingTime(restaurantId)
    if (cached) {
      status.value = 'success'
      formattedDuration.value = cached.formattedDuration
      return
    }

    if (!locationStore.latLng) {
      error.value = '尚未取得定位'
      status.value = 'error'
      return
    }

    status.value = 'loading'
    error.value = null

    try {
      const result = await walkingTimeService.fetchWalkingTime({
        originLat: locationStore.latLng.lat,
        originLng: locationStore.latLng.lng,
        destLat,
        destLng,
      })

      const fullResult = {
        ...result,
        formattedDuration: formatDuration(result.durationSeconds),
      }

      restaurantStore.cacheWalkingTime(restaurantId, fullResult)
      formattedDuration.value = fullResult.formattedDuration
      status.value = 'success'
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '無法取得步行時間'
      status.value = 'error'
    }
  }

  return { status, formattedDuration, error, fetch }
}
