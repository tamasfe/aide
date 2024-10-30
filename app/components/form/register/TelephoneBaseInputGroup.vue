<script setup lang="ts">
import { useField } from "vee-validate";
import type { SupportedCountryFlagCode } from "~/types/constants";

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: telephone, errorMessage: telephoneErrorMessage, validate: validateTelephoneChange } = useField("telephone", value =>
  $dependencies.signupFlows.ui.validateTelephoneUpsertingSignupFlowOnTelephoneValueChanged.handle(value, selectedPrefix.value.value),
);

type TelephonePrefixOption = {
  value: string;
  title: string;
  countryCode: SupportedCountryFlagCode;
};

const prefixOptions: TelephonePrefixOption[] = [
  { value: "+55", title: "Brasil", countryCode: "BR" as const },
  { value: "+1", title: "United States", countryCode: "US" as const },
];

const selectedPrefix = ref<TelephonePrefixOption>(prefixOptions[0] as TelephonePrefixOption);

const onTelephonePrefixChange = (option: TelephonePrefixOption) => {
  selectedPrefix.value = option;
  validateTelephoneChange();
};

/**
 * TODO: once we know all telephone country codes that we support, refactor this to a class or file of its own "TelephoneMaskSelector"
 * that will depend on (countryCode, telephoneValue). Those 2 params should allow us to correctly pick the correct mask for all use cases.
 */
const mask = computed(() => {
  switch (selectedPrefix.value.countryCode) {
    case "BR":
    {
      const BRASIL_MASK_MOBILE = "(##) #####-####";
      const BRASIL_MASK_FIXED = "(##) ####-####";

      const thirdDigitOfUnmaskedTelephone = String(telephone.value).replace(/\D/g, "").slice(2, 3);
      const isBrasilianMobileTelephone = thirdDigitOfUnmaskedTelephone === "9";
      return isBrasilianMobileTelephone ? BRASIL_MASK_MOBILE : BRASIL_MASK_FIXED;
    }
    case "US":
      return "(###) ###-####";
    default:
      return "";
  }
});
</script>

<template>
  <BaseInputGroup
    class="items-center"
    :placeholder="$t('field.telephone')"
    inputmode="numeric"
    name="telephone"
    :mask="mask"
    :mask-behaviour-eager="true"
    :error-message="telephoneErrorMessage"
    @input="(value) => telephone ? (telephone = value) : null"
    @change="(value) => telephone ? null : telephone = value"
  >
    <template #suffix>
      <BaseSelect
        :options="prefixOptions"
        :options-offset="{ right: -20 }"
        :initial-selected-option="selectedPrefix"
        container-class="w-auto"
        class="pr-0 bg-subtle"
        @change="onTelephonePrefixChange"
      >
        <template #selected="{ selected }">
          <div class="flex flex-shrink-0 items-center gap-2">
            <BaseFlag
              v-if="selected"
              :country-code="selected.countryCode"
              size="md"
            />
            <span class="text-default">{{ selected?.value }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex flex-shrink-0 items-center gap-2">
            <BaseFlag
              :country-code="option.countryCode"
              size="md"
            />
            <span>{{ option.title }} ({{ option.value }})</span>
          </div>
        </template>
      </BaseSelect>
    </template>
  </BaseInputGroup>
</template>
