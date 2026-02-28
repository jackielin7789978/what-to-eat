# 附近有什麼吃的？— 規格書

> Vue 3 + TypeScript SPA，查詢使用者周邊 1.0km 餐廳，並提供步行時間與 Google Maps 連結。

---

## 1. 功能規格

| 功能         | 說明                                                   |
| ------------ | ------------------------------------------------------ |
| 取得定位     | 使用瀏覽器 Geolocation API，需使用者授權               |
| 搜尋餐廳     | 方圓 1.0km 內的餐廳（最多 20 筆）                      |
| 排序切換     | 依「距離」（Haversine 直線）或「評分」排序             |
| 步行時間     | 點擊「要走多久」按鈕，呼叫 Routes API 取得步行路線時間 |
| 開啟地圖     | 點擊餐廳卡片，在新分頁開啟 Google Maps                 |
| 節流保護     | 取得餐廳按鈕呼叫後 10 秒內 disabled                    |
| 步行時間快取 | session 期間快取，避免重複打 API                       |

---

## 2. 型別定義

### 2.1 `UserLocation`

```ts
interface UserLocation {
  lat: number
  lng: number
  accuracy?: number
  timestamp?: number
}

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error'

interface GeolocationError {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT' | 'UNKNOWN'
  message: string
}
```

### 2.2 `Restaurant`

```ts
type PriceLevel =
  | 'PRICE_LEVEL_UNSPECIFIED'
  | 'PRICE_LEVEL_FREE'
  | 'PRICE_LEVEL_INEXPENSIVE'
  | 'PRICE_LEVEL_MODERATE'
  | 'PRICE_LEVEL_EXPENSIVE'
  | 'PRICE_LEVEL_VERY_EXPENSIVE'

interface PaymentOptions {
  acceptsCreditCards?: boolean
  acceptsDebitCards?: boolean
  acceptsCashOnly?: boolean
  acceptsNfc?: boolean
}

interface Restaurant {
  id: string
  displayName: string
  address: string
  location: { lat: number; lng: number }
  rating?: number
  userRatingCount?: number
  priceLevel?: PriceLevel
  paymentOptions?: PaymentOptions
  googleMapsUri: string
  distanceMeters?: number // Haversine 直線距離
}

type RestaurantListStatus = 'idle' | 'loading' | 'success' | 'error'
```

### 2.3 `WalkingTime`

```ts
interface WalkingTimeRequest {
  originLat: number
  originLng: number
  destLat: number
  destLng: number
}

interface WalkingTimeResult {
  durationSeconds: number
  distanceMeters: number
  formattedDuration: string // e.g. "約 8 分鐘"
}

type WalkingTimeStatus = 'idle' | 'loading' | 'success' | 'error'
```

### 2.4 API 原始型別

```ts
// Places API (New) response
interface PlacesNearbyResponse {
  places: PlaceRaw[]
}

interface PlaceRaw {
  id: string
  displayName?: { text: string; languageCode?: string }
  formattedAddress?: string
  location?: { latitude: number; longitude: number }
  rating?: number
  userRatingCount?: number
  priceLevel?: PriceLevel
  paymentOptions?: PaymentOptions
  googleMapsUri?: string
}

// Routes API response
interface RoutesResponse {
  routes: Array<{ duration: string; distanceMeters: number }>
}

// Unified error shape from Netlify Functions
interface ApiErrorResponse {
  error: string
  code: 'INVALID_PARAMS' | 'UPSTREAM_ERROR' | 'NOT_FOUND' | 'INTERNAL_ERROR'
}
```

---

## 3. API 規格

### 3.1 `GET /api/nearby-restaurants`

Proxy to `POST https://places.googleapis.com/v1/places:searchNearby`

**Request params:**

| 參數   | 型別   | 必填 | 說明                 |
| ------ | ------ | ---- | -------------------- |
| lat    | number | ✅   | 緯度 (-90 ~ 90)      |
| lng    | number | ✅   | 經度 (-180 ~ 180)    |
| radius | number | ❌   | 最大 1000，預設 1000 |

