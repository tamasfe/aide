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
      cpf: zod.string().min(1, { message: t("field_required") }),
      phone: zod.string().min(1, { message: t("field_required") }),
      region: zod.string().min(1, { message: t("field_required") }),
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

const { handleSubmit, errors, isSubmitting } = useForm({
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
      :title="t('auth.email')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.email"
      autocomplete="email"
    />
    <FormControl
      v-model="password"
      type="password"
      :title="t('auth.password')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.password"
      autocomplete="new-password"
    />
    <FormControl
      v-model="cpf"
      type="text"
      :title="t('auth.cpf')"
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
      :title="t('auth.telephone')"
      class="w-full"
      wrapper-class="bg-subtle py-3"
      input-class="text-default"
      :error="errors.phone || errors.region"
    />
    <p class="text-sm text-subtle py-4">
      {{ t("auth.accept_terms") }}
      <button
        type="button"
        class="font-semibold"
      >
        {{ t("auth.terms") }}
      </button>
    </p>
    <BaseButton
      class="w-full inline-flex justify-center text-lg !rounded-[0.3rem] !py-4 sm:!py-3"
      :class="isSubmitting ? 'opacity-50' : 'opacity-100'"
      variant="primary"
      type="submit"
      big
      :disabled="isSubmitting"
    >
      <div class="flex items-center gap-x-2">
        <p>{{ t("auth.create_account") }}</p>
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
      {{ t("auth.have_account") }}
      <button
        type="button"
        class="font-semibold text-brand-yellow"
        @click="emit('request:login')"
      >
        {{ t("auth.sign_in") }}
      </button>
    </p>
  </form>
</template>
