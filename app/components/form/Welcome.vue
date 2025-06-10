<script setup lang="ts">
const { $dependencies } = useNuxtApp();
const siteStore = useSiteStore();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3 text-center">
    <h1 class="text-2xl md:text-3xl font-semibold text-white">{{ $t("welcome_form.title", { siteName: siteStore.currentSite.name }) }}</h1>

    <BaseButton
      variant="primary"
      class="welcome-button-fade-in"
      @click="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
    >
      {{ $t("button.register_now") }}
    </BaseButton>

    <p class="text-subtle">{{ $t("welcome_form.description") }}</p>
  </div>
</template>

<style scoped>
.welcome-button-fade-in {
  background: linear-gradient(420deg, rgb(255, 206, 0) 0%, rgb(255, 206, 0) 15%, rgb(255, 183, 0) 15%, rgb(255, 183, 0) 100%) left center / 100% 100% no-repeat;
  transition: background-size 0.3s ease-in-out;
  background-size: 250% 100%;
}

.welcome-button-fade-in:hover {
  background-size: 750% 100%;
}
</style>
