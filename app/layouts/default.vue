<script setup lang="ts">
const sidebarIsOpen = ref(false);
</script>

<template>
  <div>
    <NavSidebar v-model:open="sidebarIsOpen" />

    <AppHeader @click:menu="sidebarIsOpen = !sidebarIsOpen" />

    <slot />

    <AppFooter />

    <NavMobile @click:menu="sidebarIsOpen = !sidebarIsOpen" />
  </div>
</template>
