## Why

專案已預先建立 `.dark` CSS 變數與 Tailwind `darkMode: 'class'` 設定，但缺少切換機制，使用者無法啟用深色模式，新增深色模式切換功能。

## What Changes

- 新增 `useTheme` composable，管理主題狀態（light / dark），並將偏好儲存至 `localStorage`，'what-to-eat-color-mode'
- 在 `AppHeader` 加入深色模式切換按鈕（太陽/月亮圖示）
- 確保所有元件在深色模式下色彩正確呈現（檢查 hardcoded 顏色）
- 應用啟動時自動偵測系統偏好（`prefers-color-scheme`），並尊重使用者手動選擇

## Capabilities

### New Capabilities

- `dark-mode-toggle`: 深色模式切換功能，包含主題偏好管理、切換 UI 與系統偏好偵測

### Modified Capabilities

_無既有 spec 需要修改_

## Impact

- **Frontend 元件**: `AppHeader.vue`（加入切換按鈕）、`App.vue`（套用 `.dark` class）
- **新增程式碼**: `src/composables/useTheme.ts`
- **樣式**: `main.css` 中已有 `.dark` 變數，可能需微調個別元件的 hardcoded 色彩
- **依賴**: 無新增外部依賴
- **儲存**: 使用 `localStorage` 儲存主題偏好
