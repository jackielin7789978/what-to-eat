## ADDED Requirements

### Requirement: Theme mode persistence
系統 SHALL 將使用者選擇的主題模式（`light` / `dark`）儲存至 `localStorage`，key 為 `what-to-eat-color-mode`。

#### Scenario: User selects dark mode
- **WHEN** 使用者點擊切換按鈕將模式設為 `dark`
- **THEN** `localStorage` 中 `what-to-eat-color-mode` 的值 SHALL 為 `"dark"`

#### Scenario: User clears storage
- **WHEN** `localStorage` 中無 `what-to-eat-color-mode` 項目
- **THEN** 系統 SHALL 依據 `prefers-color-scheme` 決定預設模式

### Requirement: Dark class application
系統 SHALL 根據當前主題模式在 `<html>` 元素上新增或移除 `.dark` class。

#### Scenario: Dark mode active
- **WHEN** 模式為 `dark`
- **THEN** `<html>` 元素 SHALL 包含 `dark` class

#### Scenario: Light mode active
- **WHEN** 模式為 `light`
- **THEN** `<html>` 元素 SHALL 不包含 `dark` class

### Requirement: Toggle button in header
`AppHeader` SHALL 顯示主題切換按鈕，依據當前模式顯示對應圖示。

#### Scenario: Toggling mode
- **WHEN** 使用者點擊切換按鈕
- **THEN** 模式 SHALL 在 `light` / `dark` 之間切換

#### Scenario: Icon reflects current mode
- **WHEN** 模式為 `light`
- **THEN** 按鈕 SHALL 顯示太陽圖示（☀️）
- **WHEN** 模式為 `dark`
- **THEN** 按鈕 SHALL 顯示月亮圖示（🌙）

### Requirement: No flash on page load
頁面載入時 SHALL 在首次渲染前套用正確的主題 class，避免淺色閃爍。

#### Scenario: Returning user with dark preference
- **WHEN** 使用者 `localStorage` 中儲存了 `dark` 模式並重新載入頁面
- **THEN** 頁面 SHALL 直接以深色模式渲染，不出現淺色閃爍
