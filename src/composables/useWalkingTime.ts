import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRestaurantStore } from '@/stores/useRestaurantStore'
import { useLocationStore } from '@/stores/useLocationStore'
import { walkingTimeService } from '@/services/walkingTimeService'
import type { WalkingTimeStatus } from '@/types/walkingTime'

export function useWalkingTime(restaurantId: string, destLat: number, destLng: number) {
  const restaurantStore = useRestaurantStore()
  const locationStore = useLocationStore()
  const { t } = useI18n()

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
      error.value = t('walkingTime.noLocation')
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

      const minutes = Math.ceil(result.durationSeconds / 60)
      const fullResult = {
        ...result,
        formattedDuration: t('walkingTime.duration', { minutes }),
      }

      restaurantStore.cacheWalkingTime(restaurantId, fullResult)
      formattedDuration.value = fullResult.formattedDuration
      status.value = 'success'
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : t('walkingTime.fetchError')
      status.value = 'error'
    }
  }

  return { status, formattedDuration, error, fetch }
}
