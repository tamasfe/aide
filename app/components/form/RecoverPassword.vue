<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { UserPassword } from "~/modules/users/domain/UserPassword";

/**
 * Dependencies
 */
const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const props = defineProps<{
  token: string | null;
}>();

const formErrorMessage = ref("");
if (!props.token) {
  formErrorMessage.value = t("recover_password.error_invalid_token");
}

const validationSchema = toTypedSchema(
  z.object({
    password: z.string({ required_error: t("validation.password_required") })
      .min(UserPassword.MIN_PASSWORD_LENGTH, t("validation.password_invalid_too_short", { min: String(UserPassword.MIN_PASSWORD_LENGTH) }))
      .max(UserPassword.MAX_PASSWORD_LENGTH, t("validation.password_invalid_too_long", { max: String(UserPassword.MAX_PASSWORD_LENGTH) })),
    confirm: z.string({ required_error: t("validation.password_required") }),
  }).refine(data => data.password === data.confirm, {
    message: t("validation.password_does_not_match"),
    path: ["confirm"], // path of error
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });

const loadingForm = ref(false);
const [password, passwordAttrs] = defineField("password");
const [confirm, confirmAttrs] = defineField("confirm");

const onSubmit = handleSubmit(async (formData) => {
  loadingForm.value = true;
  formErrorMessage.value = "";

  const errorSubmitting = await $dependencies.users.ui.recoverPassword.handle(
    formData.password, props.token,
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
      :placeholder="$t('field.password')"
      type="password"
      name="password"
      :error-message="formErrors.password"
      v-bind="passwordAttrs"
      @input="(value) => password ? (password = value) : null"
      @change="(value) => password ? null : password = value"
    />

    <BaseInputGroup
      :placeholder="$t('field.password_confirm')"
      type="password"
      name="confirm"
      :error-message="formErrors.confirm"
      v-bind="confirmAttrs"
      @input="(value) => confirm = value"
    />

    <BaseButton
      :loading="loadingForm"
      size="xl"
      class="w-full"
      type="submit"
      :disabled="!meta.valid"
    >
      {{ $t("button.save_password_and_login") }}
    </BaseButton>
  </BaseForm>
</template>
