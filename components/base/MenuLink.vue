<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  title: string;
  to: string;
  icon?: string;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <NuxtLink
    class="flex items-center"
    :to="to"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="24"
      class="text-subtle"
    />
    <div :class="props.class">{{ title }}</div>
  </NuxtLink>
</template>
