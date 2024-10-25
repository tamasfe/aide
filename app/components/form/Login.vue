<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅

import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

/**
 * Dependencies
 */
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

/**
 * Login Form
 */
const validationSchema = toTypedSchema(
  z.object({
    email: z.string({ required_error: t("validation.email_required"), invalid_type_error: t("validation.email_invalid") }).email(),
    password: z.string({ required_error: t("validation.password_required") }),
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const loadingForm = ref(false);
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (formData) => {
  loadingForm.value = true;
  const errorSubmitting = await $dependencies.users.ui.attemptUserLoginOnFormSubmission.handle(
    formData.email, formData.password,
  );
  formErrorMessage.value = errorSubmitting || "";
  loadingForm.value = false;
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm @submit="onSubmit">
    <BaseAlert
      v-if="formErrorMessage"
      :message="formErrorMessage"
      level="error"
    />

    <BaseInputGroup
      :placeholder="$t('field.email')"
      autocomplete="email"
      inputmode="email"
      name="email"
      :error-message="formErrors.email"
      v-bind="emailAttrs"
      @input="(value) => email ? (email = value) : null"
      @change="(value) => email ? null : email = value"
    />

    <BaseInputGroup
      :placeholder="$t('field.password')"
      type="password"
      autocomplete="current-password"
      name="password"
      :error-message="formErrors.password"
      v-bind="passwordAttrs"
      @input="(value) => password = value"
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
      :loading="loadingForm"
      size="xl"
      class="w-full"
      type="submit"
      :disabled="!meta.valid"
    >
      {{ $t("button.login") }}
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.dont_have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
        @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('register')"
      >
        {{ $t("modal_session.create_free_account") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
