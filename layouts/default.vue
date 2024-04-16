<template>
  <div class="bg-body-bg max-h-screen overflow-y-scroll" :class="{'stop-scrolling': store.getStopScroll}">
    <PageHeader />
    <div :class="{ 'mt-[50px]': !store.getPromoNotificationOpen, 'mt-[100px]': store.getPromoNotificationOpen}">
      <slot/>
    </div>
    <PageFooter />
    <MobileMenuBar />
    <AuthModal v-if="true"/>
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();
</script>

<style scoped>
.stop-scrolling {
  height: 100%;
  overflow: hidden;
}
</style>