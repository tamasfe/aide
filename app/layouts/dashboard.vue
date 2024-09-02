<script setup lang="ts">
import type { NavDashboardSectionItem } from "@/components/NavDashboard.vue";

defineProps<{
  section: NavDashboardSectionItem;
}>();
</script>

<template>
  <div class="w-full py-8">
    <!-- so right side of menu goes off screen -->
    <div class="mb-[var(--giro-section-gap)] pl-[var(--giro-container-padding)]">
      <NavDashboard
        :section="section"
        class="pr-[var(--giro-container-padding)]"
      />
    </div>

    <div class="w-full giro__container giro__sections">
      <slot />
    </div>
  </div>
</template>
