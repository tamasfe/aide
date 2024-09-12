<script setup lang="ts">
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
      :placeholder="$t('field.email')"
      autocomplete="email"
      inputmode="email"
    />

    <BaseInputGroup
      :placeholder="$t('field.password')"
      type="password"
      autocomplete="current-password"
    />

    <div class="mb-4 flex justify-end">
      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-sm text-subtle hover:text-subtle-light"
      >
        {{ $t("modal_session.forgot_password") }}
      </BaseButton>
    </div>

    <BaseButton
      :loading="loading"
      size="xl"
      class="w-full"
    >
      {{ $t("button.login") }}
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.dont_have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ $t("modal_session.create_free_account") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
