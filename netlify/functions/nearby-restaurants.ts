import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchNearby'
const MAX_RADIUS = 1000
const PICK_COUNT = 10  // 每次從全部類型中隨機抽取的數量

const ALL_TYPES = [
  // 台灣在地 + 通用
  'restaurant', 'taiwanese_restaurant', 'chinese_restaurant', 'cantonese_restaurant',
  'dim_sum_restaurant', 'dumpling_restaurant', 'noodle_shop', 'chinese_noodle_restaurant',
  'hot_pot_restaurant', 'snack_bar', 'buffet_restaurant', 'cafeteria',
  'breakfast_restaurant', 'soup_restaurant', 'food_court', 'seafood_restaurant',
  'vegetarian_restaurant', 'barbecue_restaurant', 'family_restaurant', 'fast_food_restaurant',
  // 亞洲料理
  'japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant', 'tonkatsu_restaurant',
  'japanese_curry_restaurant', 'yakiniku_restaurant', 'yakitori_restaurant',
  'korean_restaurant', 'korean_barbecue_restaurant',
  'thai_restaurant', 'vietnamese_restaurant', 'malaysian_restaurant', 'indonesian_restaurant',
  // 西式 + 咖啡甜點
  'pizza_restaurant', 'hamburger_restaurant', 'steak_house', 'sandwich_shop',
  'cafe', 'coffee_shop', 'bakery', 'tea_house',
  'dessert_restaurant', 'dessert_shop', 'ice_cream_shop', 'cake_shop', 'juice_shop',
]

const CATEGORY_TYPES: Record<string, string[]> = {
  taiwanese: ['taiwanese_restaurant', 'noodle_shop', 'snack_bar', 'breakfast_restaurant', 'soup_restaurant', 'food_court', 'cafeteria', 'buffet_restaurant', 'seafood_restaurant'],
  japanese: ['japanese_restaurant', 'sushi_restaurant', 'ramen_restaurant', 'tonkatsu_restaurant', 'japanese_curry_restaurant', 'yakiniku_restaurant', 'yakitori_restaurant', 'japanese_izakaya_restaurant'],
  korean: ['korean_restaurant', 'korean_barbecue_restaurant'],
  chinese: ['cantonese_restaurant', 'dim_sum_restaurant', 'dumpling_restaurant', 'chinese_noodle_restaurant', 'chinese_restaurant'],
  hot_pot: ['hot_pot_restaurant', 'mongolian_barbecue_restaurant'],
  southeast_asian: ['thai_restaurant', 'vietnamese_restaurant', 'malaysian_restaurant', 'indonesian_restaurant', 'filipino_restaurant'],
  western: ['hamburger_restaurant', 'steak_house', 'sandwich_shop', 'fast_food_restaurant', 'family_restaurant', 'american_restaurant', 'western_restaurant'],
  italian: ['italian_restaurant', 'pizza_restaurant'],
  cafe_dessert: ['cafe', 'coffee_shop', 'bakery', 'dessert_restaurant', 'dessert_shop', 'ice_cream_shop', 'cake_shop', 'pastry_shop'],
  drinks: ['juice_shop', 'tea_house'],
  vegetarian: ['vegetarian_restaurant', 'vegan_restaurant'],
  fast_food: ['fast_food_restaurant', 'hamburger_restaurant', 'sandwich_shop'],
}

// Fisher-Yates Shuffle 洗牌演算法
function pickRandomTypes(): string[] {
  const arr = [...ALL_TYPES]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, PICK_COUNT)
}

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.rating',
  'places.userRatingCount',
  'places.priceLevel',
  'places.paymentOptions',
  'places.googleMapsUri',
  'places.currentOpeningHours.openNow',
].join(',')

function errorResponse(status: number, code: string, message: string) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: message, code }),
  }
}

export const handler: Handler = async (event: HandlerEvent, _ctx: HandlerContext) => {
  if (event.httpMethod !== 'GET') {
    return errorResponse(405, 'INVALID_PARAMS', 'Method not allowed')
  }

  const { lat, lng, radius, category } = event.queryStringParameters ?? {}

  // ── Input validation ─────────────────────────────────────────────────────
  const latNum = parseFloat(lat ?? '')
  const lngNum = parseFloat(lng ?? '')
  const radiusNum = Math.min(parseInt(radius ?? '1000', 10), MAX_RADIUS)

  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return errorResponse(400, 'INVALID_PARAMS', 'lat must be a number between -90 and 90')
  }
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return errorResponse(400, 'INVALID_PARAMS', 'lng must be a number between -180 and 180')
  }
  if (isNaN(radiusNum) || radiusNum <= 0) {
    return errorResponse(400, 'INVALID_PARAMS', 'radius must be a positive number')
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    return errorResponse(503, 'NO_API_KEY', '尚未設定 Google Maps API 金鑰')
  }

  // ── Determine includedTypes ──────────────────────────────────────────────
  const includedTypes =
    category && category !== 'random' && category in CATEGORY_TYPES
      ? CATEGORY_TYPES[category]
      : pickRandomTypes()

  // ── Call Places API (New) ────────────────────────────────────────────────
  try {
    const response = await fetch(PLACES_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': FIELD_MASK,
      },
      body: JSON.stringify({
        includedTypes,
        maxResultCount: 20,
        languageCode: 'zh-TW',
        locationRestriction: {
          circle: {
            center: { latitude: latNum, longitude: lngNum },
            radius: radiusNum,
          },
        },
      }),
    })

    if (!response.ok) {
      const status = response.status
      const rawError = await response.json().catch(() => ({}))
      console.error('[nearby-restaurants] Google API error', status, JSON.stringify(rawError))

      if (status === 429) {
        return errorResponse(429, 'QUOTA_EXCEEDED', '伺服器忙碌中，API 使用量已達上限')
      }
      if (status === 403) {
        const body = JSON.stringify(rawError)
        if (body.includes('RESOURCE_EXHAUSTED') || body.includes('rateLimitExceeded')) {
          return errorResponse(429, 'QUOTA_EXCEEDED', '伺服器忙碌中，API 使用量已達上限')
        }
        return errorResponse(502, 'UPSTREAM_ERROR', 'API access denied')
      }
      if (status === 400) return errorResponse(400, 'INVALID_PARAMS', 'Invalid search parameters')
      return errorResponse(502, 'UPSTREAM_ERROR', 'Upstream service error')
    }

    const data = await response.json()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
      body: JSON.stringify({ places: data.places ?? [] }),
    }
  } catch {
    return errorResponse(500, 'INTERNAL_ERROR', 'Failed to reach upstream service')
  }
}
