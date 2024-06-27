<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useForm } from "vee-validate";
import * as zod from "zod";

const { t } = useI18n();

const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: t("field_required") })
      .email({ message: t("enter_valid_email") }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form
    class="flex flex-col gap-4 w-full"
    @submit="onSubmit"
  >
    <h2 class="text-2xl font-semibold">Forgot password?</h2>
    <p class="text-lg text-emphasis">
      Fill in your e-mail address and we will send you instructions on how to
      reset your password via e-mail.
    </p>
    <div class="bg-success text-success p-4 rounded-default">
      Password reset instructions have been sent to your email address.
    </div>
    <FormControl
      v-model="email"
      class="w-full"
      type="email"
      wrapper-class="bg-subtle text-lg"
      input-class="font-semibold"
      :title="t('email')"
      :error="errors.email"
      autocomplete="email"
    />
    <BaseButton
      variant="primary"
      big
      shadow
      class="w-full inline-flex justify-center text-base sm:text-lg"
    >
      {{ t("send_recovery_email") }}
    </BaseButton>
  </form>
</template>
