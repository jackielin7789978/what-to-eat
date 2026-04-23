<template>
  <span
    role="status"
    :aria-label="label ?? t('common.loading')"
    :class="['inline-block animate-spin-slow rounded-full border-4 border-current border-t-transparent', sizeClass]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const props = defineProps<Props>()
const { t } = useI18n()

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-4 w-4'
    case 'md': return 'h-6 w-6'
    case 'lg': return 'h-10 w-10'
  }
})
</script>
