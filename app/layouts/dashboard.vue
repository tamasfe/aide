<script setup lang="ts">
import type { NavDashboardSectionItem } from "@/components/NavDashboard.vue";

defineProps<{
  section: NavDashboardSectionItem;
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
