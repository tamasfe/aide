<script setup lang="ts">
import * as zod from "zod";

const { t } = useI18n();

const emit = defineEmits(["request:login"]);

// FormControl example
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: t("field_required") })
      .email({ message: t("enter_valid_email") }),
    password: zod
      .string()
      .min(1, { message: t("field_required") })
      .min(8, { message: t("field_too_short") }),
    cpf: zod.string().min(1, { message: t("field_required") }),
    number: zod
      .number({ message: t("enter_valid_number") })
      .min(1, { message: t("field_required") }),
    region: zod.string().min(1, { message: t("field_required") }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: cpf } = useField("cpf");
const { value: number } = useField("number");
const { value: region } = useField(
  "region",
  {},
  {
    initialValue: "BR+55",
  },
);

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
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
    <FormControl
      v-model="cpf"
      type="text"
      :title="t('cpf')"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.cpf"
    />
    <FormControl
      v-model="number"
      v-model:region="region"
      type="tel"
      :title="t('telephone')"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.number || errors.region"
    />
    <p class="text-sm text-subtle py-4">
      {{ t("accept_terms") }}
      <button
        type="button"
        class="font-semibold"
      >
        {{ t("terms") }}
      </button>
    </p>
    <BaseButton
      class="w-full inline-flex justify-center text-lg [border-radius:0.3rem]"
      variant="primary"
      type="submit"
      big
    >
      {{ t("create_account") }}
    </BaseButton>
    <p class="text-subtle py-4">
      {{ t("have_account") }}
      <button
        type="button"
        class="font-semibold text-brand-yellow"
        @click="emit('request:login')"
      >
        {{ t("sign_in") }}
      </button>
    </p>
  </form>
</template>
