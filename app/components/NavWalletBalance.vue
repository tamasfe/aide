<script setup lang="ts">
const walletStore = useWalletStore();
const gameSessionStore = useGameSessionStore();
const { t } = useI18n();
const localePath = useLocalePath();
const flashRef = ref<HTMLDivElement | null>(null);

const onClickBalance = async () => {
  await navigateTo(localePath("/settings/wallet"));
};

// Watch for balance changes and trigger animation
watch(() => walletStore.balanceStatus, () => {
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
      v-if="!gameSessionStore.isPlaying && walletStore.wallet === undefined"
      variant="secondary"
      :disabled="true"
      class="min-w-20"
      @click="onClickBalance"
    >
      <BaseSkeleton
        class="w-6 rounded"
        :loading="true"
      />
      <BaseSkeleton
        class="w-12 rounded"
        :loading="true"
      />
    </BaseButton>

    <BaseButton
      v-if="!gameSessionStore.isPlaying &&walletStore.wallet"
      variant="secondary"
      :disabled="walletStore.balanceStatus !== 'ready'"
      class="min-w-20"
      @click="onClickBalance"
    >
      <BaseCurrency
        v-if="walletStore.balanceStatus === 'ready'"
        class="text-white"
        :currency="walletStore.wallet.currency"
        :value="walletStore.balance"
      />
      <BaseCurrency
        v-if="walletStore.balanceStatus === 'loading'"
        variant="ghost"
        :currency="walletStore.wallet.currency"
        :value="walletStore.balance"
      />
    </BaseButton>

    <BaseButton
      v-if="gameSessionStore.isPlaying"
      variant="secondary"
      :disabled="true"
      class="min-w-20"
      @click="onClickBalance"
    >
      {{ t("user_nav.balance_hidden_while_playing") }}
    </BaseButton>
  </div>
</template>
