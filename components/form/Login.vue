<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
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
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.email"
      autocomplete="email"
    />
    <FormControl
      v-model="password"
      type="password"
      :title="t('field.password')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.password"
      autocomplete="new-password"
    />
    <button
      type="button"
      class="font-semibold text-subtle py-4"
    >
      {{ t("auth.forgot_password") }}
    </button>
    <BaseButton
      class="w-full inline-flex justify-center text-lg !rounded-[0.262rem] !py-4 sm:!py-3"
      :class="isSubmitting ? 'opacity-50' : 'opacity-100'"
      variant="primary"
      type="submit"
      big
      :disabled="isSubmitting || !meta.valid"
    >
      <div class="flex items-center gap-x-2">
        <p>{{ t("button.login") }}</p>
        <div
          v-if="isSubmitting"
          class="w-full h-full flex items-center justify-center"
        >
          <PhCircleNotch
            :size="20"
            class="animate-spin"
          />
        </div>
      </div>
    </BaseButton>
    <p class="text-sm text-subtle py-4">
      {{ t("auth.dont_have_account") }}
      <button
        type="button"
        class="font-semibold text-brand-yellow"
        @click="emit('request:register')"
      >
        {{ t("auth.create_free_account") }}
      </button>
    </p>
  </form>
</template>
