<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const error = ref("There was a problem");
const loading = ref(false);
</script>

<template>
  <BaseForm>
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <BaseInputGroup
      :placeholder="t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseInputGroup
      :placeholder="t('field.password')"
      type="password"
      autocomplete="current-password"
    />

    <div class="mb-4 flex justify-end">
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-sm text-subtle hover:text-subtle-light"
      >
        {{ t("modal_auth.forgot_password") }}
      </BaseButtonNew>
    </div>

    <BaseButtonNew
      :loading="loading"
      size="xl"
      class="w-full"
    >
      {{ t("button.login") }}
    </BaseButtonNew>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ t("modal_auth.dont_have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ t("modal_auth.create_free_account") }}
      </BaseButtonNew>
    </div>
  </BaseForm>
</template>
