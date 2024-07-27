<script setup lang="ts">
import {
  isPossiblePhoneNumber,
  isValidNumberForRegion,
  validatePhoneNumberLength,
  type CountryCode,
} from "libphonenumber-js";
import * as zod from "zod";

const { t } = useI18n();

const emit = defineEmits(["request:login"]);

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
      number: zod.string().min(1, { message: t("field_required") }),
      region: zod.string().min(1, { message: t("field_required") }),
    })
    .superRefine((data, ctx) => {
      const locale = data.region.split("+")[0] as CountryCode;
      const isPossible = isPossiblePhoneNumber(data.number, locale);
      if (!isPossible) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("enter_valid_phone"),
          path: ["number"],
        });
      }
      const isValid = isValidNumberForRegion(data.number, locale);
      if (!isValid) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("enter_valid_phone"),
          path: ["number"],
        });
      }
      const isValidLength = validatePhoneNumberLength(data.number, locale);
      if (isValidLength !== undefined) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("enter_valid_phone"),
          path: ["number"],
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
const { value: number } = useField("number");
const { value: region } = useField(
  "region",
  {},
  {
    initialValue: "BR+55",
  },
);

const formattedCpf = computed({
  get: () => {
    if (!cpf.value) {
      return "";
    }
    return formatCPF(cpf.value);
  },
  set: (value) => {
    cpf.value = value;
  },
});

const checkCpf = (evt: KeyboardEvent) => {
  const value = cpf.value;
  // if holding ctrl or alt or cmd key
  // do not prevent default
  if (evt.ctrlKey || evt.altKey || evt.metaKey) {
    return;
  }
  if (evt.code === "Backspace" || evt.code === "Tab" || evt.code === "Delete") {
    return;
  }
  if (value && value.length >= 14) {
    evt.preventDefault();
    return;
  }
  if (isNaN(parseInt(evt.key, 10))) {
    evt.preventDefault();
  }
};

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form class="flex flex-col items-center space-y-2 w-full" @submit="onSubmit">
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
      v-model="formattedCpf"
      type="text"
      :title="t('cpf')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.cpf"
      @keydown="checkCpf"
    />
    <FormControl
      v-model="number"
      v-model:region="region"
      type="tel"
      :title="t('telephone')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.number || errors.region"
    />
    <p class="text-sm text-subtle py-4">
      {{ t("accept_terms") }}
      <button type="button" class="font-semibold">
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
