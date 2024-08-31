<script setup lang="ts">
const { t } = useI18n();

export type DashboardNavSection = "settings" | "history";

type Route = {
  title: string;
  to: string;
};

const props = defineProps<{
  section: DashboardNavSection;
}>();

const settingsRoutes: Route[] = [
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

const historyRoutes: Route[] = [
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

const routes = props.section === "settings" ? settingsRoutes : historyRoutes;

const { currentRoute } = useRouter();

const isActive = (to: string) => currentRoute.value.path === to;
</script>

<template>
  <div
    class="flex items-center gap-4 w-full overflow-x-auto no-scrollbar"
  >
    <NuxtLink
      v-for="route in routes"
      :key="route.to"
      :to="route.to"
      :class="cn(
        'rounded-default font-medium text-emphasis py-3 px-6',
        isActive(route.to) ? 'text-emphasis bg-[#272646]' : 'text-subtle bg-[#181732]',
      )"
    >
      {{ route.title }}
    </NuxtLink>
  </div>
</template>
