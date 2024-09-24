<script setup lang="ts">
import { useField } from "vee-validate";
import { ValidateEmailUpsertingSignupFlowOnEmailValueChanged } from "~/modules/signup-flows/infra/ui/ValidateEmailUpsertingSignupFlowOnEmailValueChanged";

/**
 * Depedency injection
 */
const { $dependencies } = useNuxtApp();
const { t: translate } = useI18n();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: email, errorMessage: emailErrorMessage } = useField("email", value =>
  new ValidateEmailUpsertingSignupFlowOnEmailValueChanged(
    $dependencies.signupFlows,
    translate,
  ).handle(value),
);
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('field.email')"
    autocomplete="email"
    inputmode="email"
    name="email"
    :error-message="emailErrorMessage"
    @input="(value) => email ? (email = value) : null"
    @change="(value) => email ? null : email = value"
  />
</template>
