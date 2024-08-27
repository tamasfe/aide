<script setup lang="ts">
const { currentRoute } = useRouter();

const routes = [
  {
    title: "Wallet",
    route: "account-wallet",
  },
  {
    title: "Account",
    route: "account-details",
  },
  {
    title: "Preferences",
    route: "account-preferences",
  },
  {
    title: "Verifications",
    route: "account-verifications",
  },
  {
    title: "Limits",
    route: "account-limits",
  },
];

const isActive = (route: string) => currentRoute.value.name === route;
</script>

<template>
  <div
    class="flex items-center space-x-4 w-full overflow-x-auto no-scrollbar"
  >
    <AccountNavigationTab
      v-for="route in routes"
      :key="route.route"
      :to="{
        name: route.route,
      }"
      :active="isActive(route.route)"
    >
      {{ route.title }}
    </AccountNavigationTab>
  </div>
</template>
