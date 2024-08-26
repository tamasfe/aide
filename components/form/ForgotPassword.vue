<script setup lang="ts">
const { t } = useI18n();

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const error = ref();
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
      :label="t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseButtonNew
      :loading="loading"
      :disabled="loading"
      size="xl"
      class="w-full space-x-1.5"
    >
      {{ t("button.send_recovery_email") }}
    </BaseButtonNew>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ t("modal_auth.have_account") }}

      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ t("button.login") }}
      </BaseButtonNew>
    </div>
  </BaseForm>
</template>
