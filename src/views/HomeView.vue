<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <!-- Hero section -->
    <section class="mb-8 text-center">
      <h2 class="mb-2 text-2xl font-bold text-text-base sm:text-3xl">
        {{ t('home.heading') }}<span class="text-primary-500">{{ t('home.headingAccent') }}</span>
      </h2>
      <p class="text-text-muted">{{ t('home.subheading') }}</p>
    </section>

    <!-- Category selector -->
    <div class="mb-4">
      <CategorySelector v-model="selectedCategory" />
    </div>

    <!-- Fetch button + open-now toggle -->
    <div class="mb-6 flex flex-col items-center gap-4">
      <BaseButton size="lg" :disabled="!canFetch" @click="fetchNearby">
        <BaseSpinner v-if="restaurantStore.status === 'loading'" size="sm" class="text-white" />
        <span>{{ fetchButtonLabel }}</span>
      </BaseButton>

      <!-- Toggle -->
      <label class="flex cursor-pointer items-center gap-2.5 select-none">
        <span class="text-sm text-text-muted">{{ t('home.openNow') }}</span>
        <button
          type="button"
          role="switch"
          :aria-checked="openNowFilter"
          class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          :class="openNowFilter ? 'bg-primary-500' : 'bg-toggle-off'"
          @click="openNowFilter = !openNowFilter"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 rounded-full bg-toggle-knob shadow-sm transition-transform duration-200"
            :class="openNowFilter ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </label>
    </div>

    <!-- Location error -->
    <BaseError
      v-if="locationStore.status === 'error' && locationStore.error"
      class="mb-6"
      :title="t('home.locationError')"
      :message="locationStore.error.message"
    />

    <!-- Throttle notice -->
    <p
      v-if="isThrottled && restaurantStore.status !== 'loading'"
      class="mb-4 text-center text-sm text-text-muted"
    >
      {{ t('home.throttleNotice') }}
    </p>

    <!-- Quota exceeded warning -->
    <div
      v-if="restaurantStore.status === 'error' && restaurantStore.errorMessage === 'QUOTA_EXCEEDED'"
      class="mb-6 rounded-xl border border-warning-border bg-warning-bg px-5 py-4"
    >
      <p class="text-base font-semibold text-warning-title">{{ t('home.quotaTitle') }}</p>
      <p class="mt-1 text-sm text-warning-text">{{ t('home.quotaMessage') }}</p>
    </div>

    <!-- Sort toggle + price filter：只在有結果時顯示 -->
    <div
      v-if="restaurantStore.status === 'success' && restaurantStore.restaurants.length > 0"
      class="mb-6 flex flex-col gap-3"
    >
      <div class="flex items-center justify-end gap-2" role="group" :aria-label="t('home.sortAriaLabel')">
        <span class="text-sm text-text-muted">{{ t('home.sortLabel') }}</span>
        <BaseButton
          :variant="sortBy === 'distance' ? 'primary' : 'ghost'"
          size="sm"
          @click="setSortBy('distance')"
        >
          {{ t('home.sortDistance') }}
        </BaseButton>
        <BaseButton
          :variant="sortBy === 'rating' ? 'primary' : 'ghost'"
          size="sm"
          @click="setSortBy('rating')"
        >
          {{ t('home.sortRating') }}
        </BaseButton>
      </div>
      <PriceLevelFilter v-model="priceLevelFilter" />
    </div>

    <!-- Restaurant list (skip error display for QUOTA_EXCEEDED, handled above) -->
    <RestaurantList
      :restaurants="displayedRestaurants"
      :status="effectiveListStatus"
      :error-message="restaurantStore.errorMessage"
      :is-filtered-empty="isFilteredEmpty"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRestaurants } from '@/composables/useRestaurants'
import { useLocationStore } from '@/stores/useLocationStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseError from '@/components/ui/BaseError.vue'
import RestaurantList from '@/components/restaurant/RestaurantList.vue'
import CategorySelector from '@/components/restaurant/CategorySelector.vue'
import PriceLevelFilter from '@/components/restaurant/PriceLevelFilter.vue'

const { t } = useI18n()
const locationStore = useLocationStore()
const {
  sortBy,
  openNowFilter,
  selectedCategory,
  priceLevelFilter,
  canFetch,
  isThrottled,
  isFilteredEmpty,
  displayedRestaurants,
  restaurantStore,
  fetchNearby,
  setSortBy,
} = useRestaurants()

// When QUOTA_EXCEEDED, show idle in RestaurantList (amber box is shown above instead)
const effectiveListStatus = computed(() =>
  restaurantStore.status === 'error' && restaurantStore.errorMessage === 'QUOTA_EXCEEDED'
    ? 'idle'
    : restaurantStore.status,
)

const fetchButtonLabel = computed(() => {
  if (restaurantStore.status === 'loading') return t('home.fetchButtonLoading')
  if (isThrottled.value) return t('home.fetchButtonThrottled')
  return t('home.fetchButton')
})
</script>
