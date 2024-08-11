<script setup lang="ts">
import { toggleSidebarSymbol } from "~/constants";

const toggleSidebar = inject(toggleSidebarSymbol);

const toggleMenu = () => {
  if (toggleSidebar) {
    toggleSidebar();
  }
};
</script>

<template>
  <div>
    <WrapperHeader />
    <slot />
    <WrapperFooter />
    <WrapperMenuMobile @click:menu="toggleMenu" />
  </div>
</template>
