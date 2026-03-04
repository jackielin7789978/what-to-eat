<template>
  <div class="flex items-center gap-2">
    <span class="shrink-0 text-sm text-text-muted">價位：</span>
    <div class="flex gap-1.5 overflow-x-auto">
      <button
        v-for="option in OPTIONS"
        :key="option.label"
        type="button"
        class="whitespace-nowrap rounded-full border px-3 py-1 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
        :class="
          modelValue === option.value
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-chip-border bg-chip-bg text-chip-text hover:border-primary-300 hover:text-primary-600'
        "
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceLevel } from '@/types/restaurant'

interface PriceOption {
  label: string
  value: PriceLevel | null
}

const OPTIONS: PriceOption[] = [
  { label: '全部',       value: null },
  { label: '💰',        value: 'PRICE_LEVEL_INEXPENSIVE' },
  { label: '💰💰',      value: 'PRICE_LEVEL_MODERATE' },
  { label: '💰💰💰',    value: 'PRICE_LEVEL_EXPENSIVE' },
  { label: '💰💰💰💰',  value: 'PRICE_LEVEL_VERY_EXPENSIVE' },
]

defineProps<{ modelValue: PriceLevel | null }>()
defineEmits<{ 'update:modelValue': [value: PriceLevel | null] }>()
</script>
