<script setup lang="ts">
const sidebarOpen = ref(false);
const modal = ref();
// const modal = ref("login");
// const modal = ref("register");
// const modal = ref("cancel_reg");
// const modal = ref("deposit");
</script>

<template>
  <div>
    <NavSidebar
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
    <ModalDeposit
      v-if="modal === 'deposit'"
    />


    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
