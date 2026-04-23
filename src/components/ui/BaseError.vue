<template>
  <div role="alert" class="rounded-xl border border-error-border bg-error-bg px-5 py-4 text-error-text">
    <p class="font-semibold">{{ title ?? t('common.error') }}</p>
    <p v-if="message" class="mt-1 text-sm text-error-muted">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

interface Props {
  title?: string
  message?: string
}

defineProps<Props>()
const { t } = useI18n()
</script>
