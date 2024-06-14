<script setup lang="ts">
import { MainHeader, MenuMobile } from "#components";
</script>

<template>
  <div>
    <MainHeader />
    <slot />
    <MenuMobile />
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-100%);
}

.slide-enter-to,
.slide-leave-from {
  transform: translateY(0);
}
</style>
