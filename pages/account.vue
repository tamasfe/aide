<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});
</script>

<template>
  <NuxtLayout name="account">
    <NuxtPage />
  </NuxtLayout>
</template>
