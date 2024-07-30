<script setup lang="ts">
import { MainHeader, MenuMobile } from "#components";

const menu = ref<InstanceType<typeof MainHeader>>();

const toggleMenu = () => {
  menu.value?.toggleSidebar();
};
</script>

<template>
  <div>
    <MainHeader ref="menu" />
    <slot />
    <WrapperFooter />
    <MenuMobile @click:menu="toggleMenu" />
  </div>
</template>
