import { useI18n } from 'vue-i18n'
import { useLocationStore } from '@/stores/useLocationStore'
import type { GeolocationError } from '@/types/location'

export function useGeolocation() {
  const locationStore = useLocationStore()
  const { t } = useI18n()

  async function requestLocation(): Promise<boolean> {
    if (!navigator.geolocation) {
      locationStore.setError({
        code: 'POSITION_UNAVAILABLE',
        message: t('geolocation.unsupported'),
      })
      return false
    }

    locationStore.setLoading()

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locationStore.setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          })
          resolve(true)
        },
        (err) => {
          const geoError = mapGeolocationError(err, t)
          locationStore.setError(geoError)
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
      )
    })
  }

  return { requestLocation, locationStore }
}

function mapGeolocationError(
  err: GeolocationPositionError,
  t: (key: string) => string,
): GeolocationError {
  switch (err.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return { code: 'PERMISSION_DENIED', message: t('geolocation.permissionDenied') }
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return { code: 'POSITION_UNAVAILABLE', message: t('geolocation.positionUnavailable') }
    case GeolocationPositionError.TIMEOUT:
      return { code: 'TIMEOUT', message: t('geolocation.timeout') }
    default:
      return { code: 'UNKNOWN', message: t('geolocation.unknown') }
  }
}
