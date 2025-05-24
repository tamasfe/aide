<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();
const localePath = useLocalePath();
const flashRef = ref<HTMLDivElement | null>(null);

const onClickBalance = async () => {
  await navigateTo(localePath("/settings/wallet"));
};

const ENABLE_SERVER_SIDE_RENDERING = true;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data } = await useAsyncData("nav-wallet-balance-wallet", async () => {
  return { balanceStatus: walletStore.balanceStatus };
}, {
  watch: [() => walletStore.balanceStatus, () => walletStore.balance],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});

// Watch for balance changes and trigger animation
watch(() => data.value?.balanceStatus, () => {
  flashRef.value?.animate([
    { opacity: 0, offset: 0 },
    { opacity: 1, offset: 0.1 },
    { opacity: 0, offset: 1 },
  ], {
    duration: 200,
    iterations: 1,
    easing: "ease-in-out",
  });
});
</script>

<template>
  <div class="relative">
    <div
      ref="flashRef"
      class="absolute inset-0 rounded bg-white/30 opacity-0 pointer-events-none"
    />
    <BaseButton
      variant="secondary"
      :disabled="data?.balanceStatus !== 'ready'"
      class="min-w-20"
      @click="onClickBalance"
    >
      <BaseCurrency
        v-if="walletStore.wallet && data?.balanceStatus === 'ready'"
        class="text-white"
        :currency="walletStore.wallet.currency"
        :value="walletStore.balance"
      />
      <BaseCurrency
        v-if="walletStore.wallet && data?.balanceStatus === 'loading'"
        variant="ghost"
        :currency="walletStore.wallet.currency"
        :value="walletStore.balance"
      />
      <div v-if="!walletStore?.wallet" class="flex gap-1 h-6">
        <BaseSkeleton
          class="w-6 rounded"
          :loading="true"
        />
        <BaseSkeleton
          class="w-12 rounded"
          :loading="true"
        />
      </div>

      <span v-if="data?.balanceStatus === 'hidden'">
        {{ t("user_nav.balance_hidden_while_playing") }}
      </span>
      <BaseSkeleton v-if="!data?.balanceStatus" :loading="true" />
    </BaseButton>
  </div>
</template>
