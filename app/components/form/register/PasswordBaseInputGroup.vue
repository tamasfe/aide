<script setup lang="ts">
import { debouncedWatch } from "@vueuse/core";
import { useField } from "vee-validate";

/**
 * Dependency injection
 */
const signupFlows = useSignupModule();
const emits = defineEmits<{
  (e: "loading", value: boolean): void;
}>();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: password, errorMessage: passwordErrorMessage } = useField("password", value =>
  signupFlows.ui.validatePasswordOnRegisterFormChanged.handle(value),
{ initialValue: "" },
);

// We use debounced for this field as every keystroke might be a valid value (unlike telephone or cpf that are only valid at the last one), thus we need to implement some debounce to reduce server load
debouncedWatch(() => password.value, async (value) => {
  emits("loading", true);
  if (true === await signupFlows.ui.validatePasswordOnRegisterFormChanged.handle(value)) {
    await signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({ password: value });
  }
  emits("loading", false);
}, { debounce: 300 });
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
