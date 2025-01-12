<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();
const localePath = useLocalePath();
const flashRef = ref<HTMLDivElement | null>(null);

const onClickBalance = async () => {
  await navigateTo(localePath("/settings/wallet"));
};

const ENABLE_SERVER_SIDE_RENDERING = false;
const DEFER_CLIENT_SIDE_LOADING = true;

const { data } = await useAsyncData("nav-wallet-balance-wallet", async () => {
  return { balanceStatus: walletStore.balanceStatus, wallet: walletStore.wallet };
}, {
  watch: [() => walletStore.balanceStatus],
  lazy: DEFER_CLIENT_SIDE_LOADING,
  server: ENABLE_SERVER_SIDE_RENDERING,
});

// Watch for balance changes and trigger animation
watch(() => data.value?.wallet?.balance, (newBalance) => {
  console.log("newBalance", newBalance, flashRef.value);

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
        v-if="data?.wallet && data?.balanceStatus === 'ready'"
        class="text-white"
        :currency="data.wallet.currency"
        :value="data.wallet.balance"
      />
      <BaseCurrency
        v-if="data?.wallet && data?.balanceStatus === 'loading'"
        variant="ghost"
        :currency="data.wallet.currency"
        :value="data.wallet.balance"
      />
      <span v-if="data?.balanceStatus === 'hidden'">
        {{ t("user_nav.balance_hidden_while_playing") }}
      </span>
      <BaseSkeleton v-if="!data?.balanceStatus" :loading="true" />
    </BaseButton>
  </div>
</template>
