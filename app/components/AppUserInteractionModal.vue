<script setup lang="ts">
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";

const { $dependencies } = useNuxtApp();
const { searchParams } = useRequestURL();
const walletStore = useWalletStore();

const state = useState<UserInteractionModalState | { modal: null }>("user-modal-state", () => ({ modal: null }));
const isOpen = defineModel<boolean>("open", { type: Boolean, required: true });

const modalIsJurisdictionModal = (modal: UserInteractionModalState["modal"] | null): boolean => {
  return modal === "restrict_license_no_alternative" || modal === "restrict_license_alternative" || modal === "restrict_expanding";
};

$dependencies.common.asyncMessagePublisher.subscribe(
  "frontend:commands:modals:open-user-interaction-modal",
  (event) => {
    if (modalIsJurisdictionModal(state.value.modal) && !modalIsJurisdictionModal(event.modal)) {
      return;
    }

    state.value = event;
    isOpen.value = true;
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "frontend:commands:modals:close-user-interaction-modal",
  () => {
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }

    isOpen.value = false;
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet-backend:events:payments:payment-status-updated",
  ({ data }) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    if (state.value.modal !== "deposit_confirm") {
      return;
    }
    if (data.flowId === state.value.data.flowId) {
      isOpen.value = false;
    }
  },
);

const recoverPasswordToken = useState("user-modal-recover-password-token", () => searchParams.get("recovery-token") || "");
if (recoverPasswordToken.value) {
  $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: "recover_password", data: { token: recoverPasswordToken.value } });
}

const openModalSearchParam = searchParams.get("open-modal") || null;
if (openModalSearchParam) {
  switch (openModalSearchParam) {
    case "login":
    case "register":
    case "forgot_password":
      $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: openModalSearchParam });
      break;

    case "deposit":
      if (walletStore.wallet) {
        $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: openModalSearchParam });
      }
      break;
  }
}

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: paymentMethodData } = await useAsyncData("user-modals-payment-method", async () => {
  if (!walletStore.wallet) {
    return null;
  }
  return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet.currency);
}, {
  watch: [() => walletStore.wallet?.currency],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});
</script>

<template>
  <div id="app-user-interaction-modal" :data-is-open="isOpen">
    <ModalLogin
      :open="isOpen && state.modal === 'login'"
    />
    <ModalRegister
      :open="isOpen && state.modal === 'register'"
    />
    <ModalForgotPassword
      :open="isOpen && state.modal === 'forgot_password'"
    />
    <ModalRecoverPassword
      :open="isOpen && state.modal === 'recover_password'"
      :token="recoverPasswordToken"
    />
    <ModalCancelRegistration
      :open="isOpen && state.modal === 'cancel_registration'"
    />
    <ModalDeposit
      :open="isOpen && state.modal === 'deposit'"
      :limits="paymentMethodData?.depositAmounts ?? null"
      :payment-method-id="paymentMethodData?.id ?? null"
    />
    <ModalDepositConfirm
      :open="isOpen && state.modal === 'deposit_confirm'"
      :payment="state.modal === 'deposit_confirm' ? state.data : undefined"
    />
    <ModalWithdrawal
      :open="isOpen && state.modal === 'withdrawal'"
      :limits="paymentMethodData?.withdrawalAmounts ?? null"
      :payment-method-id="paymentMethodData?.id ?? null"
    />
    <ModalSearch :open="isOpen && state.modal === 'search'" />
    <ModalUpdateSettings
      :open="isOpen && state.modal === 'settings'"
      :setting="state.modal === 'settings' ? state.data.setting : undefined"
    />
    <ModalKycFlow
      :open="isOpen && state.modal === 'kyc'"
      :applicant-data="state.modal === 'kyc' ? state.data.applicantData : undefined"
      :initial-access-token="state.modal === 'kyc' ? state.data.accessToken : undefined"
    />
    <ModalCloseAccount
      :open="isOpen && state.modal === 'close_account'"
    />
    <ModalRestrictExpanding
      v-if="isOpen && state.modal === 'restrict_expanding'"
      :blocked-country="state.data.blockedCountry"
      :blocked-domain="state.data.currentHost"
    />
    <ModalRestrictLicenseAlternative
      v-if="isOpen && state.modal === 'restrict_license_alternative'"
      :blocked-country="state.data.blockedCountry"
      :blocked-domain="state.data.currentHost"
      :allowed-url="state.data.allowedUrl"
    />
    <ModalRestrictLicenseNoAlternative
      v-if="isOpen && state.modal === 'restrict_license_no_alternative'"
      :blocked-country="state.data.blockedCountry"
    />
  </div>
</template>
