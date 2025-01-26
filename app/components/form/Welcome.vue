<script setup lang="ts">
const { $dependencies } = useNuxtApp();
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-y-3 text-center">
    <h1 class="text-2xl md:text-3xl font-semibold text-white">{{ $t("welcome_form.title") }}</h1>

    <BaseButton
      variant="primary"
      @click="() => $dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
    >
      {{ $t("button.register_now") }}
    </BaseButton>

    <p class="text-subtle">{{ $t("welcome_form.description") }}</p>
  </div>
</template>

<style scoped>
/*
Here implement the animation from the main primary bottom from https://roobet.com/
*/
</style>
