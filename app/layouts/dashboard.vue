<script setup lang="ts">
import type { NavDashboardSectionItem } from "@/components/NavDashboard.vue";

defineProps<{
  section: NavDashboardSectionItem;
}>();
</script>

<template>
  <div class="w-full py-8">
    <!-- so right side of menu goes off screen -->
    <ScrollOffscreen>
      <NavDashboard
        :section="section"
        class="mb-[var(--giro-section-gap)]"
      />
    </ScrollOffscreen>

    <div class="w-full giro__container giro__sections">
      <slot />
    </div>
  </div>
</template>
