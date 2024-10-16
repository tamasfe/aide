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
 * that will depend on (countryCode, telephoneValue)
 */
const mask = computed(() => {
  const BRASIL_MASK_MOBILE = "(##) #####-####";
  const BRASIL_MASK_FIXED = "(##) ####-####";

  const thirdDigitOfUnmaskedTelephone = String(telephone.value).replace(/\D/g, "").slice(2, 3);
  const isBrasilianMobileTelephone = thirdDigitOfUnmaskedTelephone === "9";
  return isBrasilianMobileTelephone ? BRASIL_MASK_MOBILE : BRASIL_MASK_FIXED;
});
</script>

<template>
  <BaseInputGroup
    class="items-center"
    :placeholder="$t('field.telephone')"
    placeholder-placement="default"
    inputmode="numeric"
    name="telephone"
    :mask="mask"
    :mask-behaviour-eager="true"
    :error-message="telephoneErrorMessage"
    @input="(value) => telephone ? (telephone = value) : null"
    @change="(value) => telephone ? null : telephone = value"
  >
    <template #prefix>
      <div class="w-24">
        <BaseSelect
          :options="prefixOptions"
          class="gap-2 bg-subtle text-emphasis px-0"
          :options-offset="{
            left: -20,
          }"
          :initial-selected-option="selectedPrefix"
          @change="onTelephonePrefixChange"
        >
          <template #selected="{ selected }">
            <div class="flex items-center gap-1">
              <BaseFlag
                v-if="selected"
                :country-code="selected.countryCode"
                size="md"
              />
              <span class="text-default">{{ selected?.value }}</span>
            </div>
          </template>
          <template #option="{ option }">
            <div class="flex items-center gap-1 px-2">
              <BaseFlag
                :country-code="option.countryCode"
                size="md"
              />
              <span>{{ option.title }} ({{ option.value }})</span>
            </div>
          </template>
        </BaseSelect>
      </div>
    </template>
  </BaseInputGroup>
</template>
