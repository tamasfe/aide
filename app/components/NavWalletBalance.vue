<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();

const onClickBalance = async () => {
  await navigateTo("/settings/wallet");
};
</script>

<template>
  <div>
    <BaseButton
      v-if="walletStore.isInit && walletStore.balanceStatus === 'ready'"
      variant="secondary"
      @click="onClickBalance"
    >
      <BaseCurrency
        class="text-white"
        :currency="walletStore.wallet.currency"
        :value="walletStore.wallet.balance"
      />
    </BaseButton>
    <BaseButton
      v-if="walletStore.isInit && walletStore.balanceStatus === 'loading'"
      :disabled="true"
      class="flex items-center justify-center gap-2"
      variant="secondary"
    >
      <BaseCurrency
        variant="ghost"
        :currency="walletStore.wallet.currency"
        :value="walletStore.wallet.balance"
      />
    </BaseButton>
    <BaseButton
      v-if="walletStore.isInit && walletStore.balanceStatus === 'hidden'"
      :disabled="true"
      variant="secondary"
    >
      {{ t("user_nav.balance_hidden_while_playing") }}
    </BaseButton>
    <BaseButton
      v-if="!walletStore.isInit"
      variant="secondary"
      :disabled="true"
    >
      <BaseSkeleton class="w-16" :loading="true" />
    </BaseButton>
  </div>
</template>
