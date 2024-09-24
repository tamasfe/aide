<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

const errorMessage = ref();
const loading = ref(false);
</script>

<template>
  <BaseForm>
    <BaseAlert
      v-if="errorMessage"
      :message="errorMessage"
      level="error"
    />

    <BaseInputGroup
      :placeholder="$t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseButton
      :loading="loading"
      size="xl"
      class="mt-4 w-full space-x-1.5"
    >
      {{ $t("button.send_recovery_email") }}
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ $t("button.login") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
