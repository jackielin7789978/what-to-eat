import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserLocation, GeolocationStatus, GeolocationError } from '@/types/location'

export const useLocationStore = defineStore('location', () => {
  const location = ref<UserLocation | null>(null)
  const status = ref<GeolocationStatus>('idle')
  const error = ref<GeolocationError | null>(null)

  const hasLocation = computed(() => location.value !== null)

  const latLng = computed(() => {
    if (!location.value) return null
    return { lat: location.value.lat, lng: location.value.lng }
  })

  function setLocation(loc: UserLocation) {
    location.value = loc
    status.value = 'success'
    error.value = null
  }

  function setLoading() {
    status.value = 'loading'
    error.value = null
  }

  function setError(err: GeolocationError) {
    status.value = 'error'
    error.value = err
    location.value = null
  }

  return { location, status, error, hasLocation, latLng, setLocation, setLoading, setError }
})
