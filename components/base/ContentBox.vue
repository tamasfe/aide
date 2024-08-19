<script setup lang="ts">
</script>

<template>
  <div class="px-4 sm:px-8 py-4 space-y-8 bg-subtle rounded-2xl">
    <div class="text-[1.3rem] font-bold">
      <slot name="title" />
    </div>
    <slot />
  </div>
</template>
