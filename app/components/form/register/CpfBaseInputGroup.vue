<script setup lang="ts">
import { useField } from "vee-validate";

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the ValidateCpfUpsertingSignupFlowOnCpfValueChanged
 */
const { value: cpf, errorMessage: cpfErrorMessage } = useField("cpf", value =>
  $dependencies.signupFlows.ui.validateCpfUpsertingSignupFlowOnCpfValueChanged.handle(value),
);
</script>

<template>
  <BaseInputGroup
    name="cpf"
    :placeholder="$t('field.cpf')"
    mask="###.###.###-##"
    inputmode="numeric"
    :error-message="cpfErrorMessage"
    @input="(value) => cpf ? (cpf = value) : null"
    @change="(value) => cpf ? null : cpf = value"
  />
</template>
