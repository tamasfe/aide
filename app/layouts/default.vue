<script setup lang="ts">
const sidebarIsOpen = ref(false);

const modal = useState("user-modal", () => "");

const closeModalOnSidebarOpen = (value: boolean) => {
  if (value === true) {
    modal.value = "";
  }
};
watch(sidebarIsOpen, closeModalOnSidebarOpen);

const closeSidebarOnModalOpen = (value: string) => {
  if (value !== "") {
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
