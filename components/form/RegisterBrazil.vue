<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
import type { MaskInputOptions } from "maska";
import * as zod from "zod";
import type { RegisterCredentialsBrazil } from "~/types/auth";
import type { CountryCode } from "~/types/constants";
import { isValidPhoneNumber } from "~/utils";

const { t } = useI18n();

const emit = defineEmits(["request:login", "success"]);
const router = useRouter();

const query = router.currentRoute.value.query;

// FormControl example
const validationSchema = toTypedSchema(
  zod
    .object({
      email: zod
        .string()
        .min(1, { message: t("validation.field_required") })
        .email({ message: t("validation.enter_valid_email") }),
      password: zod
        .string()
        .min(1, { message: t("validation.field_required") })
        .min(8, { message: t("validation.field_too_short") }),
      cpf: zod.string().min(1, { message: t("validation.field_required") }),
      phone: zod.string().min(1, { message: t("validation.field_required") }),
      region: zod.string().min(1, { message: t("validation.field_required") }),
    })
    .superRefine((data, ctx) => {
      const locale = data.region.split("+")[0] as CountryCode;
      const _isValidPhoneNumber = isValidPhoneNumber(data.phone, locale);
      if (!_isValidPhoneNumber) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("validation.enter_valid_phone"),
          path: ["phone"],
        });
      }

      const isValidCpf = validateCpf(data.cpf);
      if (!isValidCpf) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: t("validation.enter_valid_cpf"),
          path: ["cpf"],
        });
      }
    }),
);

const { handleSubmit, errors, isSubmitting, meta } = useForm({
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

const cpfMask: MaskInputOptions = {
  mask: "###.###.###-##",
  eager: true,
};

const { register, getFlow } = useAuth();
const error = ref(""); // error returned from the server
const onSubmit = handleSubmit(async (values) => {
  const code = values.region.split("+")[1];
  const credentials: RegisterCredentialsBrazil = {
    email: values.email,
    password: values.password,
    CPF: values.cpf,
    phone: `+${code}${values.phone}`,
    phone_calling_code: values.region,
    national_phone_number: values.phone,
  };
  const { message, error: registerError, flow } = await register(credentials);

  if (flow) {
    router.replace({
      query: {
        register: "true",
        flow,
      },
    });
  }

  if (registerError) {
    error.value = message;
    return;
  }
  error.value = "";
  emit("success", credentials);
});

const prefillForm = async () => {
  if (query.register !== "true" || !query.flow) {
    return;
  }
  if (typeof query.flow !== "string") {
    return;
  }
  const data = await getFlow(query.flow);
  if (!data) {
    return;
  }
  const values = data.fields;
  email.value = values.email;
  password.value = values.password;
  cpf.value = values.CPF;
  phone.value = values.national_phone_number;
  region.value = values.phone_calling_code;
};

onMounted(() => {
  prefillForm();
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
      <p>{{ t(error) }}</p>
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
    <FormControl
      v-model="cpf"
      type="text"
      :title="t('field.cpf')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      inputmode="numeric"
      :error="errors.cpf"
      :maska="cpfMask"
    />
    <FormControl
      v-model="phone"
      v-model:region="region"
      type="tel"
      :title="t('field.telephone')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.phone || errors.region"
    />
    <p class="text-sm text-subtle py-4">
      {{ t("modal_auth.accept_terms") }}
      <NuxtLink
        to="/terms"
        target="_blank"
        class="font-semibold hover:text-subtle-light"
      >
        {{ t("page.terms") }}
      </NuxtLink>
    </p>

    <BaseButtonNew
      :loading="isSubmitting"
      :disabled="!meta.valid"
      size="xl"
      class="w-full"
      type="submit"
    >
      {{ t("button.create_account") }}
    </BaseButtonNew>

    <p class="text-subtle py-4">
      {{ t("modal_auth.have_account") }}
      <BaseButtonNew
        variant="ghost"
        size="ghost"
        class="font-semibold text-brand-yellow hover:underline"
        @click="emit('request:login')"
      >
        {{ t("button.login") }}
      </BaseButtonNew>
    </p>
  </form>
</template>
