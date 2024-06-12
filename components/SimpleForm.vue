<script setup lang="ts">
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

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
    country: zod.string().min(1, { message: "This is required" }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: country } = useField("country");

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>
<template>
  <form
    class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
    @submit="onSubmit"
  >
    <FormControl
      type="select"
      v-model="country"
      wrapper-class="bg-emphasis"
      input-class="placeholder:text-subtle"
      placeholder="Enter your name"
      hint="Please select your country"
      :error="errors.country"
      :options="[
        {
          title: 'USA',
          value: 'usa',
        },
        {
          title: 'Canada',
          value: 'canada',
        },
        {
          title: 'Germany',
          value: 'germany',
        },
      ]"
    >
      <template #prefix>
        <IconsRS />
      </template>
    </FormControl>
    <FormControl
      type="email"
      v-model="email"
      title="Email"
      wrapper-class="bg-emphasis"
      input-class="text-default text-xl font-bold"
      placeholder="Deposit"
      :error="errors.email"
      hint="Please enter your email"
      blur-screen
      scroll-into-view
    >
      <template #prefix>
        <IconsRS />
      </template>
    </FormControl>
    <FormControl
      type="password"
      v-model="password"
      title="Password"
      wrapper-class="bg-emphasis"
      input-class="text-default text-xl font-bold"
      placeholder="Deposit"
      :error="errors.password"
      hint="Please enter your password"
      blur-screen
      scroll-into-view
    >
      <template #prefix>
        <IconsRS />
      </template>
    </FormControl>
    <BaseButton
      class="col-span-full flex justify-center"
      variant="primary"
      type="submit"
      big
    >
      REGISTER
    </BaseButton>
  </form>
</template
