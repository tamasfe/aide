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

import { provideRegisterFormErrorPulse } from "~/components/form/register/formErrorPulse";
import type { UserTelephonePrimitives } from "./TelephoneBaseInputGroup.vue";

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

const { handleSubmit, meta, values } = useForm();
const { $dependencies } = useNuxtApp();
const { pulse: pulseFormErrors } = provideRegisterFormErrorPulse();

const errorMessage = ref<null | string>(null);
const loadingSubmit = ref(false);
const loadingFields = ref({
  email: false,
  cpf: false,
  telephone: false,
  password: false,
});

const onSubmit = handleSubmit(async () => {
  if (loading.value) {
    return;
  }

  if (!meta.value.valid) {
    return;
  }

  loadingSubmit.value = true;
  errorMessage.value = "";

  let searchParams: Record<string, string> | undefined = undefined;
  const resultSearchParams = $dependencies.clicks.repositories.marketingSearchParamsRepo.searchAttributed();
  if (resultSearchParams.isFailure) {
    $dependencies.common.logger.error("Error retrieving the saved marketing query parameters. This might affect our attribution", resultSearchParams.error);
  }
  else {
    if (resultSearchParams.value) {
      searchParams = resultSearchParams.value.params;
    }
  }

  /**
   * We upsert one last time before the submission in case the frontend is out of sync with the backend, which can lead to an incomplete
   * submission, and thus a backend error.
   */
  const telephone: UserTelephonePrimitives = values.telephone;
  await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({
    utmParameters: searchParams,
    email: values.email,
    cpf: values.cpf,
    telephone: telephone.prefix.value + telephone.value,
    password: values.password,
  });

  const errorSubmitting = await $dependencies.signupFlows.ui.submitSignupFlowOnFormSubmission.handle();

  loadingSubmit.value = false;
  errorMessage.value = errorSubmitting;
}, ({ results }) => {
  $dependencies.common.logger.warn("Register form validation failed", { results });
  errorMessage.value = "";

  // Trigger a reactive pulse for descendants to animate their error messages
  pulseFormErrors();
});

const loading = computed<boolean>(() => {
  return (loadingSubmit.value || loadingFields.value.email || loadingFields.value.cpf || loadingFields.value.telephone || loadingFields.value.password);
});
</script>

<template>
  <BaseForm :on-submit="onSubmit">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="-translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-4 opacity-0"
    >
      <BaseAlert
        v-if="errorMessage"
        :message="errorMessage"
        level="error"
      />
    </Transition>

    <FormRegisterEmailBaseInputGroup :initial-value="email" @loading="(value) => loadingFields.email = value" />

    <FormRegisterPasswordBaseInputGroup @loading="(value) => loadingFields.password = value" />

    <FormRegisterCpfBaseInputGroup :initial-value="cpf" @loading="(value) => loadingFields.cpf = value" />

    <FormRegisterTelephoneBaseInputGroup :initial-value="telephone" @loading="(value) => loadingFields.telephone = value" />

    <div class="my-2 text-sm text-center text-subtle">
      {{ $t("modal_session.accept_terms") }}
      <NuxtLinkLocale
        :to="{ name: 'terms' }"
        class="font-semibold md:hover:text-subtle-light"
        @click="() => $dependencies.users.ui.emitCommandCloseUserActionModal.handle()"
      >
        {{ $t("page.terms") }}
      </NuxtLinkLocale>
    </div>

    <BaseButton
      id="submit-signup-flow-form-button"
      :loading="loading"
      size="xl"
      class="w-full gap-1.5"
      type="submit"
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
        class="text-primary md:hover:underline"
        @click="$dependencies.users.ui.emitCommandOpenUserActionModal.handle('login')"
      >
        {{ $t("button.login") }}
      </BaseButton>
    </div>
  </BaseForm>
</template>
