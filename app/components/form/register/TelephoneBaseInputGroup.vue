<script setup lang="ts">
import { useField } from "vee-validate";
import { UserTelephoneMask } from "~/modules/users/infra/ui/UserTelephoneMask";

const props = defineProps({
  initialValue: {
    type: String,
    default: "",
  },
});

/**
 * Dependency injection
 */
const { $dependencies } = useNuxtApp();

const initialValue = ref<string>(props.initialValue.startsWith("+") ? props.initialValue.slice(3) : props.initialValue);

type TelephonePrefixOption = {
  value: string;
  title: string;
  countryCode: "BR" | "US";
};

const prefixOptions: TelephonePrefixOption[] = [
  { value: "+55", title: "Brazil", countryCode: "BR" as const },
  { value: "+1", title: "United States", countryCode: "US" as const },
];

const selectedPrefix = ref<TelephonePrefixOption>(
  prefixOptions.find(option => props.initialValue.startsWith(option.value)) || prefixOptions[0] as TelephonePrefixOption,
);

/**
 * Due to the need of using Zod's "parseAsync" I haven't found a way to concat min and max length validations with the use case
 */
const { value: telephone, errorMessage: telephoneErrorMessage, validate: validateTelephoneChange } = useField("telephone", value =>
  $dependencies.signupFlows.ui.validateTelephoneOnRegisterFormChanged.handle(value, selectedPrefix.value.value, selectedPrefix.value.countryCode),
{ initialValue: initialValue.value },
);

watch (selectedPrefix, async () => validateTelephoneChange());

watch([telephone, selectedPrefix], async ([telephone, telephonePrefix]) => {
  if (true === await $dependencies.signupFlows.ui.validateTelephoneOnRegisterFormChanged.handle(telephone, selectedPrefix.value.value, selectedPrefix.value.countryCode)) {
    await $dependencies.signupFlows.ui.upsertSignupFlowOnRegisterFormInputChange.handle({
      telephone,
      telephonePrefix: telephonePrefix?.value,
    });
  }
},
);

const mask = computed(() => UserTelephoneMask.new(selectedPrefix.value.countryCode, telephone.value).value());
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
    :model-value="telephone"
    @input="(value) => telephone === initialValue ? null : (telephone = value)"
    @change="(value) => telephone === initialValue ? (telephone = value) : null"
  >
    <template #suffix>
      <BaseSelect
        :options="prefixOptions"
        :options-offset="{ right: -20 }"
        :initial-selected-option="selectedPrefix"
        container-class="w-auto"
        class="pr-0 bg-subtle"
        @change="value => selectedPrefix = value"
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
