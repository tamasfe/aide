<script setup lang="ts">
// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * currently shows CPF for all jurisdictions and it needs to be BR only
//   * the dropdown for the +1 prefix isnt done
//   * dynamic mask for phone based on loaded jurisdiction: NOTE: this must also handle multiple masks I believe. so mask or mask[]
// TRANSLATION STATUS:          ✅
// AUTOCOMPLETES:               ✅
// INPUTMODES:                  ✅
// Validation:                  ✅
// Submitting to backend:       ❌
// Integration testing:         ❌

const { handleSubmit, errors } = useForm();

const onSubmit = handleSubmit(
  (values) => {
    alert(JSON.stringify(values, null, 2));
  },
  ({ results }) => {
    console.warn("Validation failed", results);
    // console.log(values); // current form values
    // console.log(errors); // a map of field names and their first error message
    // console.log(results); // a detailed map of field names and their validation results
  },
);

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

    <FormRegisterEmailBaseInputGroup />

    <FormRegisterPasswordBaseInputGroup />

    <FormRegisterCpfBaseInputGroup />

    <FormRegisterTelephoneBaseInputGroup />

    <div class="my-2 text-sm text-center text-subtle">
      {{ $t("modal_session.accept_terms") }}
      <NuxtLink
        :to="{ name: 'terms' }"
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
      type="submit"
      :disabled="errors ? Object.keys(errors).length > 0 : false"
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
