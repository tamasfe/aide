<script setup lang="ts">
const { t } = useI18n();

const error = ref("There was a problem");
const loading = ref(false);
</script>

<template>
  <form>
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <BaseInputGroup
      type="email"
      :label="t('field.email')"
      autocomplete="email"
    />

    <BaseInputGroup
      type="password"
      :label="t('field.password')"
      autocomplete="current-password"
    />

    <BaseButtonNew
      variant="ghost"
      size="ghost"
      class="font-semibold text-subtle hover:text-subtle-light"
    >
      {{ t("modal_auth.forgot_password") }}
    </BaseButtonNew>

    <BaseButtonNew
      :loading="loading"
      :disabled="loading"
      size="xl"
      class="w-full"
    >
      {{ t("button.login") }}
    </BaseButtonNew>

    <div class="text-sm text-subtle">
      {{ t("modal_auth.dont_have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold hover:underline"
      >
        {{ t("modal_auth.create_free_account") }}
      </BaseButtonNew>
    </div>
  </form>
</template>
