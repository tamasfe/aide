<script setup lang="ts">
import * as zod from "zod";

const { t } = useI18n();

const emit = defineEmits(["request:register", "success"]);

// FormControl example
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: t("validation.field_required") })
      .email({ message: t("validation.enter_valid_email") }),
    password: zod.string().min(1, { message: t("validation.field_required") }),
  }),
);
const { handleSubmit, errors, isSubmitting, meta } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");

// error returned from the server
const error = ref("");

const { login } = useAuth();

const onSubmit = handleSubmit(async (values) => {
  const { email, password } = values;
  const success = await login({ username: email, password });
  if (!success) {
    error.value = t("api_client.invalid_credentials");
    return;
  }
  emit("success");
});
</script>

<template>
  <form
    class="flex flex-col items-center space-y-2 w-full"
    @submit="onSubmit"
  >
    <div
      v-if="error"
      class="bg-button-danger p-5 rounded-default w-full mb-4"
    >
      <p>{{ error }}</p>
    </div>
    <FormControl
      v-model="email"
      type="email"
      :title="t('field.email')"
      class="w-full"
      wrapper-class="bg-subtle sm:py-[0.4rem]"
      input-class="text-default"
      :error="errors.email"
      autocomplete="email"
    />
    <FormControl
      v-model="password"
      type="password"
      :title="t('field.password')"
      class="w-full"
      wrapper-class="bg-subtle sm:py-[0.4rem]"
      input-class="text-default"
      :error="errors.password"
      autocomplete="new-password"
    />
    <div class="py-4">
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold text-subtle hover:text-subtle-light"
      >
        {{ t("modal_auth.forgot_password") }}
      </BaseButtonNew>
    </div>
    <BaseButtonNew
      :loading="isSubmitting"
      :disabled="!meta.valid"
      size="xl"
      class="w-full"
      type="submit"
    >
      {{ t("button.login") }}
    </BaseButtonNew>

    <p class="text-sm text-subtle py-4">
      {{ t("modal_auth.dont_have_account") }}
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold text-brand-yellow hover:underline"
        @click="emit('request:register')"
      >
        {{ t("modal_auth.create_free_account") }}
      </BaseButtonNew>
    </p>
  </form>
</template>
