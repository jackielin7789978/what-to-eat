## Context

專案使用 Vue 3 + Tailwind CSS，已在 `main.css` 定義 `.dark` class 下的 CSS 變數覆寫，Tailwind 設定 `darkMode: 'class'`。目前缺少在 `<html>` 元素上切換 `.dark` class 的機制與 UI 控制項。

## Goals / Non-Goals

**Goals:**

- 使用者可手動切換淺色/深色模式
- 自動偵測 `prefers-color-scheme`
- 偏好持久化至 `localStorage`（key: `what-to-eat-color-mode`）
- 頁面載入時無閃爍（先讀取偏好再渲染）

**Non-Goals:**

- 不新增自訂主題色彩（僅使用現有 `.dark` 變數）
- 不支援多主題（僅 light / dark 兩種模式）
- 不修改 Netlify Functions 或後端邏輯

## Decisions

### 1. 狀態管理：composable vs Pinia store

**選擇**: 使用 `useTheme` composable，內部以模組層級 `ref` 保存單例狀態

**理由**: 主題狀態簡單（僅一個字串），不需要 Pinia 的 devtools 與持久化插件。composable 模式與專案現有 `useGeolocation`、`useRestaurants` 一致。

### 2. 模式設計：兩種切換

**選擇**: 支援 `light` / `dark` 兩種模式切換

**理由**: 預設「跟隨系統」，再讓使用者選擇手動切換。

### 3. `.dark` class 掛載位置

**選擇**: 掛在 `document.documentElement`（`<html>` 元素）

**理由**: Tailwind `darkMode: 'class'` 預設往上尋找 `.dark` class，掛在 `<html>` 確保全域生效。

### 4. 切換按鈕位置與圖示

**選擇**: 放在 `AppHeader` 右側，使用 inline SVG 圖示（☀️ / 🌙 對應 light / dark）

**理由**: Header 是全域可見的固定位置，使用 emoji 或 inline SVG 避免引入圖示庫。

### 5. 防閃爍策略

**選擇**: 在 `useTheme` composable 初始化時同步讀取 `localStorage` 並立即套用 class

**理由**: composable 在 `App.vue` 的 `setup()` 階段執行，早於首次渲染，避免白屏閃爍。

## Risks / Trade-offs

- **[SSR 不相容]** → 本專案為純 SPA，不影響。若未來遷移至 Nuxt 需改用 `useHead` 或 plugin。
- **[localStorage 不可用]** → 降級為跟隨系統偏好，不影響功能。
- **[既有元件 hardcoded 色彩]** → 需逐一檢查元件，確認皆使用 CSS 變數或 Tailwind token，不使用固定色碼。
