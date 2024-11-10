<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row justify-between gap-x-28 gap-y-1">
    <div class="sm:w-[4rem] text-subtle font-medium whitespace-nowrap">
      <h4 class="font-semibold text-[0.80rem] sm:min-h-[32px]">{{ name }}</h4>
    </div>
    <div class="sm:flex-1 space-y-1">
      <div class="text-white font-medium">
        <slot />
      </div>
      <div
        v-if="$slots.description"
        class="text-subtle"
      >
        <slot name="description" />
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>
