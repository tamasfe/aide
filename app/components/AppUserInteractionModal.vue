<script setup lang="ts">
import type { WalletCurrency } from "~/modules/wallet/domain/WalletCurrency";

const { $dependencies } = useNuxtApp();
const { locale } = useI18n();
const { hostname, searchParams } = useRequestURL();
const walletStore = useWalletStore();

type ModalState =
  | { modal: null | "login" | "register" | "forgot" | "cancel_reg" | "deposit" | "withdrawal" | "search" }
  | {
    modal: "settings";
    setting: "password";
  } | {
    modal: "recover_password";
    token: string;
  } |
  {
    modal: "deposit_confirm";
    paymentCode: string;
    amount: number;
    currency: WalletCurrency;
    flowId: number;
  } |
  {
    modal: "restrict_license_alternative";
    blockedCountry: string;
    currentHost: string;
    alternativeUrl: string;
  } |
  {
    modal: "restrict_license_no_alternative";
    blockedCountry: string;
    currentHost: string;
  } |
  {
    modal: "restrict_expanding";
    blockedCountry: string;
    currentHost: string;
  };

const state = useState<ModalState>("user-modal-state", () => ({ modal: null }));

const isOpen = defineModel<boolean>("open", { type: Boolean, required: true });
watch(state, () => {
  if (state.value.modal === null) {
    isOpen.value = false;
  }
  else {
    isOpen.value = true;
  }
});

watch(isOpen, () => {
  if (isOpen.value === false) {
    state.value = { modal: null };
  }
});

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-login",
  () => {
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "login",
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-register",
  () => {
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "register",
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-search",
  () => {
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "search",
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-recover-password",
  ({ token }) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = { modal: "recover_password", token };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-forgot-password",
  () => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "forgot",
    };
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-update-settings",
  (data) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "settings",
      setting: data.setting,
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-deposit",
  () => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "deposit",
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-deposit-confirm",
  ({ paymentCode, amount, currency, flowId }) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = { modal: "deposit_confirm", paymentCode, amount, currency, flowId };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-withdrawal",
  () => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    state.value = {
      modal: "withdrawal",
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet-backend:events:payments:payment-status-updated",
  ({ flowId }) => {
    // If any of the invalid jurisdiction modals are open: keep them open
    if (modalIsJurisdictionModal(state.value.modal)) {
      return;
    }
    if (state.value.modal !== "deposit_confirm") {
      return;
    }
    if (flowId === state.value.flowId) {
      state.value = {
        modal: null,
      };
    }
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-expanding",
  (eventData) => {
    state.value = {
      modal: "restrict_expanding",
      blockedCountry: useCountryName(eventData.jurisdiction, locale.value) || eventData.jurisdiction,
      currentHost: hostname,
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-alternative",
  (eventData) => {
    state.value = {
      modal: "restrict_license_alternative",
      blockedCountry: useCountryName(eventData.jurisdiction, locale.value) || eventData.jurisdiction,
      currentHost: hostname,
      alternativeUrl: eventData.allowedDomain,
    };
  },
);
$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:open-restrict-no-alternative",
  (eventData) => {
    state.value = {
      modal: "restrict_license_no_alternative",
      blockedCountry: useCountryName(eventData.jurisdiction, locale.value) || eventData.jurisdiction,
      currentHost: hostname,
    };
  },
);

$dependencies.common.asyncMessagePublisher.subscribe(
  "girobet:commands:modals:close-user-interaction-modal",
  () => {
    state.value = { modal: null };
  },
);

const recoverPasswordToken = useState("user-modal-recover-password-token", () => searchParams.get("recovery-token") || "");
if (recoverPasswordToken.value) {
  $dependencies.users.ui.emitCommandOpenUserActionModal.handle({ modal: "recover_password", data: { token: recoverPasswordToken.value } });
}

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;
const { data: paymentMethodData } = await useAsyncData("user-modals-payment-method", async () => {
  if (!walletStore.wallet) {
    return null;
  }
  return await $dependencies.wallets.ui.findPreferredPaymentMethodOnPaymentModal.handle(walletStore.wallet.currency);
}, {
  watch: [() => walletStore.wallet?.balance],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});

const modalIsJurisdictionModal = (modal: ModalState["modal"]): boolean => {
  return modal === "restrict_license_no_alternative" || modal === "restrict_license_alternative" || modal === "restrict_expanding";
};
</script>

<template>
  <div>
    <ModalLogin
      v-if="state.modal === 'login'"
    />
    <ModalRegister
      :open="state.modal === 'register'"
    />
    <ModalForgotPassword
      v-if="state.modal === 'forgot'"
    />
    <ModalRecoverPassword
      v-if="state.modal === 'recover_password'"
      :token="recoverPasswordToken"
    />
    <ModalCancelRegistration
      v-if="state.modal === 'cancel_reg'"
    />
    <ModalDeposit
      :open="state.modal === 'deposit'"
      :limits="paymentMethodData?.depositAmounts ?? null"
      :payment-method-id="paymentMethodData?.id ?? null"
    />
    <ModalDepositConfirm
      v-if="state.modal === 'deposit_confirm'"
      :code="state.paymentCode"
      :amount="state.amount"
      :currency="state.currency"
    />
    <ModalWithdrawal
      :open="state.modal === 'withdrawal'"
      :limits="paymentMethodData?.withdrawalAmounts ?? null"
      :payment-method-id="paymentMethodData?.id ?? null"
    />
    <ModalSearch
      v-if="state.modal === 'search'"
    />
    <ModalUpdateSettings
      v-if="state.modal === 'settings'"
      :setting="state.setting"
    />
    <ModalRestrictExpanding
      v-if="state.modal === 'restrict_expanding'"
      :blocked-country="state.blockedCountry"
      :blocked-domain="state.currentHost"
    />
    <ModalRestrictLicenseAlternative
      v-if="state.modal === 'restrict_license_alternative'"
      :blocked-country="state.blockedCountry"
      :blocked-domain="state.currentHost"
      :allowed-url="state.alternativeUrl"
    />
    <ModalRestrictLicenseNoAlternative
      v-if="state.modal === 'restrict_license_no_alternative'"
      :blocked-country="state.blockedCountry"
    />
  </div>
</template>
