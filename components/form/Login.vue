<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const { t } = useI18n();

const emit = defineEmits(["request:register"]);

// FormControl example
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: t("field_required") })
      .email({ message: t("enter_valid_email") }),
    password: zod.string().min(1, { message: t("field_required") }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form
    class="flex flex-col items-center gap-4 w-full"
    @submit="onSubmit"
  >
    <FormControl
      v-model="email"
      type="email"
      :title="t('email')"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.email"
      autocomplete="email"
    />
    <FormControl
      v-model="password"
      type="password"
      :title="t('Password')"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.password"
      autocomplete="new-password"
    />
    <button
      type="button"
      class="font-semibold text-subtle sm:py-2"
    >
      {{ t("forgot_your_password") }}
    </button>
    <BaseButton
      class="w-full inline-flex justify-center"
      variant="primary"
      type="submit"
      big
    >
      {{ t("enter") }}
    </BaseButton>
    <p class="text-lg text-subtle py-2">
      {{ t("dont_have_account") }}
      <button
        type="button"
        class="font-semibold text-brand-yellow"
        @click="emit('request:register')"
      >
        {{ t("sign_up") }}
      </button>
    </p>
  </form>
</template>
