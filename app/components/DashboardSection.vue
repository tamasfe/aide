<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-8 px-4 sm:px-8 py-4 sm:py-8 bg-subtle rounded-lg border border-muted/5">
    <div>
      <h2 class="text-xl text-white">
        <slot name="title">
          {{ title }}
        </slot>
      </h2>
      <p
        v-if="$slots.title"
        class="text-subtle"
      >
        <slot name="description" />
      </p>
    </div>
    <div class="flex flex-col gap-8 sm:gap-4">
      <slot />
    </div>
  </div>
</template>
