<script setup lang="ts">
const walletStore = useWalletStore();
const { t } = useI18n();

const onClickBalance = async () => {
  await navigateTo("/settings/wallet");
};
</script>

<template>
  <div v-if="walletStore.isInit">
    <BaseButton
      v-if="walletStore.balanceStatus === 'ready'"
      variant="secondary"
      @click="onClickBalance"
    >
      <BaseCurrency
        class="text-white"
        :currency="walletStore.wallet.currency"
        :value="walletStore.wallet.balanceValue"
      />
    </BaseButton>
    <BaseButton
      v-if="walletStore.balanceStatus === 'loading'"
      :disabled="true"
      class="flex items-center justify-center gap-2"
      variant="secondary"
    >
      <BaseCurrency
        variant="ghost"
        :currency="walletStore.wallet.currency"
        :value="walletStore.wallet.balanceValue"
      />
    </BaseButton>
    <BaseButton
      v-if="walletStore.balanceStatus === 'hidden'"
      :disabled="true"
      variant="secondary"
    >
      {{ t("user_nav.balance_hidden_while_playing") }}
    </BaseButton>
  </div>
</template>
