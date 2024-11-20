<script setup lang="ts">
const sidebarIsOpen = ref(false);

const modal = useState("user-modal", () => null);

const closeModalOnSidebarOpen = (value: boolean) => {
  if (value === true) {
    modal.value = null;
  }
};
watch(sidebarIsOpen, closeModalOnSidebarOpen);

const closeSidebarOnModalOpen = (value: string | null) => {
  if (value !== null) {
    sidebarIsOpen.value = false;
  }
};
watch(modal, closeSidebarOnModalOpen);
</script>

<template>
  <div>
    <AppUserInteractionModal v-model:modal="modal" />

    <NavSidebar v-model:open="sidebarIsOpen" />

    <AppHeader @click:menu="sidebarIsOpen = !sidebarIsOpen" />

    <slot />

    <AppFooter />

    <NavMobile @click:menu="sidebarIsOpen = !sidebarIsOpen" />
  </div>
</template>
