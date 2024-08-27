<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

type Link = {
  to: string;
  title: string;
};

defineProps<{
  title: string;
  links: Link[];
}>();
</script>

<template>
  <div class="mt-8 mb-2 md:mt-0 flex flex-col space-y-4">
    <h3 class="text-lg font-semibold text-emphasis">{{ title }}</h3>
    <div class="flex flex-col whitespace-nowrap space-y-5">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="hover:text-emphasis"
      >
        {{ link.title }}
      </NuxtLink>
    </div>
  </div>
</template>
