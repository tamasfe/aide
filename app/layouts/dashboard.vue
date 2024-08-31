<script setup lang="ts">
import type { NavDashboardSection } from "@/components/NavDashboard.vue";

defineProps<{
  section: NavDashboardSection;
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
