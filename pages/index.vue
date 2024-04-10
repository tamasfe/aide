<template>
  <div class="min-h-screen">{{ $t("welcome") }}</div>
</template>

<script setup>
const { locale } = useI18n();
</script>
