import { ref, watchEffect } from 'vue'

export type ThemeMode = 'light' | 'dark'

const STORAGE_KEY = 'what-to-eat-color-mode'
const MODES: ThemeMode[] = ['light', 'dark']

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

function readStorage(): ThemeMode {
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    if (val && MODES.includes(val as ThemeMode)) return val as ThemeMode
  } catch {
    // localStorage unavailable — fall back
  }
  // Default: follow system preference
  return prefersDark.matches ? 'dark' : 'light'
}

function writeStorage(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch {
    // ignore
  }
}

function applyTheme(mode: ThemeMode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

// Module-level singleton state
const mode = ref<ThemeMode>(readStorage())

// Apply immediately on module load (before first render)
applyTheme(mode.value)

export function useTheme() {
  // Re-apply whenever mode changes
  watchEffect(() => {
    applyTheme(mode.value)
    writeStorage(mode.value)
  })

  function toggleTheme() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  return { mode, toggleTheme }
}
