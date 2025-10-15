<script setup lang="ts">
import type { Route } from "~/components/NavBar.vue";

definePageMeta({
  layout: "account",
});

const localePath = useLocalePath();
const { t } = useI18n();

const navRoutes = computed<Route[]>(() => [
  {
    title: t("account.nav.account"),
    to: localePath({
      name: "settings-account",
    }),
  },
  {
    title: t("account.nav.preferences"),
    to: localePath({
      name: "settings-preferences",
    }),
  },
  {
    title: t("account.nav.verification"),
    to: localePath({
      name: "settings-verification",
    }),
  },
]);
</script>

<template>
  <div>
    <NavBar :routes="navRoutes" class="mb-4 md:mb-6 scroll-px-4 -mx-4 px-4" />
    <NuxtPage />
  </div>
</template>
