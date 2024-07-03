<script setup lang="ts">
type LinkOption = {
  title: string;
  to: string;
};

defineProps<{
  section: string;
  options: LinkOption[];
}>();
</script>

<template>
  <div class="flex-1 flex flex-col space-y-4">
    <h3 class="text-lg font-semibold text-emphasis hidden lg:block">
      {{ section }}
    </h3>
    <NuxtLink
      v-for="option in options"
      :key="option.to"
      :to="option.to"
    >
      {{ option.title }}
    </NuxtLink>
  </div>
</template>
