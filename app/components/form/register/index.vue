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

const { handleSubmit, meta } = useForm();
const { $dependencies } = useNuxtApp();

const errorMessage = ref<null | string>(null);
const loading = ref(false);

const onSubmit = handleSubmit(async () => {
  loading.value = true;
  const errorSubmitting = await $dependencies.signupFlows.ui.submitSignupFlowOnFormSubmission.handle();
  loading.value = false;
  errorMessage.value = errorSubmitting;
}
, ({ results }) => {
  console.warn("Validation failed", results);
});
</script>

<template>
  <BaseForm :on-submit="onSubmit">
    <BaseAlert
      v-if="errorMessage"
      :message="errorMessage"
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
      id="submit-signup-flow-form-button"
      :loading="loading"
      size="xl"
      class="w-full gap-1.5"
      type="submit"
      :disabled="!meta.valid"
      @click="onSubmit"
    >
      <span>{{ $t("button.create_account") }}</span>
      <BaseIcon
        name="lucide:arrow-right"
        :size="20"
      />
    </BaseButton>

    <div class="mt-6 text-center text-sm text-subtle">
      {{ $t("modal_session.have_account") }}

      <BaseButton
        variant="ghost"
        size="ghost"
        class="text-primary hover:underline"
        @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
      >
        {{ $t("button.login") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
