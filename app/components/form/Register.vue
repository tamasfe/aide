<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { UpsertSignupFlowOnCpfValueChanged } from "~/modules/signup-flows/infra/ui/UpsertSignupFlowOnCpfValueChanged";
import { createSignupFlowsDependencyInjection } from "~/modules/signup-flows/infra/SignupFlowsDependencyInjection";
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * currently shows CPF for all jurisdictions and it needs to be BR only
//   * the dropdown for the +1 prefix isnt done
//   * dynamic mask for phone based on loaded jurisdiction: NOTE: this must also handle multiple masks I believe. so mask or mask[]
// TRANSLATION STATUS:  ✅
// AUTOCOMPLETES:       ✅
// INPUTMODES:          ✅
// ZOD SCHEMA:          ✴️

/**
 * Depedency injection
 */
const signupFlowsDependencies = createSignupFlowsDependencyInjection();
const { t: translate } = useI18n();

const validateCpfByUpdatingSignupFlow = async (value: unknown) => {
  const cpfValue = String(value);

  console.log("cpfValue inside validate", cpfValue);

  if (!cpfValue) {
    return "CPF is required";
  }

  const resultUpserting = await new UpsertSignupFlowOnCpfValueChanged(
    signupFlowsDependencies,
    translate,
  ).handle(cpfValue);

  // console.log("resultUpserting:", resultUpserting);

  if (resultUpserting.isFailure) {
    // Here we can even return a translated message
    return resultUpserting.error.message;
  }

  return true;
};

/**
 * Client side direct validation
 */
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
    cpf: zod.string().refine(validateCpfByUpdatingSignupFlow),
    telephone: zod
      .string()
      .min(1, { message: "This is required" })
      .length(14, { message: "Must be a valid telephone" }),
  }),
);

const { handleSubmit, errors, values } = useForm({
  validationSchema,
});
// const { value: email } = useField("email");
// const { value: password } = useField("password");
// const {
//   value: cpfValue,
//   errorMessage: cpfErrorMessage,
//   handleChange: handleCpfChange,
// } = useField("cpf", (value) => validateCpfByUpdatingSignupFlow(value));
// const { value: telephone } = useField("telephone");

const onSubmit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});

const error = ref();
const loading = ref(false);
</script>

<template>
  <BaseForm :on-submit="onSubmit">
    <BaseAlert
      v-if="error"
      :message="error"
      level="error"
    />

    <BaseInputGroup
      :placeholder="$t('field.email')"
      autocomplete="email"
      inputmode="email"
      :error-message="errors.email"
      @input="(value) => (email = value)"
    />

    <BaseInputGroup
      :placeholder="$t('field.password')"
      type="password"
      autocomplete="new-password"
    />

    <BaseInputGroup
      :placeholder="$t('field.cpf')"
      mask="###.###.###-##"
      inputmode="numeric"
      :error-message="errors.cpf"
      @input="
        (value) => {
          console.log('from base input group:', value);
          values.cpf = value;
        }
      "
    />

    <BaseInputGroup
      :placeholder="$t('field.telephone')"
      mask="123"
      inputmode="numeric"
    />

    <div class="my-2 text-sm text-center text-subtle">
      {{ $t("modal_session.accept_terms") }}
      <NuxtLink
        to="/terms"
        target="_blank"
        class="font-semibold hover:text-subtle-light"
      >
        {{ $t("page.terms") }}
      </NuxtLink>
    </div>

    <BaseButton
      :loading="loading"
      size="xl"
      class="w-full gap-1.5"
    >
      <span>{{ $t("button.create_account") }}</span>
      <Icon
        name="lucide:arrow-right"
        size="20"
      />
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
      >
        {{ $t("button.login") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
