<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <form>
    <h1 class="text-2xl font-bold text-center">
      {{ t("modal_cancel_registration.headline") }}
    </h1>

    <p class="text-emphasis text-lg text-center">
      {{ t("modal_cancel_registration.body") }}
    </p>

    <BaseButtonNew
      size="xl"
      class="w-full"
      type="submit"
    >
      {{ t("button.continue") }}
    </BaseButtonNew>

    <BaseButtonNew
      variant="ghost"
      size="ghost"
      class="mt-6 font-semibold text-subtle hover:text-subtle-light"
    >
      {{ t("modal_cancel_registration.cancel") }}
    </BaseButtonNew>
  </form>
</template>
