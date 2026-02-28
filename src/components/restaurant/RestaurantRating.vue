<template>
  <div class="flex items-center gap-1.5" :aria-label="`評分 ${rating} 顆星，共 ${count} 則評論`">
    <div class="flex" aria-hidden="true">
      <span
        v-for="i in 5"
        :key="i"
        class="text-base leading-none"
      >{{ starChar(i) }}</span>
    </div>
    <span class="text-sm font-semibold text-secondary-600">{{ rating.toFixed(1) }}</span>
    <span v-if="count" class="text-xs text-text-muted">({{ formatCount(count) }})</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  rating: number
  count?: number
}

const props = defineProps<Props>()

function starChar(index: number): string {
  const filled = props.rating >= index
  const half = !filled && props.rating >= index - 0.5
  if (filled) return '★'
  if (half) return '⯨'
  return '☆'
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
</script>
