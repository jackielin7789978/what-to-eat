<template>
  <span
    role="status"
    :aria-label="label"
    :class="['inline-block animate-spin-slow rounded-full border-4 border-current border-t-transparent', sizeClass]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  label: '載入中…',
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'h-4 w-4'
    case 'md': return 'h-6 w-6'
    case 'lg': return 'h-10 w-10'
  }
})
</script>