**Response 200:**

```json
{
  "places": [
    /* PlaceRaw[] */
  ]
}
```

**Error responses:**

| HTTP | code             | 說明                |
| ---- | ---------------- | ------------------- |
| 400  | `INVALID_PARAMS` | 座標格式錯誤        |
| 502  | `UPSTREAM_ERROR` | Google API 回傳錯誤 |
| 500  | `INTERNAL_ERROR` | 伺服器設定錯誤      |

---

### 3.2 `GET /api/walking-time`

Proxy to `POST https://routes.googleapis.com/directions/v2:computeRoutes`

**Request params:**

| 參數      | 型別   | 必填 |
| --------- | ------ | ---- |
| originLat | number | ✅   |
| originLng | number | ✅   |
| destLat   | number | ✅   |
| destLng   | number | ✅   |

**Response 200:**

```json
{
  "durationSeconds": 520,
  "distanceMeters": 680
}
```

**Response headers:** `Cache-Control: public, max-age=300`

**Error responses:**

| HTTP | code             | 說明                |
| ---- | ---------------- | ------------------- |
| 400  | `INVALID_PARAMS` | 座標格式錯誤        |
| 404  | `NOT_FOUND`      | 找不到步行路線      |
| 502  | `UPSTREAM_ERROR` | Google API 回傳錯誤 |
| 500  | `INTERNAL_ERROR` | 伺服器設定錯誤      |

---

## 4. 元件 Props / Emits

### `RestaurantCard`

| Prop       | 型別         | 說明     |
| ---------- | ------------ | -------- |
| restaurant | `Restaurant` | 餐廳資料 |

### `RestaurantList`

| Prop         | 型別                   | 說明     |
| ------------ | ---------------------- | -------- |
| restaurants  | `Restaurant[]`         | 餐廳列表 |
| status       | `RestaurantListStatus` | 載入狀態 |
| errorMessage | `string \| null`       | 錯誤訊息 |

### `RestaurantRating`

| Prop   | 型別      | 說明       |
| ------ | --------- | ---------- |
| rating | `number`  | 評分 (0–5) |
| count  | `number?` | 評論數     |

### `PaymentBadge`

| Prop    | 型別              | 說明         |
| ------- | ----------------- | ------------ |
| options | `PaymentOptions?` | 付款方式資料 |

### `BaseButton`

| Prop     | 型別                                  | 預設        | 說明      |
| -------- | ------------------------------------- | ----------- | --------- |
| variant  | `'primary' \| 'secondary' \| 'ghost'` | `'primary'` | 按鈕樣式  |
| size     | `'sm' \| 'md' \| 'lg'`                | `'md'`      | 尺寸      |
| type     | `'button' \| 'submit' \| 'reset'`     | `'button'`  | HTML type |
| disabled | `boolean`                             | `false`     | 是否禁用  |

### `BaseSpinner`

| Prop  | 型別                   | 預設        | 說明       |
| ----- | ---------------------- | ----------- | ---------- |
| size  | `'sm' \| 'md' \| 'lg'` | `'md'`      | 尺寸       |
| label | `string`               | `'載入中…'` | aria-label |

### `BaseError`

| Prop    | 型別      | 說明                         |
| ------- | --------- | ---------------------------- |
| title   | `string`  | 錯誤標題（預設「發生錯誤」） |
| message | `string?` | 詳細說明                     |

### `EmptyState`

| Prop        | 型別      | 說明             |
| ----------- | --------- | ---------------- |
| icon        | `string`  | Emoji（預設 🍽️） |
| title       | `string`  | 主要文字         |
| description | `string?` | 補充說明         |

---

## 5. 主題 Token 表

