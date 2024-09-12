<script setup lang="ts">
const { t } = useI18n();

const modal = ref("");

// TODO: we need to show this console warning to users like facebook does.
// we ideally should show it after 1-2 seconds so all the junk requests have time to
// clear first, that way they actually see it. also.. it should go in a better spot
setTimeout(() => {
  consoleWarning(t("console_warning.title"), "danger");
  consoleWarning(t("console_warning.description"));
}, 600);

const { $dependencies } = useNuxtApp();

$dependencies.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    modal.value = "login";
  },
);

$dependencies.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-register",
  () => {
    modal.value = "register";
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
