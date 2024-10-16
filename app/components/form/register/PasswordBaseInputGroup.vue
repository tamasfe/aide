<script setup lang="ts">
import { useField } from "vee-validate";

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: password, errorMessage: passwordErrorMessage } = useField("password", value =>
  $dependencies.signupFlows.ui.validatePasswordUpsertingSignupFlowOnPasswordValueChanged.handle(value),
);
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('field.password')"
    type="password"
    autocomplete="new-password"
    name="password"
    :error-message="passwordErrorMessage"
    @input="(value) => password ? (password = value) : null"
    @change="(value) => password ? null : password = value"
  />
</template>
