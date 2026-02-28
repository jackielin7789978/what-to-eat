import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Restaurant, RestaurantListStatus } from '@/types/restaurant'
import type { WalkingTimeResult } from '@/types/walkingTime'

export const useRestaurantStore = defineStore('restaurant', () => {
  const restaurants = ref<Restaurant[]>([])
  const status = ref<RestaurantListStatus>('idle')
  const errorMessage = ref<string | null>(null)
  const walkingTimeCache = ref<Record<string, WalkingTimeResult>>({})

  const sortedByDistance = computed(() =>
    [...restaurants.value].sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0)),
  )

  const sortedByRating = computed(() =>
    [...restaurants.value].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)),
  )

  function setRestaurants(list: Restaurant[]) {
    restaurants.value = list
    status.value = 'success'
    errorMessage.value = null
  }

  function setLoading() {
    status.value = 'loading'
    errorMessage.value = null
  }

  function setError(msg: string) {
    status.value = 'error'
    errorMessage.value = msg
    restaurants.value = []
  }

  function cacheWalkingTime(restaurantId: string, result: WalkingTimeResult) {
    walkingTimeCache.value[restaurantId] = result
  }

  function getCachedWalkingTime(restaurantId: string): WalkingTimeResult | null {
    return walkingTimeCache.value[restaurantId] ?? null
  }

  return {
    restaurants,
    status,
    errorMessage,
    walkingTimeCache,
    sortedByDistance,
    sortedByRating,
    setRestaurants,
    setLoading,
    setError,
    cacheWalkingTime,
    getCachedWalkingTime,
  }
})
