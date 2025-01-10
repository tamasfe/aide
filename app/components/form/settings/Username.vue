<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✅
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const USERNAME_LENGTH_MIN = 4;
const USERNAME_LENGTH_MAX = 64;

const props = defineProps<{
  initial: string;
}>();

const { $dependencies } = useNuxtApp();
const { t } = useI18n();

const validationSchema = toTypedSchema(
  z.object({
    username: z.string({ required_error: t("validation.username_required") })
      .min(USERNAME_LENGTH_MIN, t("validation.username_too_short", { min: String(USERNAME_LENGTH_MIN) }))
      .max(USERNAME_LENGTH_MAX, t("validation.username_too_long", { max: String(USERNAME_LENGTH_MAX) })),
  }),
);
const { handleSubmit, errors: formErrors, defineField, meta } = useForm({ validationSchema });

const formErrorMessage = ref("");
const [username, usernameAttrs] = defineField("username");
username.value = props.initial;

const onSubmit = handleSubmit(async (formData) => {
  formErrorMessage.value = await $dependencies.users.ui.userSettings.updateUsernameOnForm.handle(formData.username);
}, ({ results }) => {
  $dependencies.common.logger.warn("Validation failed", { validationResults: results });
});
</script>

<template>
  <BaseForm v-slot="{ loading }" class="space-y-4" @submit="onSubmit">
    <div class="leading-snug">
      <h2 class="text-xl font-semibold">{{ $t('modal_user_settings.username.title') }}</h2>
    </div>

    <BaseAlert
      v-if="formErrorMessage"
      :message="formErrorMessage"
      level="error"
    />

    <BaseInputGroup
      v-bind="usernameAttrs"
      v-model="username"
      :placeholder="$t('field.username')"
      type="text"
      name="username"
      :error-message="formErrors.username"
    />

    <!-- <div>
      <p>{{ $t("modal_user_settings.password.instructions") }}</p>
    </div> -->

    <div
      class="flex items-center justify-between space-x-4"
    >
      <BaseButton
        size="xl"
        variant="subtle"
        class="w-full space-x-1.5"
        type="button"
        @click="$dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
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
