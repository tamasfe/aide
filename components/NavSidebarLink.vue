<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

defineProps<{
  title: string;
  to: string;
  icon: string;
}>();
</script>

<template>
  <NuxtLink
    class="p-2 flex items-center"
    :to="to"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="24"
      class="text-subtle"
    />
    <div class="ml-4 text-[0.90rem] font-medium text-emphasis hover:text-white">{{ title }}</div>
  </NuxtLink>
</template>
