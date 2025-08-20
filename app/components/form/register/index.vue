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
// Submitting to backend:       ✅
// Integration testing:         ❌

defineProps({
  email: {
    type: String,
    default: "",
  },
  cpf: {
    type: String,
    default: "",
  },
  telephone: {
    type: String,
    default: "",
  },
});

const { handleSubmit, meta } = useForm();
const { $dependencies } = useNuxtApp();

const errorMessage = ref<null | string>(null);
const loadingSubmit = ref(false);
const loadingFields = ref({
  email: false,
  cpf: false,
  telephone: false,
  password: false,
});

const onSubmit = handleSubmit(async () => {
  loadingSubmit.value = true;

  const resultSearchParams = $dependencies.clicks.repositories.marketingSearchParamsRepo.searchAttributed();
  if (resultSearchParams.isFailure) {
    $dependencies.common.logger.error("Error retrieving the saved marketing queyr parameters. This might affect our attribution", resultSearchParams.error);
  }
  else {
    if (resultSearchParams.value) {
      $dependencies.common.logger.debug("Signup params found for user", { params: resultSearchParams.value.params });
      await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({ utmParameters: resultSearchParams.value.params });
    }
  }

  const errorSubmitting = await $dependencies.signupFlows.ui.submitSignupFlowOnFormSubmission.handle();
  loadingSubmit.value = false;
  errorMessage.value = errorSubmitting;
}, ({ results }) => {
  console.warn("Validation failed", results);
});

const loading = computed<boolean>(() => {
  return (loadingSubmit.value || loadingFields.value.email || loadingFields.value.cpf || loadingFields.value.telephone || loadingFields.value.password);
});
</script>

<template>
  <BaseForm :on-submit="onSubmit">
    <BaseAlert
      v-if="errorMessage"
      :message="errorMessage"
      level="error"
    />

    <FormRegisterEmailBaseInputGroup :initial-value="email" @loading="(value) => loadingFields.email = value" />

    <FormRegisterPasswordBaseInputGroup @loading="(value) => loadingFields.password = value" />

    <FormRegisterCpfBaseInputGroup :initial-value="cpf" @loading="(value) => loadingFields.cpf = value" />

    <FormRegisterTelephoneBaseInputGroup :initial-value="telephone" @loading="(value) => loadingFields.telephone = value" />

    <div class="my-2 text-sm text-center text-subtle">
      {{ $t("modal_session.accept_terms") }}
      <BaseLink
        :to="{ name: 'terms' }"
        class="font-semibold hover:text-subtle-light"
        @click="() => $dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
      >
        {{ $t("page.terms") }}
      </BaseLink>
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
