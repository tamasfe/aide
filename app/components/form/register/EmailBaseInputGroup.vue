<script setup lang="ts">
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

watch(email, async (value) => {
  emits("loading", true);
  if (true === await $dependencies.signupFlows.ui.validateEmailOnRegisterFormChanged.handle(value)) {
    await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({ email: value });
  }
  emits("loading", false);
});
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
