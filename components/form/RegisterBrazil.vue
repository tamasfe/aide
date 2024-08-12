<script setup lang="ts">
import type { MaskInputOptions } from "maska";
import * as zod from "zod";
import type { RegisterCredentialsBrazil } from "~/types/auth";
import { isValidPhoneNumber } from "~/utils";

const { t } = useI18n();

const emit = defineEmits(["request:login", "success"]);

// FormControl example
const validationSchema = toTypedSchema(
  zod
    .object({
      email: zod
        .string()
        .min(1, { message: t("field_required") })
        .email({ message: t("enter_valid_email") }),
      password: zod
        .string()
        .min(1, { message: t("field_required") })
        .min(8, { message: t("field_too_short") }),
      cpf: zod.string().min(1, { message: t("field_required") }),
      phone: zod.string().min(1, { message: t("field_required") }),
      region: zod.string().min(1, { message: t("field_required") }),
    })
    .superRefine((data, ctx) => {
      const locale = data.region.split("+")[0];
      const _isValidPhoneNumber = isValidPhoneNumber(data.phone, locale);
      if (!_isValidPhoneNumber) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("enter_valid_phone"),
          path: ["phone"],
        });
      }

      const isValidCpf = validateCpf(data.cpf);
      if (!isValidCpf) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("enter_valid_cpf"),
          path: ["cpf"],
        });
      }
    }),
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: cpf } = useField<string>("cpf");
const { value: phone } = useField("phone");
const { value: region } = useField(
  "region",
  {},
  {
    initialValue: "BR+55",
  },
);

const maskOptions: MaskInputOptions = {
  mask: "###.###.###-##",
  eager: true,
};

const { register, getFlow } = useAuth();

const onSubmit = handleSubmit(async (values) => {
  // alert("Successfully registered!");
  const code = values.region.split("+")[1];
  const credentials: RegisterCredentialsBrazil = {
    email: values.email,
    password: values.password,
    CPF: values.cpf,
    phone: `+${code}${values.phone}`,
    phone_calling_code: values.region,
    national_phone_number: values.phone,
  };
  const { message, error } = await register(credentials);
  // alert(JSON.stringify(credentials, null, 4));
  if (error) {
    alert(`Error registering: ${message}`);
    return;
  }
  // emit("success");
});

const { query } = useRoute();

const prefillForm = async () => {
  console.log("fill", query);
  if (query.register !== "true" || !query.flow) {
    return;
  }
  if (typeof query.flow !== "string") {
    return;
  }
  const data = await getFlow(query.flow);
  console.log("data", data);
  if (!data) {
    return;
  }
  const values = data.fields;
  console.log("values", values);
  email.value = values.email;
  password.value = values.password;
  cpf.value = values.CPF;
  phone.value = values.national_phone_number;
  region.value = values.phone_calling_code;
};

onMounted(() => {
  console.log("mounted");
  prefillForm();
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
    <FormControl
      v-model="cpf"
      type="text"
      :title="t('cpf')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      inputmode="numeric"
      :error="errors.cpf"
      :maska="maskOptions"
    />
    <FormControl
      v-model="phone"
      v-model:region="region"
      type="tel"
      :title="t('telephone')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.phone || errors.region"
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
      class="w-full inline-flex justify-center text-lg !rounded-[0.3rem] !py-4 sm:!py-3"
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
