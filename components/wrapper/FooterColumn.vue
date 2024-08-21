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
  <div class="flex flex-col space-y-4 mt-8 mb-2">
    <h3 class="text-lg font-semibold text-emphasis">{{ section }}</h3>
    <div class="flex flex-col whitespace-nowrap space-y-5">
      <NuxtLink
        v-for="option in options"
        :key="option.to"
        :to="option.to"
        class="hover:text-emphasis"
      >
        {{ option.title }}
      </NuxtLink>
    </div>
  </div>
</template>
