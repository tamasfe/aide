<script setup lang="ts">
export type NavDashboardSectionItem = "settings" | "history";

export type Route = {
  title: string;
  to: string;
};

defineProps<{
  routes: Route[];
}>();
</script>

<template>
  <div class="flex gap-3 snap-x scroll-smooth overflow-x-auto no-scrollbar">
    <NuxtLink
      v-for="(route, index) in routes"
      :key="index"
      v-slot="{ isExactActive, href, navigate }"
      :to="route.to"
      custom
    >
      <a
        :href="href"
        class="py-2 px-5 snap-start rounded text-sm md:text-base"
        :class="[isExactActive ? 'text-emphasis bg-active' : 'text-subtle bg-subtle md:hover:bg-muted']"
        @click="navigate"
      >
        {{ route.title }}
      </a>
    </NuxtLink>
  </div>
</template>
