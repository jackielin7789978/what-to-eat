<template>
  <div class="flex flex-col items-center gap-4 py-16 text-center text-text-muted">
    <span class="text-5xl" aria-hidden="true">{{ icon }}</span>
    <p class="text-lg font-medium">{{ title }}</p>
    <p v-if="description" class="max-w-xs text-sm">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  title: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  icon: '🍽️',
})
</script>
