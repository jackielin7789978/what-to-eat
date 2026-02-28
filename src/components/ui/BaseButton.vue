<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[variantClass, sizeClass, 'inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50']"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'rounded-btn bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
    case 'secondary':
      return 'rounded-btn border border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100'
    case 'ghost':
      return 'rounded-btn text-primary-600 hover:bg-primary-50 active:bg-primary-100'
    default:
      return ''
  }
})

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'md':
      return 'px-5 py-2.5 text-base'
    case 'lg':
      return 'px-7 py-3.5 text-lg'
    default:
      return ''
  }
})
</script>
