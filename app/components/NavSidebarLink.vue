<script setup lang="ts">
import type { RouteLocationNamedRaw } from "vue-router";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  title: string;
  to: RouteLocationNamedRaw;
  icon: string;
}>();
</script>

<template>
  <BaseLink
    class="p-2 flex items-center text-emphasis hover:text-white"
    :to="to"
  >
    <BaseIcon
      v-if="icon"
      :name="icon"
      :size="22"
      class="flex-shrink-0 text-subtle"
    />
    <div class="w-full ml-4 font-medium">{{ title }}</div>
  </BaseLink>
</template>
