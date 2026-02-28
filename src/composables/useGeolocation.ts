import { useLocationStore } from '@/stores/useLocationStore'
import type { GeolocationError } from '@/types/location'

export function useGeolocation() {
  const locationStore = useLocationStore()

  async function requestLocation(): Promise<boolean> {
    if (!navigator.geolocation) {
      locationStore.setError({
        code: 'POSITION_UNAVAILABLE',
        message: '此瀏覽器不支援地理定位功能',
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
          const geoError = mapGeolocationError(err)
          locationStore.setError(geoError)
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
      )
    })
  }

  return { requestLocation, locationStore }
}

function mapGeolocationError(err: GeolocationPositionError): GeolocationError {
  switch (err.code) {
    case GeolocationPositionError.PERMISSION_DENIED:
      return { code: 'PERMISSION_DENIED', message: '使用者拒絕了位置存取權限，請在瀏覽器設定中允許' }
    case GeolocationPositionError.POSITION_UNAVAILABLE:
      return { code: 'POSITION_UNAVAILABLE', message: '目前無法取得位置資訊，請確認裝置 GPS 是否開啟' }
    case GeolocationPositionError.TIMEOUT:
      return { code: 'TIMEOUT', message: '定位逾時，請再試一次' }
    default:
      return { code: 'UNKNOWN', message: '發生未知錯誤，請再試一次' }
  }
}
