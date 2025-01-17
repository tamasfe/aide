<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

/**
 * Dependencies
 */
const { $dependencies } = useNuxtApp();
const { t } = useI18n();
const localePath = useLocalePath();

/**
 * Login Form
 */
const REASON_MAX_CHARS = 255;
const validationSchema = toTypedSchema(
  z.object({
    reason: z.string({ required_error: t("validation.reason_required") })
      .max(REASON_MAX_CHARS, t("validation.reason_too_long"))
      .optional(),
    password: z.string({ required_error: t("validation.password_required") }),
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });
const formErrorMessage = ref("");
const [reason, reasonAttrs] = defineField("reason");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (formData) => {
  formErrorMessage.value = await $dependencies.users.ui.closeAccountOnForm.handle(formData.reason, formData.password);

  if (!formErrorMessage.value) {
    await navigateTo(localePath("/"));
  }
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
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
      v-bind="reasonAttrs"
      v-model="reason"
      field-type="textarea"
      :placeholder="$t('field.reason')"
      name="reason"
      :required="false"
      class="py-4 h-36"
      placeholder-placement="default"
      :error-message="formErrors.reason"
    />

    <BaseInputGroup
      v-bind="passwordAttrs"
      v-model="password"
      :required="true"
      :placeholder="$t('field.password_current')"
      type="password"
      autocomplete="current-password"
      name="password"
      :error-message="formErrors.password"
    />

    <BaseButton
      class="w-full"
      :loading="loading"
      :disabled="!meta.valid"
      size="xl"
      type="submit"
      variant="danger"
    >
      {{ $t("button.close_account") }}
    </BaseButton>

    <BaseButton
      class="w-full"
      size="xl"
      type="button"
      variant="subtle"
      @click="() => $dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
    >
      {{ $t("button.cancel") }}
    </BaseButton>
  </BaseForm>
</template>
