import { ref, computed } from 'vue'
import { useGeolocation } from './useGeolocation'
import { useRestaurantStore } from '@/stores/useRestaurantStore'
import { restaurantService } from '@/services/restaurantService'

export type SortMode = 'distance' | 'rating'

const THROTTLE_MS = 10_000

/** Haversine formula — returns distance in metres */
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function useRestaurants() {
  const restaurantStore = useRestaurantStore()
  const { requestLocation, locationStore } = useGeolocation()

  const sortBy = ref<SortMode>('distance')
  const openNowFilter = ref(true)
  const isThrottled = ref(false)
  let throttleTimer: ReturnType<typeof setTimeout> | null = null

  const displayedRestaurants = computed(() => {
    const sorted =
      sortBy.value === 'rating'
        ? restaurantStore.sortedByRating
        : restaurantStore.sortedByDistance
    if (!openNowFilter.value) return sorted
    return sorted.filter((r) => r.isOpen === true)
  })

  const canFetch = computed(() => !isThrottled.value && restaurantStore.status !== 'loading')

  async function fetchNearby() {
    if (!canFetch.value) return

    isThrottled.value = true
    if (throttleTimer) clearTimeout(throttleTimer)
    throttleTimer = setTimeout(() => { isThrottled.value = false }, THROTTLE_MS)

    const ok = await requestLocation()
    if (!ok || !locationStore.latLng) return

    const { lat, lng } = locationStore.latLng

    restaurantStore.setLoading()
    try {
      const raw = await restaurantService.fetchNearby(lat, lng, 1000)

      const withDistance = raw.map((r) => ({
        ...r,
        distanceMeters:
          r.location ? haversineMeters(lat, lng, r.location.lat, r.location.lng) : undefined,
      }))

      restaurantStore.setRestaurants(withDistance)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '無法取得附近餐廳，請稍後再試'
      restaurantStore.setError(msg)
    }
  }

  function setSortBy(mode: SortMode) {
    sortBy.value = mode
  }

  return {
    sortBy,
    openNowFilter,
    canFetch,
    isThrottled,
    displayedRestaurants,
    restaurantStore,
    fetchNearby,
    setSortBy,
  }
}
