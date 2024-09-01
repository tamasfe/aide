<script setup lang="ts">
const { t } = useI18n();

export type NavDashboardSectionItem = "settings" | "history";

type Route = {
  title: string;
  to: string;
};

const props = defineProps<{
  section: NavDashboardSectionItem;
}>();

const settingsRoutes: Route[] = [
  {
    title: t("dashboard.nav.wallet"),
    to: "/settings/wallet",
  },
  {
    title: t("dashboard.nav.account"),
    to: "/settings/account",
  },
  {
    title: t("dashboard.nav.preferences"),
    to: "/settings/preferences",
  },
  {
    title: t("dashboard.nav.verification"),
    to: "/settings/verification",
  },
  {
    title: t("dashboard.nav.limits"),
    to: "/settings/limits",
  },
];

const historyRoutes: Route[] = [
  {
    title: t("dashboard.nav.deposits"),
    to: "/history/deposits",
  },
  {
    title: t("dashboard.nav.withdrawals"),
    to: "/history/withdrawals",
  },
  {
    title: t("dashboard.nav.casino"),
    to: "/history/casino",
  },
  // {
  //   title: t("dashboard.nav.sportsbook"),
  //   to: "/history/sportsbook",
  // },
];

const routes = props.section === "settings" ? settingsRoutes : historyRoutes;

const { currentRoute } = useRouter();

const isActive = (to: string) => currentRoute.value.path === to;
</script>

<template>
  <div
    class="flex items-center gap-3 w-full overflow-x-auto no-scrollbar"
  >
    <NuxtLink
      v-for="route in routes"
      :key="route.to"
      :to="route.to"
      :class="cn(
        'h-10 px-5 flex items-center justify-center rounded-default text-[0.8rem] font-medium text-emphasis',
        isActive(route.to) ? 'text-emphasis-light bg-[#272646]' : 'text-subtle bg-[#181732]',
      )"
    >
      {{ route.title }}
    </NuxtLink>
  </div>
</template>
