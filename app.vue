<script setup lang="ts">
const modal = ref();
// const modal = ref("login");
// const modal = ref("register");
// const modal = ref("cancel_reg");
// const modal = ref("deposit");
</script>

<template>
  <div>
    <NavSidebar />

    <!-- <ModalLoginRegister -->
    <!--   v-if="modal === 'login'" -->
    <!-- /> -->
    <!-- <ModalLoginRegister -->
    <!--   v-if="modal === 'register'" -->
    <!-- /> -->
    <!-- <ModalCancelRegistration -->
    <!--   v-if="modal === 'cancel_reg'" -->
    <!-- /> -->
    <!-- <ModalDeposit -->
    <!--   v-if="modal === 'deposit'" -->
    <!-- /> -->


    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
