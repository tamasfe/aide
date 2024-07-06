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
  <div class="flex flex-col space-y-7">
    <h3 class="text-lg font-semibold text-emphasis hidden md:block">
      {{ section }}
    </h3>
    <NuxtLink
      v-for="option in options"
      :key="option.to"
      :to="option.to"
      class="hover:text-emphasis"
    >
      {{ option.title }}
    </NuxtLink>
  </div>
</template>
