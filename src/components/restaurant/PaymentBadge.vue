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
import { useI18n } from 'vue-i18n'
import type { PaymentOptions } from '@/types/restaurant'

interface Props {
  options?: PaymentOptions
}

const props = defineProps<Props>()
const { t } = useI18n()

const badges = computed(() => {
  if (!props.options) return []
  const list: string[] = []
  if (props.options.acceptsCreditCards) list.push(t('payment.creditCard'))
  if (props.options.acceptsDebitCards) list.push(t('payment.debitCard'))
  if (props.options.acceptsNfc) list.push(t('payment.nfc'))
  if (props.options.acceptsCashOnly) list.push(t('payment.cashOnly'))
  return list
})
</script>
