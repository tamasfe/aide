<script setup lang="ts">
import { debouncedWatch } from "@vueuse/core";
import { useField } from "vee-validate";

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

const props = defineProps({
  initialValue: {
    type: String,
    default: "",
  },
});
const emits = defineEmits<{
  (e: "loading", value: boolean): void;
}>();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: email, errorMessage: emailErrorMessage } = useField("email", value =>
  $dependencies.signupFlows.ui.validateEmailOnRegisterFormChanged.handle(value),
{ initialValue: props.initialValue },
);

// We use debounced for this field as every keystroke might be a valid value (unlike telephone or cpf that are only valid at the last one), thus we need to implement some debounce to reduce server load
debouncedWatch(() => email.value, async (value) => {
  emits("loading", true);
  if (true === await $dependencies.signupFlows.ui.validateEmailOnRegisterFormChanged.handle(value)) {
    await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({ email: value });
  }
  emits("loading", false);
}, { debounce: 300 });
</script>

<template>
  <BaseInputGroup
    :placeholder="$t('field.email')"
    autocomplete="email"
    inputmode="email"
    name="email"
    :error-message="emailErrorMessage"
    :model-value="email"
    @input="(value) => email ? (email = value) : null"
    @change="(value) => email ? null : email = value"
  />
</template>
