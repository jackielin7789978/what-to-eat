<template>
  <header class="sticky top-0 z-30 border-b border-primary-100 bg-surface-card shadow-sm">
    <div class="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
      <span class="text-2xl" aria-hidden="true">🍜</span>
      <h1 class="text-lg font-bold text-primary-600 sm:text-xl">附近有什麼吃的？</h1>
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
import { useTheme } from '@/composables/useTheme'

const { mode, toggleTheme } = useTheme()

const icon = computed(() => (mode.value === 'light' ? '☀️' : '🌙'))
const ariaLabel = computed(() => (mode.value === 'light' ? '切換為深色模式' : '切換為淺色模式'))
</script>
