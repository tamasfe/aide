<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const { hostname } = useRequestURL();

const modal = defineModel("modal", {
  type: String,
  default: "",
});

const blockedCountry = useState("user-modal-blocked-country", () => "");
const currentHost = useState("user-modal-current-host", () => "");
const allowedDomain = useState<string | null>("user-modal-allowed-domain", () => null);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    modal.value = "login";
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-register",
  () => {
    modal.value = "register";
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
  "girobet:commands:modals:open-search",
  () => {
    modal.value = "search";
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:close-user-interaction-modal",
  () => {
    modal.value = "";
  },
);
</script>

<template>
  <div>
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
    <ModalSearch
      v-if="modal === 'search'"
    />
  </div>
</template>
