<script setup lang="ts">
const { t } = useI18n();

// TODO: we need to show this console warning to users like facebook does.
// we ideally should show it after 1-2 seconds so all the junk requests have time to
// clear first, that way they actually see it. also.. it should go in a better spot
onMounted(() => {
  if (!import.meta.server) {
    setTimeout(() => {
      consoleWarning(t("console_warning.title"), "danger");
      consoleWarning(t("console_warning.description"));
    }, 600);
  }
});
</script>

<template>
  <NuxtPwaManifest />
  <AppHead />
  <NuxtLayout>
    <NuxtPage class="min-h-[calc(100vh-7rem)] sm:min-h-[calc(100vh-3.5rem)] relative" />
  </NuxtLayout>
</template>
