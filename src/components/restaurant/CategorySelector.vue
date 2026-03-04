<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="cat in CATEGORIES"
      :key="cat.id"
      type="button"
      class="shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
      :class="
        modelValue === cat.id
          ? 'border-primary-500 bg-primary-500 text-white'
          : 'border-chip-border bg-chip-bg text-chip-text hover:border-primary-300 hover:text-primary-600'
      "
      @click="$emit('update:modelValue', cat.id)"
    >
      {{ cat.emoji }} {{ cat.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { RestaurantCategory } from '@/types/restaurant'

interface Category {
  id: RestaurantCategory
  label: string
  emoji: string
}

const CATEGORIES: Category[] = [
  { id: 'random',       label: '隨機',   emoji: '🎲' },
  { id: 'taiwanese',    label: '台式',   emoji: '🍜' },
  { id: 'japanese',     label: '日式',   emoji: '🍱' },
  { id: 'korean',       label: '韓式',   emoji: '🥩' },
  { id: 'chinese',      label: '中式',   emoji: '🥟' },
  { id: 'hot_pot',      label: '火鍋',   emoji: '🍲' },
  { id: 'fast_food',    label: '速食',   emoji: '🍟' },
  { id: 'southeast_asian', label: '東南亞', emoji: '🌏' },
  { id: 'western',      label: '西式',   emoji: '🍔' },
  { id: 'italian',      label: '義式',   emoji: '🍕' },
  { id: 'vegetarian',   label: '蔬食',   emoji: '🥬' },
  { id: 'cafe_dessert', label: '咖啡甜點', emoji: '☕' },
  { id: 'drinks',       label: '飲料',   emoji: '🧃' },
]

defineProps<{ modelValue: RestaurantCategory }>()
defineEmits<{ 'update:modelValue': [value: RestaurantCategory] }>()
</script>
