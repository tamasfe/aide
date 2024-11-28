<script setup lang="ts">
import type { PropType } from "vue";

const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const { hostname, searchParams } = useRequestURL();

type Modal = "login" | "register" | "forgot" | "recover_password" | "cancel_reg" | "deposit" | "deposit_confirm" | "withdrawal" | "restrict_expanding" | "restrict_license_alternative" | "restrict_license_no_alternative" | "search";
const modal = defineModel<Modal | null>("modal", {
  type: String as PropType<Modal>,
  default: null,
});

const blockedCountry = useState("user-modal-blocked-country", () => "");
const currentHost = useState("user-modal-current-host", () => "");
const allowedDomain = useState<string | null>("user-modal-allowed-domain", () => null);
const recoverPasswordToken = useState("user-modal-recover-password-token", () => searchParams.get("recovery-token") || "");

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "login";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-register",
  () => {
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "register";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-search",
  () => {
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "search";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-recover-password",
  ({ token }) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "recover_password";
    recoverPasswordToken.value = token;
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-forgot-password",
  () => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "forgot";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-deposit",
  () => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(modal.value)) {
      return;
    }
    modal.value = "deposit";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-expanding",
  (eventData) => {
    modal.value = "restrict_expanding";
    blockedCountry.value = t("jurisdiction." + eventData.jurisdiction, eventData.jurisdiction);
    currentHost.value = hostname;
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-alternative",
  (eventData) => {
    modal.value = "restrict_license_alternative";
    blockedCountry.value = t("jurisdiction." + eventData.jurisdiction, eventData.jurisdiction);
    allowedDomain.value = eventData.allowedDomain;
    currentHost.value = hostname;
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-network-issues",
  (eventData) => {
    modal.value = "restrict_license_no_alternative";
    blockedCountry.value = t("jurisdiction." + eventData.jurisdiction, eventData.jurisdiction);
    currentHost.value = hostname;
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:close-user-interaction-modal",
  () => {
    modal.value = null;
  },
);

if (recoverPasswordToken.value) {
  $dependencies.users.ui.emitCommandOpenUserActionModal.handle("recover_password", recoverPasswordToken.value);
}

const modalIsJurisdictionModal = (modal: Modal | null): boolean => {
  return modal === "restrict_license_no_alternative" || modal === "restrict_license_alternative" || modal === "restrict_expanding";
};
</script>

<template>
  <div>
    <ModalLogin
      v-if="modal === 'login'"
    />
    <ModalRegister
      :open="modal === 'register'"
    />
    <ModalForgotPassword
      v-if="modal === 'forgot'"
    />
    <ModalRecoverPassword
      v-if="modal === 'recover_password'"
      :token="recoverPasswordToken"
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
    <ModalSearch
      v-if="modal === 'search'"
    />
    <ModalRestrictExpanding
      v-if="modal === 'restrict_expanding'"
      :blocked-country="blockedCountry"
      :blocked-domain="currentHost"
    />
    <ModalRestrictLicenseAlternative
      v-if="modal === 'restrict_license_alternative' && allowedDomain"
      :blocked-country="blockedCountry"
      :blocked-domain="currentHost"
      :allowed-domain="allowedDomain"
    />
    <ModalRestrictLicenseNoAlternative
      v-if="modal === 'restrict_license_no_alternative'"
      :blocked-country="blockedCountry"
    />
  </div>
</template>
