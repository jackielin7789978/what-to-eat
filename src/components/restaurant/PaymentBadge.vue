<template>
  <div v-if="badges.length" class="flex flex-wrap gap-1.5">
    <span
      v-for="badge in badges"
      :key="badge"
      class="rounded-full bg-secondary-100 px-2.5 py-0.5 text-xs font-medium text-secondary-700"
    >
      {{ badge }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentOptions } from '@/types/restaurant'

interface Props {
  options?: PaymentOptions
}

const props = defineProps<Props>()

const badges = computed(() => {
  if (!props.options) return []
  const list: string[] = []
  if (props.options.acceptsCreditCards) list.push('信用卡')
  if (props.options.acceptsDebitCards) list.push('金融卡')
  if (props.options.acceptsNfc) list.push('感應支付')
  if (props.options.acceptsCashOnly) list.push('僅收現金')
  return list
})
</script>
