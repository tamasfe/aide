<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { UserPassword } from "~/modules/users/domain/UserPassword";

const { t } = useI18n();
const logger = useLogger();
const user = useUserModule();
const nuxtApp = useNuxtApp();

const validationSchema = toTypedSchema(
  z.object({
    currentPassword: z.string({ required_error: t("validation.password_required") })
      .max(UserPassword.MAX_PASSWORD_LENGTH, t("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) })),
    newPassword: z.string({ required_error: t("validation.password_required") })
      .min(UserPassword.MIN_PASSWORD_LENGTH, t("validation.password_invalid_too_short", { min: String(UserPassword.MIN_PASSWORD_LENGTH) }))
      .max(UserPassword.MAX_PASSWORD_LENGTH, t("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) })),
    confirmNewPassword: z.string({ required_error: t("validation.password_required") }),
  }).refine(data => data.newPassword === data.confirmNewPassword, {
    message: t("validation.password_does_not_match"),
    path: ["confirmNewPassword"], // path of error
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });

const formErrorMessage = ref("");
const [currentPassword, currentPasswordAttrs] = defineField("currentPassword");
const [newPassword, newPasswordAttrs] = defineField("newPassword");
const [confirmNewPassword, confirmNewPasswordAttrs] = defineField("confirmNewPassword");

const onSubmit = handleSubmit(async (formData) => {
  formErrorMessage.value = await user.ui.userSettings.updateSettingsOnForm.handle({
    password: {
      current: formData.currentPassword,
      new: formData.newPassword,
    },
  });
}, ({ results }) => {
  logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm v-slot="{ loading }" class="space-y-2" @submit="onSubmit">
    <BaseAlert
      v-if="formErrorMessage"
      :message="formErrorMessage"
      level="error"
    />

    <BaseInputGroup
      :placeholder="$t('field.password_current')"
      type="password"
      autocomplete="current-password"
      name="currentPassword"
      :error-message="formErrors.currentPassword"
      v-bind="currentPasswordAttrs"
      @input="(value) => currentPassword ? (currentPassword = value) : null"
      @change="(value) => currentPassword ? null : currentPassword = value"
    />

    <BaseInputGroup
      :placeholder="$t('field.password_new')"
      type="password"
      autocomplete="new-password"
      name="newPassword"
      :error-message="formErrors.newPassword"
      v-bind="newPasswordAttrs"
      @input="(value) => newPassword ? (newPassword = value) : null"
      @change="(value) => newPassword ? null : newPassword = value"
    />

    <BaseInputGroup
      :placeholder="$t('field.password_confirm')"
      type="password"
      name="confirmNewPassword"
      :error-message="formErrors.confirmNewPassword"
      v-bind="confirmNewPasswordAttrs"
      @input="(value) => confirmNewPassword = value"
    />

    <!-- <div>
      <p>{{ $t("modal_account_settings.password.instructions") }}</p>
    </div> -->

    <div
      class="flex items-center justify-between space-x-4"
    >
      <BaseButton
        size="xl"
        variant="subtle"
        class="w-full space-x-1.5"
        type="button"
        @click="nuxtApp.callHook('frontend:command:modal:close')"
      >
        {{ $t("button.cancel") }}
      </BaseButton>

      <BaseButton
        :loading="loading"
        size="xl"
        class="w-full space-x-1.5"
        :disabled="!meta.valid"
        type="submit"
      >
        {{ $t("button.save") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
