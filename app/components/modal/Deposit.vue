<script setup lang="ts">
const walletModule = useWalletModule();
const walletStore = useWalletStore();
const nuxtApp = useNuxtApp();
const siteStore = useSiteStore();
const open = ref(false);

useRuntimeHook("frontend:command:modal:deposit:open", () => {
  open.value = true;
  execute();
});

useRuntimeHook("frontend:command:modal:deposit:close", () => {
  open.value = false;
});

useRuntimeHook("frontend:command:modal:close", () => {
  open.value = false;
});

watch(open, (newValue) => {
  if (newValue) {
    nuxtApp.callHook("frontend:event:modal:deposit:opened");
  }
  else {
    nuxtApp.callHook("frontend:event:modal:deposit:closed");
  }
});

const { data: paymentMethods, execute } = useAsyncData(
  "payment-methods",
  async () => walletModule.ui.findPreferredPaymentMethodsOnStoreRefresh.handle(),
  {
    server: true,
    lazy: true,
  },
);
</script>

<template>
  <BaseModal
    v-model:open="open"
    :disabled="false"
    :logo="false"
    banner="top"
    :banner-top="siteStore.getRelativeAssetPath('banners/deposit_horizontal.jpg')"
  >
    <template #title>
      {{ $t('modal_payments.make_deposit') }}
    </template>
    <template #subtitle>
      <div v-if="paymentMethods?.limits?.depositMin" class="flex items-center justify-between">
        <span>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
        <span class="text-right block space-x-2">
          <span>{{ $t('modal_deposit.minimum') }}:</span>
          <BaseCurrency
            v-if="walletStore.activeCurrency"
            class="inline"
            :value="paymentMethods.limits?.depositMin"
            :currency="walletStore.activeCurrency"
            variant="ghost"
          />
        </span>
      </div>
      <span v-else>{{ $t('modal_payments.make_deposit_subtitle') }}</span>
    </template>

    <FormDeposit
      v-if="paymentMethods && walletStore.activeCurrency"
      :amounts="{ min: paymentMethods.limits.depositMin ?? null, max: paymentMethods.limits.depositMax ?? null }"
      :currency="walletStore.activeCurrency"
      :payment-methods="paymentMethods.methods"
      :payment-method-id="paymentMethods.preferred.id"
    />

    <BaseSkeleton
      v-else
      class="mt-2 w-full h-[30vh]"
      :loading="true"
    />
  </BaseModal>
</template>
