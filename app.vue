<script setup lang="ts">
const modal = ref("cancel_reg");
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
