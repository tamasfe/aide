<script setup lang="ts">
const sidebarOpen = ref(false);
const modal = ref();
// const modal = ref("login");
// const modal = ref("register");
// const modal = ref("cancel_reg");
</script>

<template>
  <div>
    <WrapperSidebarMenu
      v-if="sidebarOpen"
    />

    <ModalLoginRegister
      v-if="modal === 'login'"
    />
    <ModalLoginRegister
      v-if="modal === 'register'"
    />
    <ModalCancelRegistration
      v-if="modal === 'cancel_reg'"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
