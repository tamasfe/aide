<template>
  <div class="flex justify-start">
    <div class="flex relative rounded-full px-3 py-2 bg-chip-bg text-chip-text font-semibold font-montserrat text-sm hover:brightness-90  transition-all cursor-pointer">
      <span class="mr-1">{{ icon }}</span>
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  icon: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});
</script>
