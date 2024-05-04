<template>
  <div class="bg-body-bg min-h-screen">
    <PageHeader />
    <div :class="{ 'mt-[50px]': !store.getPromoNotificationOpen, 'mt-[92px]': store.getPromoNotificationOpen }">
      <slot />
    </div>
    <PageFooter />
    <MobileMenuBar />
    <AuthModal v-if="true" />
    <SideMenu />
    <NotificationsGlobalNotificationsWrapper />
  </div>
</template>

<script setup lang="ts">
const store = useTriggersStore();
</script>
