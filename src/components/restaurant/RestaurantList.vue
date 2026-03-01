<template>
  <!-- Loading skeleton -->
  <div v-if="status === 'loading'" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="animate-skeleton rounded-card bg-surface-card p-5 shadow-card"
    >
      <div class="mb-3 h-4 w-3/4 rounded bg-stone-200" />
      <div class="mb-2 h-3 w-full rounded bg-stone-100" />
      <div class="mb-2 h-3 w-2/3 rounded bg-stone-100" />
      <div class="mt-4 h-8 w-28 rounded-full bg-stone-200" />
    </div>
  </div>

  <!-- Error state -->
  <BaseError v-else-if="status === 'error'" title="取得餐廳失敗" :message="errorMessage ?? undefined" />

  <!-- Filtered empty state -->
  <EmptyState
    v-else-if="status === 'success' && isFilteredEmpty"
    icon="🔍"
    title="沒有符合篩選條件的餐廳"
    description="試試放寬價位篩選，或切換「僅顯示營業中的店家」看看"
  />

  <!-- Empty state -->
  <EmptyState
    v-else-if="status === 'success' && restaurants.length === 0"
    icon="🔍"
    title="附近沒有找到餐廳"
    description="試著擴大搜尋範圍，或到人多的地方再試試看"
  />

  <!-- Idle state -->
  <EmptyState
    v-else-if="status === 'idle'"
    icon="🍜"
    title="點擊按鈕，探索附近美食"
    description="將搜尋方圓 1.0km 內的餐廳"
  />

  <!-- Restaurant grid -->
  <TransitionGroup
    v-else
    tag="div"
    name="restaurant-card"
    class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
  >
    <RestaurantCard
      v-for="restaurant in restaurants"
      :key="restaurant.id"
      :restaurant="restaurant"
    />
  </TransitionGroup>
</template>

<script setup lang="ts">
import type { Restaurant, RestaurantListStatus } from '@/types/restaurant'
import RestaurantCard from './RestaurantCard.vue'
import BaseError from '@/components/ui/BaseError.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

interface Props {
  restaurants: Restaurant[]
  status: RestaurantListStatus
  errorMessage?: string | null
  isFilteredEmpty?: boolean
}

defineProps<Props>()
</script>
