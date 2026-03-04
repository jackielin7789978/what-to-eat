<template>
  <article
    class="card group flex cursor-pointer flex-col gap-3 p-5 animate-fade-in-up"
    role="button"
    tabindex="0"
    :aria-label="`開啟 ${restaurant.displayName} 的 Google Maps 頁面`"
    @click="openMaps"
    @keydown.enter.prevent="openMaps"
    @keydown.space.prevent="openMaps"
  >
    <!-- Name + Price Level -->
    <div class="flex items-start justify-between gap-2">
      <h2 class="text-base font-bold leading-snug text-text-base group-hover:text-primary-600">
        {{ restaurant.displayName }}
      </h2>
      <span
        v-if="priceLabel"
        class="shrink-0 text-lg"
        :aria-label="`價位：${priceLabel}`"
        :title="priceLabel"
      >{{ priceEmoji }}</span>
    </div>

    <!-- Opening status -->
    <div v-if="restaurant.isOpen !== undefined">
      <span
        v-if="restaurant.isOpen"
        class="inline-flex items-center gap-1 rounded-full bg-status-open-bg px-2.5 py-0.5 text-xs font-medium text-status-open-text"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-status-open-dot" aria-hidden="true" />
        營業中
      </span>
      <span
        v-else
        class="inline-flex items-center gap-1 rounded-full bg-status-closed-bg px-2.5 py-0.5 text-xs font-medium text-status-closed-text"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-status-closed-dot" aria-hidden="true" />
        休息中
      </span>
    </div>

    <!-- Address -->
    <p class="text-xs text-text-muted line-clamp-2">{{ restaurant.address }}</p>

    <!-- Rating -->
    <RestaurantRating
      v-if="restaurant.rating"
      :rating="restaurant.rating"
      :count="restaurant.userRatingCount"
    />

    <!-- Distance -->
    <p class="text-sm font-medium text-primary-500">
      {{ formattedDistance }}
    </p>

    <!-- Payment badges -->
    <PaymentBadge :options="restaurant.paymentOptions" />

    <!-- Walking time button -->
    <div class="mt-auto pt-2" @click.stop>
      <BaseButton
        v-if="walkingStatus === 'idle' || walkingStatus === 'error'"
        variant="secondary"
        size="sm"
        :disabled="!hasLocation"
        @click="requestWalkingTime"
      >
        <span>要走多久？</span>
      </BaseButton>

      <div v-else-if="walkingStatus === 'loading'" class="flex items-center gap-2 text-sm text-text-muted">
        <BaseSpinner size="sm" />
        <span>計算中…</span>
      </div>

      <div v-else-if="walkingStatus === 'success'" class="flex items-center gap-1.5">
        <span class="text-lg">🚶</span>
        <span class="text-sm font-semibold text-primary-600">{{ walkingTime }}</span>
      </div>

      <p v-if="walkingStatus === 'error'" class="mt-1 text-xs text-error-muted">{{ walkingError }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Restaurant, PriceLevel } from '@/types/restaurant'
import { useWalkingTime } from '@/composables/useWalkingTime'
import { useLocationStore } from '@/stores/useLocationStore'
import RestaurantRating from './RestaurantRating.vue'
import PaymentBadge from './PaymentBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'

interface Props {
  restaurant: Restaurant
}

const props = defineProps<Props>()
const locationStore = useLocationStore()
const hasLocation = computed(() => locationStore.hasLocation)

const { status: walkingStatus, formattedDuration: walkingTime, error: walkingError, fetch: requestWalkingTime } =
  useWalkingTime(
    props.restaurant.id,
    props.restaurant.location.lat,
    props.restaurant.location.lng,
  )

function openMaps() {
  window.open(props.restaurant.googleMapsUri, '_blank', 'noopener,noreferrer')
}

const formattedDistance = computed(() => {
  const m = props.restaurant.distanceMeters
  if (m === undefined) return ''
  if (m < 1000) return `${Math.round(m)} m`
  return `${(m / 1000).toFixed(1)} km`
})

const PRICE_MAP: Record<PriceLevel, { emoji: string; label: string }> = {
  PRICE_LEVEL_UNSPECIFIED:   { emoji: '',   label: '' },
  PRICE_LEVEL_FREE:          { emoji: '🆓', label: '免費' },
  PRICE_LEVEL_INEXPENSIVE:   { emoji: '💰', label: '便宜' },
  PRICE_LEVEL_MODERATE:      { emoji: '💰💰', label: '中等' },
  PRICE_LEVEL_EXPENSIVE:     { emoji: '💰💰💰', label: '較貴' },
  PRICE_LEVEL_VERY_EXPENSIVE:{ emoji: '💰💰💰💰', label: '高級' },
}

const priceEmoji = computed(() =>
  props.restaurant.priceLevel ? PRICE_MAP[props.restaurant.priceLevel]?.emoji : '',
)
const priceLabel = computed(() =>
  props.restaurant.priceLevel ? PRICE_MAP[props.restaurant.priceLevel]?.label : '',
)
</script>
