<template>
  <div role="alert" class="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
    <p class="font-semibold">{{ title }}</p>
    <p v-if="message" class="mt-1 text-sm text-red-600">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
}

withDefaults(defineProps<Props>(), {
  title: '發生錯誤',
})
</script>
