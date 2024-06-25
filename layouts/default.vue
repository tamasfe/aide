<script setup lang="ts">
import { MainHeader, MenuMobile } from "#components";

const menu = ref<InstanceType<typeof MainHeader>>();

const openMenu = () => {
  menu.value?.openSidebar();
};
</script>

<template>
  <div>
    <MainHeader ref="menu" />
    <slot />
    <WrapperFooter />
    <MenuMobile @click:menu="openMenu" />
  </div>
</template>
