<script setup lang="ts">
type Route = {
  title: string;
  to: string;
};

defineProps<{
  routes: Route[];
}>();

const { currentRoute } = useRouter();

const isActive = (to: string) => currentRoute.value.path === to;
</script>

<template>
  <div
    class="flex items-center gap-4 w-full overflow-x-auto no-scrollbar"
  >
    <NuxtLink
      v-for="route in routes"
      :key="route.to"
      :to="route.to"
      :class="cn(
        'font-medium text-emphasis py-4 px-10',
        isActive(route.to) ? 'text-emphasis bg-[#272646]' : 'text-subtle bg-[#181732]',
      )"
    >
      {{ route.title }}
    </NuxtLink>
  </div>
</template>
