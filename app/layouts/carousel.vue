<script setup lang="ts">
const sidebarIsOpen = ref(false);
const nuxtApp = useNuxtApp();
const userActionModalIsOpen = useState("user-modal", () => false);

const closeModalOnSidebarOpen = (value: boolean) => {
  if (value === true) {
    userActionModalIsOpen.value = false;
  }
};
watch(sidebarIsOpen, closeModalOnSidebarOpen);

const closeSidebarOnModalOpen = (value: boolean) => {
  if (value === true) {
    sidebarIsOpen.value = false;
  }
};
watch(userActionModalIsOpen, closeSidebarOnModalOpen);

nuxtApp.hook("frontend:event:live-chat:closed", () => {
  sidebarIsOpen.value = false;
});
</script>

<template>
  <div class="pt-14">
    <AppUserInteractionModal v-model:open="userActionModalIsOpen" />
    <NavSidebar v-model:open="sidebarIsOpen" />
    <AppHeader class="fixed top-0 left-0 right-0 z-10 print:hidden" @click:menu="sidebarIsOpen = !sidebarIsOpen" />
    <div
      class="
      min-h-[calc(100vh-7rem)]
      sm:min-h-[calc(100vh-3.5rem)]
      relative
      pt-4
      sm:pt-6
      max-w-screen-xl
      mx-auto
      w-full
      px-4"
    >
      <CarouselHero class="mb-4 md:mb-6 -mx-4" />
      <slot />
    </div>
    <AppFooter class="mt-14 pb-14 sm:pb-0" />
    <NavMobile class="sm:hidden" @click:menu="sidebarIsOpen = !sidebarIsOpen" />
    <ClientOnly>
      <AppNotificationToastContainer />
      <LazyLiveChat />
    </ClientOnly>
  </div>
</template>