| Token                   | 值             | 用途               |
| ----------------------- | -------------- | ------------------ |
| `--color-primary-500`   | `#f97316`      | 主按鈕背景、強調色 |
| `--color-primary-600`   | `#ea580c`      | hover 狀態         |
| `--color-secondary-400` | `#facc15`      | 評分星星           |
| `--color-surface`       | `#fafaf9`      | 頁面背景           |
| `--color-surface-card`  | `#ffffff`      | 卡片背景           |
| `--color-text-base`     | `#1c1917`      | 主要文字           |
| `--color-text-muted`    | `#78716c`      | 次要文字           |
| `--radius-card`         | `1rem`         | 卡片圓角           |
| `--radius-btn`          | `9999px`       | 按鈕圓角（膠囊狀） |
| `--shadow-card`         | `0 2px 8px …`  | 卡片陰影           |
| `--shadow-card-hover`   | `0 8px 24px …` | 卡片 hover 陰影    |

---

## 6. 安全性規範

| 措施                | 說明                                                             |
| ------------------- | ---------------------------------------------------------------- |
| API key 隔離        | 僅存 Netlify 環境變數，前端 bundle 不含任何金鑰                  |
| Google Console 限制 | API key 設 HTTP referrer 限制，僅允許 Netlify domain + localhost |
| 輸入驗證            | Netlify Functions 驗證座標數值範圍                               |
| radius 上限         | 強制最大 1500m，防止濫用高計費搜尋                               |
| 節流                | 前端按鈕 10 秒 throttle                                          |
| 步行時間快取        | session 期間快取，Routes API 回應亦帶 `max-age=300`              |
| 錯誤遮蔽            | Functions 不轉發 Google 原始錯誤，統一回傳 `{ error, code }`     |
| `.gitignore`        | `.env`、`.env.local` 確保不進 repo                               |

---

## 7. 本地開發指南

```bash
# 1. 安裝依賴
npm install

# 2. 設定環境變數
cp .env.example .env.local
# 編輯 .env.local，填入 GOOGLE_MAPS_API_KEY

# 3. 啟動（需 Netlify CLI）
npm install -g netlify-cli
netlify dev
# → Functions 在 :8888，前端在 :5173（Vite proxy 到 8888）

# 4. 測試 Function 直接呼叫
curl "http://localhost:8888/.netlify/functions/nearby-restaurants?lat=25.05&lng=121.53"
```

---

## 8. Netlify 部署指南

1. 將專案 push 到 GitHub
2. Netlify → New site from Git → 選擇 repo
3. Build settings（已在 `netlify.toml` 定義，通常自動偵測）：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Site settings → Environment variables → 新增 `GOOGLE_MAPS_API_KEY`
5. Google Cloud Console → API key → 設定 HTTP referrers 限制（填入 Netlify domain）
6. Trigger deploy

---

## 9. 目錄結構

```
what-to-eat/
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── spec.md
├── netlify/
│   └── functions/
│       ├── nearby-restaurants.ts
│       └── walking-time.ts
└── src/
    ├── main.ts
    ├── App.vue
    ├── env.d.ts
    ├── types/
    │   ├── restaurant.ts
    │   ├── location.ts
    │   ├── walkingTime.ts
    │   └── api.ts
    ├── stores/
    │   ├── useRestaurantStore.ts
    │   └── useLocationStore.ts
    ├── composables/
    │   ├── useGeolocation.ts
    │   ├── useRestaurants.ts
    │   └── useWalkingTime.ts
    ├── services/
    │   ├── restaurantService.ts
    │   └── walkingTimeService.ts
    ├── router/
    │   └── index.ts
    ├── views/
    │   └── HomeView.vue
    ├── components/
    │   ├── layout/
    │   │   ├── AppHeader.vue
    │   │   └── AppFooter.vue
    │   ├── restaurant/
    │   │   ├── RestaurantCard.vue
    │   │   ├── RestaurantList.vue
    │   │   ├── RestaurantRating.vue
    │   │   └── PaymentBadge.vue
    │   └── ui/
    │       ├── BaseButton.vue
    │       ├── BaseSpinner.vue
    │       ├── BaseError.vue
    │       └── EmptyState.vue
    └── assets/
        └── styles/
            ├── main.css
            └── animations.css
```
