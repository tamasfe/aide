<script setup lang="ts">
import { useField } from "vee-validate";
import { ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged } from "~/modules/signup-flows/infra/ui/ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged";

/**
 * Depedency injection
 */
const { $dependencies } = useNuxtApp();
const { t: translate } = useI18n();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: password, errorMessage: telehponeErrorMessage } = useField("password", value =>
  new ValidatePasswordUpsertingSignupFlowOnPasswordValueChanged(
    $dependencies.signupFlows,
    translate,
  ).handle(value),
);
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('field.password')"
    type="password"
    autocomplete="new-password"
    name="password"
    :error-message="telehponeErrorMessage"
    @input="(value) => (password = value)"
  />
</template>
