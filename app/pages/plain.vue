<script lang="ts" setup>
// definePageMeta({
//   layout: false,
// });

const site = useSiteStore();
const user = useUserStore();
const wallet = useWalletStore();
</script>

<template>
  <div>
    <pre>{{ site.currentSite }}</pre>
    <pre>{{ user.user }}</pre>
    <pre>{{ wallet.balance }}</pre>
  </div>
</template>
