import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes'
const FIELD_MASK = 'routes.duration,routes.distanceMeters'

function errorResponse(status: number, code: string, message: string) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message, code }),
  }
}

function parseCoord(value: string | undefined, name: string, min: number, max: number) {
  const n = parseFloat(value ?? '')
  if (isNaN(n) || n < min || n > max) {
    return { value: null, error: `${name} must be between ${min} and ${max}` }
  }
  return { value: n, error: null }
}

export const handler: Handler = async (event: HandlerEvent, _ctx: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'INVALID_PARAMS', 'Method not allowed')
  }

  const { originLat, originLng, destLat, destLng } = event.queryStringParameters ?? {}

  // ── Input validation ─────────────────────────────────────────────────────
  const oLat = parseCoord(originLat, 'originLat', -90, 90)
  const oLng = parseCoord(originLng, 'originLng', -180, 180)
  const dLat = parseCoord(destLat, 'destLat', -90, 90)
  const dLng = parseCoord(destLng, 'destLng', -180, 180)

  for (const coord of [oLat, oLng, dLat, dLng]) {
    if (coord.error) return errorResponse(400, 'INVALID_PARAMS', coord.error)
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return errorResponse(503, 'NO_API_KEY', '尚未設定 Google Maps API 金鑰')
  }

  // ── Call Routes API ──────────────────────────────────────────────────────
  try {
    const response = await fetch(ROUTES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        origin: {
          location: { latLng: { latitude: oLat.value, longitude: oLng.value } },
        },
        destination: {
          location: { latLng: { latitude: dLat.value, longitude: dLng.value } },
        },
        travelMode: 'WALK',
        // routingPreference must NOT be set for WALK mode
      }),
    })

    if (!response.ok) {
      const status = response.status
      const rawError = await response.json().catch(() => ({}))
      console.error('[walking-time] Google API error', status, JSON.stringify(rawError))
      if (status === 400) return errorResponse(400, 'INVALID_PARAMS', 'Invalid route parameters')
      return errorResponse(502, 'UPSTREAM_ERROR', 'Upstream service error')
    }

    const data = await response.json()
    const route = data.routes?.[0]

    if (!route) {
      return errorResponse(404, 'NOT_FOUND', 'No walking route found')
    }

    // Parse duration: "520s" → 520
    const durationSeconds = parseInt((route.duration as string).replace('s', ''), 10)
    const distanceMeters: number = route.distanceMeters

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300', // cacheable for 5 minutes
      },
      body: JSON.stringify({ durationSeconds, distanceMeters }),
    }
  } catch {
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reach upstream service')
  }
}
