<script setup lang="ts">
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
  <div>
    <AppUserInteractionModal v-model:open="userActionModalIsOpen" />

    <NavSidebar v-model:open="sidebarIsOpen" />

    <AppHeader @click:menu="sidebarIsOpen = !sidebarIsOpen" />

    <slot />

    <AppFooter class="mt-14 pb-14 sm:pb-0" />

    <NavMobile @click:menu="sidebarIsOpen = !sidebarIsOpen" />

    <AppNotificationToastContainer />

    <LiveChat @visibility-changed="onLiveChatVisibilityChanged" />
  </div>
</template>
