<script setup lang="ts">
/**
 * Following vue18n docs: https://vue-i18n.intlify.dev/guide/essentials/number.html#custom-formatting
 */
defineProps({
  /**
   * 3 letter currency code
   */
  currency: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <i18n-n
    class="flex items-center gap-2"
    tag="span"
    :value="value"
    :format="{ style: 'currency', currency, notation: 'standard' }"
  >
    <template #currency="slotProps">
      <span class="bg-button-primary text-transparent bg-clip-text">{{ slotProps.currency }}</span>
    </template>
    <template #integer="slotProps">
      <span class="font-bold">{{ slotProps.integer }}</span>
    </template>
  </i18n-n>
</template>
