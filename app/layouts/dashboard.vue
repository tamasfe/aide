<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  section: "settings" | "history";
}>();

const settingsRoutes = [
  {
    title: t("dashboard.wallet"),
    to: "/settings/wallet",
  },
  {
    title: t("dashboard.account"),
    to: "/settings/account",
  },
  {
    title: t("dashboard.preferences"),
    to: "/settings/preferences",
  },
  {
    title: t("dashboard.verification"),
    to: "/settings/verification",
  },
  {
    title: t("dashboard.limits"),
    to: "/settings/limits",
  },
];

const historyRoutes = [
  {
    title: t("dashboard.deposits"),
    to: "/history/deposits",
  },
  {
    title: t("dashboard.withdrawals"),
    to: "/history/withdrawals",
  },
  {
    title: t("dashboard.casino"),
    to: "/history/casino",
  },
  // {
  //   title: t("dashboard.sportsbook"),
  //   to: "/history/sportsbook",
  // },
];
</script>

<template>
  <div class="py-8 giro__container giro__sections">
    <NavDashboard
      v-if="section === 'settings'"
      :routes="settingsRoutes"
    />
    <NavDashboard
      v-else-if="section === 'history'"
      :routes="historyRoutes"
    />

    <slot />
  </div>
</template>
