<script setup lang="ts">
// const modal = ref();
// const modal = ref("login");
const modal = ref("register");
// const modal = ref("cancel_reg");
// const modal = ref("forgot_password");
// const modal = ref("invite");
// const modal = ref("deposit");
// const modal = ref("withdrawal");
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
    <ModalCancelRegistration
      v-if="modal === 'cancel_reg'"
    />
    <ModalForgotPassword
      v-if="modal === 'forgot_password'"
    />
    <ModalInvite
      v-if="modal === 'invite'"
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
