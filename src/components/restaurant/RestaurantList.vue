<template>
  <!-- Loading skeleton -->
  <div v-if="status === 'loading'" class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="i in 6"
      :key="i"
      class="animate-skeleton rounded-card bg-surface-card p-5 shadow-card"
    >
      <div class="mb-3 h-4 w-3/4 rounded bg-skeleton-strong" />
      <div class="mb-2 h-3 w-full rounded bg-skeleton-subtle" />
      <div class="mb-2 h-3 w-2/3 rounded bg-skeleton-subtle" />
      <div class="mt-4 h-8 w-28 rounded-full bg-skeleton-strong" />
    </div>
  </div>

  <!-- Error state -->
  <BaseError v-else-if="status === 'error'" :title="t('restaurantList.fetchError')" :message="errorMessage ?? undefined" />

  <!-- Filtered empty state -->
  <EmptyState
    v-else-if="status === 'success' && isFilteredEmpty"
    icon="🔍"
    :title="t('restaurantList.filteredEmpty.title')"
    :description="t('restaurantList.filteredEmpty.description')"
  />

  <!-- Empty state -->
  <EmptyState
    v-else-if="status === 'success' && restaurants.length === 0"
    icon="🔍"
    :title="t('restaurantList.empty.title')"
    :description="t('restaurantList.empty.description')"
  />

  <!-- Idle state -->
  <EmptyState
    v-else-if="status === 'idle'"
    icon="🍜"
    :title="t('restaurantList.idle.title')"
    :description="t('restaurantList.idle.description')"
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
import { useI18n } from 'vue-i18n'
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
const { t } = useI18n()
</script>
