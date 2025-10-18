<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const { t } = useI18n();
const notifications = useNotificationsStore();
const logger = useLogger();
const user = useUserModule();

const validationSchema = toTypedSchema(
  z.object({
    email: z.string({ required_error: t("validation.email_required") })
      .email(t("validation.email_invalid")),
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });

const formErrorMessage = ref("");
const loading = ref(false);
const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (formData) => {
  loading.value = true;
  formErrorMessage.value = "";

  const errorSubmitting = await user.ui.requestRecoverPasswordOnForm.handle(
    formData.email,
  );
  formErrorMessage.value = errorSubmitting || "";
  loading.value = false;

  if (errorSubmitting) {
    return;
  }

  notifications.showToast({
    id: Date.now(),
    title: t("modal_forgot_password.success_notification_title"),
    message: t("modal_forgot_password.success_notification_message"),
    createdAt: new Date(),
    variant: "success",
  });
}, ({ results }) => {
  logger.warn("Validation failed", { validationResults: results });
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
      v-bind="emailAttrs"
      v-model="email"
      :placeholder="$t('field.email')"
      autocomplete="email"
      inputmode="email"
      :error-message="formErrors.email"
    />

    <BaseButton
      :loading="loading"
      size="xl"
      class="mt-4 w-full space-x-1.5"
      :disabled="!meta.valid"
      type="submit"
    >
      {{ $t("button.send_recovery_email") }}
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary md:hover:underline"
        @click="user.ui.emitCommandOpenUserActionModal.handle('login')"
      >
        {{ $t("button.login") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
