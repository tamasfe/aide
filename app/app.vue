<script setup lang="ts">
const modal = ref("");

const { $dependencies } = useNuxtApp();
$dependencies.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    modal.value = "login";
  },
);
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
      v-if="modal === 'forgot'"
    />
    <ModalCancelRegistration
      v-if="modal === 'cancel_reg'"
    />
    <ModalDeposit
      v-if="modal === 'deposit'"
    />
    <ModalDepositConfirm
      v-if="modal === 'deposit_confirm'"
    />
    <ModalWithdrawal
      v-if="modal === 'withdrawal'"
    />
    <ModalRestrictExpanding
      v-if="modal === 'restrict_expanding'"
    />
    <ModalRestrictLicenseAlternative
      v-if="modal === 'restrict_license_alternative'"
    />
    <ModalRestrictLicenseNoAlternative
      v-if="modal === 'restrict_license_no_alternative'"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
