<template>
  <header class="sticky top-0 z-30 border-b border-primary-100 bg-surface-card shadow-sm">
    <div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
      <span class="text-2xl" aria-hidden="true">🍜</span>
      <h1 class="text-lg font-bold text-primary-600 sm:text-xl">{{ t('app.title') }}</h1>
      <button
        class="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-lg transition-colors duration-150 hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
        :aria-label="ariaLabel"
        @click="toggleTheme"
      >
        {{ icon }}
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { mode, toggleTheme } = useTheme()

const icon = computed(() => (mode.value === 'light' ? '☀️' : '🌙'))
const ariaLabel = computed(() =>
  mode.value === 'light' ? t('theme.switchToDark') : t('theme.switchToLight'),
)
</script>
