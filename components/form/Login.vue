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
      .min(1, { message: t("field_required") })
      .email({ message: t("enter_valid_email") }),
    password: zod.string().min(1, { message: t("field_required") }),
  }),
);
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");

const { login, getUser } = useAuth();

const onSubmit = handleSubmit(async (values) => {
  console.log("submitting...");
  const { email, password } = values;
  const { error } = await login({ username: email, password });
  const user = await getUser();
  console.log("user", user);
  if (error.value) {
    console.error(error.value);
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
    <FormControl
      v-model="email"
      type="email"
      :title="t('email')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.email"
      autocomplete="email"
    />
    <FormControl
      v-model="password"
      type="password"
      :title="t('Password')"
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
      {{ t("forgot_your_password") }}
    </button>
    <BaseButton
      class="w-full inline-flex justify-center text-lg !rounded-[0.3rem] !py-4 sm:!py-3"
      :class="isSubmitting ? 'opacity-50' : 'opacity-100'"
      variant="primary"
      type="submit"
      big
      :disabled="isSubmitting"
    >
      <div class="flex items-center gap-x-2">
        <p>{{ t("enter") }}</p>
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
    <p class="text-subtle py-4">
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
