<script setup lang="ts">
</script>

<template>
  <div class="h-screen w-full relative flex flex-col">
    <AppUserInteractionModal />
    <GameMobileHeader />
    <slot />
    <ClientOnly>
      <AppNotificationToastContainer />
    </ClientOnly>
  </div>
</template>
