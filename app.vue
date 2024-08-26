<script setup lang="ts">
const modal = ref("deposit");
</script>

<template>
  <div>
    <NavSidebar />

    <ModalLogin
      v-if="modal === 'login'"
    />
    <ModalRegister
      v-if="modal === 'register'"
    />
    <ModalForgotPassword
      v-if="modal === 'forgot_password'"
    />
    <ModalCancelRegistration
      v-if="modal === 'cancel_reg'"
    />
    <ModalDeposit
      v-if="modal === 'deposit'"
    />
    <ModalWithdrawal
      v-if="modal === 'withdrawal'"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
