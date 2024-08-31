<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  section: "settings" | "history";
}>();

const settingsRoutes = [
  {
    title: t("dashboard.wallet"),
    to: "TODO",
  },
  {
    title: t("dashboard.account"),
    to: "TODO",
  },
  {
    title: t("dashboard.preferences"),
    to: "TODO",
  },
  {
    title: t("dashboard.verification"),
    to: "TODO",
  },
  {
    title: t("dashboard.limits"),
    to: "TODO",
  },
];

const historyRoutes = [
  {
    title: t("dashboard.deposits"),
    to: "TODO",
  },
  {
    title: t("dashboard.withdrawals"),
    to: "TODO",
  },
  {
    title: t("dashboard.casino"),
    to: "TODO",
  },
  {
    title: t("dashboard.sportsbook"),
    to: "TODO",
  },
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
