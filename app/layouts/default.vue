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
</script>

<template>
  <div>
    <AppUserInteractionModal v-model:open="userActionModalIsOpen" />

    <NavSidebar v-model:open="sidebarIsOpen" />

    <AppHeader @click:menu="sidebarIsOpen = !sidebarIsOpen" />

    <div class="bg-default">
      <slot />
    </div>

    <AppFooter />

    <NavMobile @click:menu="sidebarIsOpen = !sidebarIsOpen" />
  </div>
</template>
