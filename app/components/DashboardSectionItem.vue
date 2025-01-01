<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="min-h-8 flex flex-col sm:flex-row justify-between items-baseline gap-x-28 gap-y-1">
    <h4 class="sm:w-[4rem] text-subtle whitespace-nowrap">
      {{ name }}
    </h4>
    <div class="sm:flex-1 space-y-1">
      <div class="text-white">
        <slot />
      </div>
      <div
        v-if="$slots.description"
        class="text-subtle text-sm"
      >
        <slot name="description" />
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>
