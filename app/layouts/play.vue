<script setup lang="ts">
const userActionModalIsOpen = useState("user-modal", () => false);
</script>

<template>
  <div class="h-screen w-full relative flex flex-col">
    <AppUserInteractionModal v-model:open="userActionModalIsOpen" />
    <GameMobileHeader />
    <slot />
    <ClientOnly>
      <AppNotificationToastContainer />
    </ClientOnly>
  </div>
</template>
