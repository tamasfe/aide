<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
const siteStore = useSiteStore();
const walletStore = useWalletStore();
const walletModule = useWalletModule();
const nuxtApp = useNuxtApp();
const open = ref(false);

useRuntimeHook("frontend:command:modal:withdraw:open", () => {
  open.value = true;
  execute();
});

useRuntimeHook("frontend:command:modal:withdraw:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:withdraw:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:withdraw:closed");
  }
});

const userUnlockedBalance = computed(() => walletStore.wallet?.balance_unlocked ?? null);

const { data: paymentMethods, execute } = useAsyncData(
  "payment-methods",
  walletModule.ui.findPreferredPaymentMethodsOnStoreRefresh.handle,
  {
    server: true,
    lazy: true,
  },
);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/withdrawal_horizontal.jpg')"
  >
    <template #title>
      {{ $t('modal_payments.make_withdrawal') }}
    </template>
    <template #subtitle>
      {{ $t('modal_payments.make_withdrawal_subtitle') }}
    </template>

    <FormWithdrawal
      v-if="paymentMethods && walletStore.wallet"
      :payment-method-limits="paymentMethods.limits"
      :payment-method-id="paymentMethods.preferred.id"
      :currency="walletStore.wallet.currency"
      :user-unlocked-balance="userUnlockedBalance"
    />
    <BaseSkeleton
      v-else
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
