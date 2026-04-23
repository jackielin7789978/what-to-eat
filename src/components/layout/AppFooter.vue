<template>
  <footer class="mt-12 border-t border-primary-100 py-6 px-2 text-center text-sm text-text-muted">
    <p>{{ t('footer.text') }}</p>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
