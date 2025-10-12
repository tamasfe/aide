<script setup lang="ts">
import type { NavDashboardSectionItem } from "@/components/NavDashboard.vue";

defineProps<{
  section: NavDashboardSectionItem;
}>();

const userStore = useUserStore();
const localePath = useLocalePath();

watch([() => userStore.isAuthenticated], async () => {
  if (!userStore.isAuthenticated) {
    await navigateTo(localePath("/"));
  }
}, { immediate: true });
</script>

<template>
  <div class="w-full py-8">
    <!-- so right side of menu goes off screen -->
    <ScrollOffscreen>
      <NavDashboard
        :section="section"
        class="mb-[var(--giro-section-gap-sm)] md:mb-[var(--giro-section-gap-lg)]"
      />
    </ScrollOffscreen>

    <div class="w-full max-w-screen-xl mx-auto px-4 giro__sections">
      <slot />
    </div>
  </div>
</template>
