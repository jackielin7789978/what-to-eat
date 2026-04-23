<template>
  <div class="flex flex-wrap justify-center gap-2">
    <button
      v-for="cat in categories"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { RestaurantCategory } from '@/types/restaurant'

interface Category {
  id: RestaurantCategory
  label: string
  emoji: string
}

const { t } = useI18n()

const categories = computed((): Category[] => [
  { id: 'random',          label: t('category.random'),         emoji: '🎲' },
  { id: 'taiwanese',       label: t('category.taiwanese'),      emoji: '🍜' },
  { id: 'japanese',        label: t('category.japanese'),       emoji: '🍱' },
  { id: 'korean',          label: t('category.korean'),         emoji: '🥩' },
  { id: 'chinese',         label: t('category.chinese'),        emoji: '🥟' },
  { id: 'hot_pot',         label: t('category.hot_pot'),        emoji: '🍲' },
  { id: 'fast_food',       label: t('category.fast_food'),      emoji: '🍟' },
  { id: 'southeast_asian', label: t('category.southeast_asian'), emoji: '🌏' },
  { id: 'western',         label: t('category.western'),        emoji: '🍔' },
  { id: 'italian',         label: t('category.italian'),        emoji: '🍕' },
  { id: 'vegetarian',      label: t('category.vegetarian'),     emoji: '🥬' },
  { id: 'cafe_dessert',    label: t('category.cafe_dessert'),   emoji: '☕' },
  { id: 'drinks',          label: t('category.drinks'),         emoji: '🧃' },
])

defineProps<{ modelValue: RestaurantCategory }>()
defineEmits<{ 'update:modelValue': [value: RestaurantCategory] }>()
</script>
