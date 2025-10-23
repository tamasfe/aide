<script setup lang="ts">
import { DEFAULT_PREFIX, type UserTelephonePrefix } from "~/modules/users/domain/UserTelephone";

defineProps<{
  errorMessage: string | undefined;
}>();

const { locale } = useI18n();

type UserTelephonePrefixOption = UserTelephonePrefix & {
  title: string;
};

const addCountryTitleToPrefix = (prefix: UserTelephonePrefix): UserTelephonePrefixOption => {
  return {
    ...prefix,
    title: useCountryName(prefix.countryCode, locale.value) || prefix.countryCode,
  };
};

const telephone = defineModel("telephone", { type: String, required: false });

const prefixOptions: UserTelephonePrefixOption[] = [
  addCountryTitleToPrefix({ value: "+55", countryCode: "BR" }),
  addCountryTitleToPrefix({ value: "+1", countryCode: "US" }),
];

const prefix = defineModel("prefix", {
  type: Object as PropType<{ value: string; countryCode: string }>,
  required: false,
});

const selectedPrefix = computed({
  get() {
    return addCountryTitleToPrefix(prefix.value ?? DEFAULT_PREFIX);
  },
  set(value) {
    prefix.value = {
      value: value.value,
      countryCode: value.countryCode,
    };
  },
});
</script>

<template>
  <BaseInputGroup
    v-model="telephone"
    class="items-center"
    :placeholder="$t('field.telephone')"
    inputmode="numeric"
    name="telephone"
    :mask="{ type: 'telephone', countryCode: selectedPrefix.countryCode, telephone: telephone || '' }"
    :mask-behaviour-eager="true"
    :error-message="errorMessage"
  >
    <template #prefix>
      <BaseSelect
        v-model="selectedPrefix"
        :options="prefixOptions"
        :options-offset="{ }"
        container-class="w-auto"
        class="bg-subtle"
      >
        <template #selected="{ selected }">
          <div class="flex flex-shrink-0 items-center gap-2">
            <BaseFlag
              v-if="selected"
              :country-code="selected.countryCode"
            />
            <span class="text-default">{{ selected?.value }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex flex-shrink-0 items-center gap-2">
            <BaseFlag
              :country-code="option.countryCode"
            />
            <span>({{ option.value }})</span>
          </div>
        </template>
      </BaseSelect>
    </template>
  </BaseInputGroup>
</template>
