<script setup lang="ts">
import type { Route } from "~/components/NavBar.vue";

const userStore = useUserStore();
const localePath = useLocalePath();
const { t } = useI18n();

watch([() => userStore.isAuthenticated], async () => {
  if (!userStore.isAuthenticated) {
    await navigateTo(localePath("/"));
  }
}, { immediate: true });

const sidebarIsOpen = ref(false);

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

const onLiveChatVisibilityChanged = (visibility: "minimized" | "maximized" | "hidden") => {
  if (visibility === "maximized") {
    sidebarIsOpen.value = false;
  }
};
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
      px-4
      "
    >
      <slot />
    </div>
    <AppFooter class="mt-14 pb-14 sm:pb-0" />
    <NavMobile @click:menu="sidebarIsOpen = !sidebarIsOpen" />
    <ClientOnly>
      <AppNotificationToastContainer />
      <LiveChat @visibility-changed="onLiveChatVisibilityChanged" />
    </ClientOnly>
  </div>
</template>
