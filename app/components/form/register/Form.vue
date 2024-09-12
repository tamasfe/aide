<script setup lang="ts">
import { useField } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

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
 * Client side direct validation
 */

const { handleSubmit } = useForm();

const { value: email, errorMessage: emailErrorMessage } = useField(
  "email",
  toTypedSchema(
    zod
      .string()
      .min(1, { message: "This is required" })
      .email({ message: "Must be a valid email" }),
  ),
);
const { value: password } = useField(
  "password",
  toTypedSchema(
    zod
      .string()
      .min(1, { message: "This is required" })
      .min(8, { message: "Too short" }),
  ),
);

const { value: telephone, errorMessage: telephoneErrorMessage } = useField(
  "telephone",
  toTypedSchema(
    zod
      .string()
      .min(1, { message: "This is required" })
      .length(14, { message: "Must be a valid telephone" }),
  ),
);

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
      :error-message="emailErrorMessage"
      @input="(value) => (email = value)"
    />

    <BaseInputGroup
      :placeholder="$t('field.password')"
      type="password"
      autocomplete="new-password"
      @input="(value) => (password = value)"
    />

    <FormRegisterCpfBaseInputGroup />

    <BaseInputGroup
      :placeholder="$t('field.telephone')"
      mask="123"
      inputmode="numeric"
      :error-message="telephoneErrorMessage"
      @input="(value) => (telephone = value)"
    />

    <div class="my-2 text-sm text-center text-subtle">
      {{ $t("modal_auth.accept_terms") }}
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
      {{ $t("modal_auth.have_account") }}

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
