<script setup lang="ts">
import type { Route } from "~/components/NavBar.vue";

definePageMeta({
  layout: "account",
});

const localePath = useLocalePath();
const { t } = useI18n();
const walletStore = useWalletStore();
const nuxtApp = useNuxtApp();

const navRoutes = computed<Route[]>(() => [
  {
    title: t("account.nav.wallet"),
    to: localePath({
      name: "wallet",
    }),
  },
  {
    title: t("account.nav.deposits"),
    to: localePath({
      name: "wallet-deposits",
    }),
  },
  {
    title: t("account.nav.withdrawals"),
    to: localePath({
      name: "wallet-withdrawals",
    }),
  },
  {
    title: t("account.nav.casino"),
    to: localePath({
      name: "wallet-casino",
    }),
  },
]);
</script>

<template>
  <div class="sm:pt-8">
    <DashboardSettingsWalletBalance
      v-if="walletStore.wallet"
      class="mb-6 sm:mb-14"
      :balance="walletStore.balance"
      :balance-unlocked="walletStore.wallet.balance_unlocked"
      :payment-method="walletStore.wallet.payment_method ?? undefined"
      :currency="walletStore.wallet.currency"
      :wallet-id="walletStore.wallet.wallet_id"
      @click-deposit="nuxtApp.callHook('frontend:command:modal:deposit:open')"
      @click-withdraw="nuxtApp.callHook('frontend:command:modal:withdraw:open')"
    />

    <NavBar :routes="navRoutes" class="mb-4 scroll-px-4 -mx-4 px-4" />
    <NuxtPage />
  </div>
</template>
