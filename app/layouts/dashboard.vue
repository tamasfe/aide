<script setup lang="ts">
import type { DashboardNavSection } from "@/components/NavDashboard.vue";

defineProps<{
  section: DashboardNavSection;
}>();
</script>

<template>
  <div class="py-8 giro__container giro__sections">
    <NavDashboard
      :section="section"
    />

    <slot />
  </div>
</template>
