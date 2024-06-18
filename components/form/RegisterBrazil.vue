<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

const { t } = useI18n();

// FormControl example
const validationSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: "This is required" })
      .email({ message: "Must be a valid email" }),
    password: zod
      .string()
      .min(1, { message: "This is required" })
      .min(8, { message: "Too short" }),
    cpf: zod.string().min(1, { message: "This is required" }),
    number: zod
      .number({ message: "Please enter valid number." })
      .min(1, { message: "This is required" }),
    region: zod.string().min(1, { message: "This is required" }),
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
    class="flex flex-col items-center gap-5 w-full"
    @submit="onSubmit"
  >
    <FormControl
      v-model="email"
      type="email"
      title="Email"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.email"
    />
    <FormControl
      v-model="password"
      type="password"
      title="Password"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.password"
    />
    <FormControl
      v-model="cpf"
      type="text"
      title="CPF"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.cpf"
    />
    <FormControl
      v-model="number"
      v-model:region="region"
      type="tel"
      title="Telephone"
      class="w-full"
      wrapper-class="bg-subtle"
      input-class="text-default"
      :error="errors.number || errors.region"
    />
    <p class="text-sm text-emphasis py-6">
      By signing up you agree to our
      <button
        type="button"
        class="font-semibold"
      >
        Terms & Conditions
      </button>
    </p>
    <BaseButton
      class="w-full inline-flex justify-center"
      variant="primary"
      type="submit"
      big
    >
      Create Account
    </BaseButton>
    <p class="text-emphasis py-6">
      Have an account already?
      <button
        type="button"
        class="font-semibold text-brand-yellow"
      >
        Sign in
      </button>
    </p>
  </form>
</template>
