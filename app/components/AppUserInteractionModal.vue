<script setup lang="ts">
import type { UserInteractionModalState } from "~/packages/async-messages/async-messages";
import type { AlertProps } from "./base/Alert.vue";

const { searchParams } = useRequestURL();
const gameSessionStore = useGameSessionStore();
const user = useUserModule();
const nuxtApp = useNuxtApp();

const state = useState<(UserInteractionModalState | { modal: null }) & { alert?: AlertProps }>("user-modal-state", () => ({ modal: null }));
const isOpen = defineModel<boolean>("open", { type: Boolean, required: true });

const modalIsJurisdictionModal = (modal: UserInteractionModalState["modal"] | null): boolean => {
  return modal === "restrict_license_no_alternative" || modal === "restrict_license_alternative" || modal === "restrict_expanding";
};

nuxtApp.hook("frontend:commands:modals:open-user-interaction-modal", (event) => {
  if (modalIsJurisdictionModal(state.value.modal) && !modalIsJurisdictionModal(event.modal)) {
    return;
  }

  state.value = event;
  isOpen.value = true;
});

nuxtApp.hook("frontend:commands:modals:close-user-interaction-modal", () => {
  if (modalIsJurisdictionModal(state.value.modal)) {
    return;
  }

  isOpen.value = false;
});

nuxtApp.hook("backend:events:payments:payment-status-updated", ({ data }) => {
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
});

const SECONDS_TO_AUTO_OPEN_PROMO_MODAL = 10;
const openPromoModalIfPossible = () => {
  if (isOpen.value || gameSessionStore.playing) {
    setTimeout(() => {
      openPromoModalIfPossible();
    }, SECONDS_TO_AUTO_OPEN_PROMO_MODAL * 1000);
    return;
  }
  user.ui.openUserPromoActionModalOncePerDay.handle(new Date());
};

if (!import.meta.server) {
  setTimeout(() => {
    openPromoModalIfPossible();
  }, SECONDS_TO_AUTO_OPEN_PROMO_MODAL * 1000);
}

const recoverPasswordToken = useState("user-modal-recover-password-token", () => searchParams.get("recovery-token") || "");

if (recoverPasswordToken.value) {
  user.ui.emitCommandOpenUserActionModal.handle({ modal: "recover_password", data: { token: recoverPasswordToken.value } });
}

/**
 * If the modal is open and user clicks back button: modal closes without navigation.
 * The previous URL is stored to prevent navigation to it using the back button, but not prevent the user from navigating forward to other pages from inside a modal.
 * The watch seems to be necessary to keep updating the previous URL, but at the same time it needs to be out of the beforeResolve hook to ensure we save the previousRoute before resolving the next one.
 */
const router = useRouter();
const route = useRoute();
const previousUrl = ref(router.options.history.state.back);

watch(() => route, () => {
  previousUrl.value = router.options.history.state.back;
});

router.beforeResolve((to, from, next) => {
  if (isOpen.value === false) {
    next();
    return;
  }

  isOpen.value = false;
  if (to.path === previousUrl.value?.toString()) {
    next(false);
    return;
  }

  next();
  return;
});
</script>

<template>
  <BaseOverlay v-if="isOpen" class="z-[10]" @click="isOpen = false" />

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
  <ModalPromoUserAction
    :open="isOpen && state.modal === 'promo_user_action'"
  />
  <ModalCancelRegistration
    :open="isOpen && state.modal === 'cancel_registration'"
  />
  <ModalDeposit
    :open="isOpen && state.modal === 'deposit'"
    :alert="state.alert"
  />
  <ModalDepositConfirm
    :open="isOpen && state.modal === 'deposit_confirm'"
    :payment="state.modal === 'deposit_confirm' ? state.data : undefined"
  />
  <ModalWithdrawal
    :open="isOpen && state.modal === 'withdrawal'"
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
</template>
