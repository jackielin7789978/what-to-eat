<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <!-- Hero section -->
    <section class="mb-8 text-center">
      <h2 class="mb-2 text-2xl font-bold text-text-base sm:text-3xl">
        今天吃什麼？<span class="text-primary-500">讓我幫你決定</span>
      </h2>
      <p class="text-text-muted">搜尋你方圓 1.0km 內的餐廳</p>
    </section>

    <!-- Fetch button + open-now toggle -->
    <div class="mb-6 flex flex-col items-center gap-4">
      <BaseButton size="lg" :disabled="!canFetch" @click="fetchNearby">
        <BaseSpinner v-if="restaurantStore.status === 'loading'" size="sm" class="text-white" />
        <span>{{ fetchButtonLabel }}</span>
      </BaseButton>

      <!-- Toggle -->
      <label class="flex cursor-pointer items-center gap-2.5 select-none">
        <span class="text-sm text-text-muted">僅顯示營業中</span>
        <button
          type="button"
          role="switch"
          :aria-checked="openNowFilter"
          class="relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          :class="openNowFilter ? 'bg-primary-500' : 'bg-stone-300'"
          @click="openNowFilter = !openNowFilter"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            :class="openNowFilter ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </label>
    </div>

    <!-- Sort toggle：只在有結果時顯示，靠右對齊 -->
    <div
      v-if="restaurantStore.status === 'success' && restaurantStore.restaurants.length > 0"
      class="mb-6 flex items-center justify-end gap-2"
      role="group"
      aria-label="排序方式"
    >
      <span class="text-sm text-text-muted">排序：</span>
      <BaseButton
        :variant="sortBy === 'distance' ? 'primary' : 'ghost'"
        size="sm"
        @click="setSortBy('distance')"
      >
        距離
      </BaseButton>
      <BaseButton
        :variant="sortBy === 'rating' ? 'primary' : 'ghost'"
        size="sm"
        @click="setSortBy('rating')"
      >
        評分
      </BaseButton>
    </div>

    <!-- Location error -->
    <BaseError
      v-if="locationStore.status === 'error' && locationStore.error"
      class="mb-6"
      title="無法取得位置"
      :message="locationStore.error.message"
    />

    <!-- Throttle notice -->
    <p
      v-if="isThrottled && restaurantStore.status !== 'loading'"
      class="mb-4 text-center text-sm text-text-muted"
    >
      請稍等一下再重新搜尋 ☕
    </p>

    <!-- Restaurant list -->
    <RestaurantList
      :restaurants="displayedRestaurants"
      :status="restaurantStore.status"
      :error-message="restaurantStore.errorMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRestaurants } from '@/composables/useRestaurants'
import { useLocationStore } from '@/stores/useLocationStore'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSpinner from '@/components/ui/BaseSpinner.vue'
import BaseError from '@/components/ui/BaseError.vue'
import RestaurantList from '@/components/restaurant/RestaurantList.vue'

const locationStore = useLocationStore()
const { sortBy, openNowFilter, canFetch, isThrottled, displayedRestaurants, restaurantStore, fetchNearby, setSortBy } =
  useRestaurants()

const fetchButtonLabel = computed(() => {
  if (restaurantStore.status === 'loading') return '搜尋中…'
  if (isThrottled.value) return '稍後再試'
  return '取得附近餐廳 🍜'
})
</script>
