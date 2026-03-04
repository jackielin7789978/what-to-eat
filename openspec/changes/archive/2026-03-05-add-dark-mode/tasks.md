## 1. useTheme Composable

- [x] 1.1 建立 `src/composables/useTheme.ts`，定義 `ThemeMode` 型別（`'light' | 'dark'`）與模組層級單例狀態
- [x] 1.2 實作 `localStorage` 讀寫邏輯（key: `what-to-eat-color-mode`），無值時依 `prefers-color-scheme` 決定預設模式
- [x] 1.3 實作 `applyTheme()` 函式：根據當前模式在 `document.documentElement` 新增/移除 `.dark` class
- [x] 1.4 實作 `toggleTheme()` 函式：在 `light` / `dark` 之間切換並持久化

## 2. Header 切換按鈕

- [x] 2.1 在 `AppHeader.vue` 引入 `useTheme` 並新增切換按鈕，顯示對應圖示（☀️ / 🌙）
- [x] 2.2 為按鈕加入無障礙屬性（`aria-label`）與 hover/focus 樣式

## 3. App 層整合

- [x] 3.1 在 `App.vue` 的 `setup` 中呼叫 `useTheme()` 以確保初始化時同步套用主題（防閃爍）

## 4. 樣式檢查與修正

- [x] 4.1 檢查所有元件是否有 hardcoded 色彩值，改用 CSS 變數或 Tailwind token
- [x] 4.2 確認 `.dark` 模式下 `AppHeader` 邊框、按鈕、卡片等元件視覺正確
