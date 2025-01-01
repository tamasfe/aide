<script setup lang="ts">
import type { RouteLocationNamedRaw } from "vue-router";

const { t } = useI18n();

export type NavDashboardSectionItem = "settings" | "history";

type Route = {
  title: string;
  to: RouteLocationNamedRaw;
};

const props = defineProps<{
  section: NavDashboardSectionItem;
}>();

const settingsRoutes: Route[] = [
  {
    title: t("dashboard.nav.wallet"),
    to: {
      name: "settings-wallet",
    },
  },
  {
    title: t("dashboard.nav.account"),
    to: {
      name: "settings-account",
    },
  },
  {
    title: t("dashboard.nav.preferences"),
    to: {
      name: "settings-preferences",
    },
  },
  {
    title: t("dashboard.nav.verification"),
    to: {
      name: "settings-verification",
    },
  },
  // {
  //   title: t("dashboard.nav.limits"),
  //   to: {
  //     name: "settings-limits",
  //   },
  // },
];

const historyRoutes: Route[] = [
  {
    title: t("dashboard.nav.deposits"),
    to: {
      name: "history-deposits",
    },
  },
  {
    title: t("dashboard.nav.withdrawals"),
    to: {
      name: "history-withdrawals",
    },
  },
  {
    title: t("dashboard.nav.casino"),
    to: {
      name: "history-casino",
    },
  },
];

const routes = props.section === "settings" ? settingsRoutes : historyRoutes;

const { currentRoute } = useRouter();
const getRouteBaseName = useRouteBaseName();

const isActive = (to: RouteLocationNamedRaw) =>
  getRouteBaseName(currentRoute.value) === to.name;
</script>

<template>
  <div class="flex items-center gap-3 w-full">
    <BaseLink
      v-for="(route, index) in routes"
      :key="index"
      :to="route.to"
      :class="
        cn(
          'h-10 px-5 flex items-center justify-center rounded text-sm font-medium text-emphasis',
          isActive(route.to)
            ? 'text-emphasis-light bg-[#272646]'
            : 'text-subtle bg-[#181732] hover:bg-[#272646]',
        )
      "
    >
      {{ route.title }}
    </BaseLink>
  </div>
</template>
