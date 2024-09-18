<script setup lang="ts">
import { useField } from "vee-validate";
import { ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged } from "~/modules/signup-flows/infra/ui/ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged";

/**
 * Depedency injection
 */
const { $dependencies } = useNuxtApp();
const { t: translate } = useI18n();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: telehpone, errorMessage: telehponeErrorMessage } = useField("telephone", value =>
  new ValidateTelephoneUpsertingSignupFlowOnTelephoneValueChanged(
    $dependencies.signupFlows,
    translate,
  ).handle(value),
);
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('field.telephone')"
    inputmode="numeric"
    name="telephone"
    :error-message="telehponeErrorMessage"
    @input="(value) => (telehpone = value)"
  />
</template>
