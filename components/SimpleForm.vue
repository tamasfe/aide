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
    number: zod
      .number({ message: "Please enter valid number " })
      .min(1, { message: "This is required" }),
    region: zod.string().min(1, { message: "This is required" }),
  }),
);
const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: country } = useField("country");
const { value: number } = useField("number");
const { value: region } = useField(
  "region",
  {},
  {
    initialValue: "US+1",
  },
);

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
      v-model="country"
      type="select"
      wrapper-class="bg-emphasis"
      input-class="placeholder:text-subtle text-default "
      title="Country"
      placeholder="Select your country"
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
    />
    <FormControl
      v-model="email"
      type="email"
      title="Email"
      wrapper-class="bg-emphasis"
      input-class="text-default "
      placeholder="Deposit"
      :error="errors.email"
      hint="Please enter your email"
    />
    <FormControl
      v-model="password"
      type="password"
      wrapper-class="bg-emphasis"
      input-class="text-default "
      placeholder="Password"
      blur-screen
      scroll-into-view
      :error="errors.password"
      hint="Please enter your password"
    />
    <FormControl
      v-model="number"
      v-model:region="region"
      type="tel"
      title="Number"
      wrapper-class="bg-emphasis"
      input-class="text-default "
      placeholder="Number"
      :error="errors.number || errors.region"
      hint="Please enter your number"
    />
    <BaseButton
      class="col-span-full flex justify-center"
      variant="primary"
      type="submit"
      big
    >
      REGISTER
    </BaseButton>
  </form>
</template>
