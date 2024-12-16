<script setup lang="ts">
import type { UserTelephonePrefix } from "~/modules/users/domain/UserTelephone";
import { UserTelephoneMask } from "~/modules/users/infra/ui/UserTelephoneMask";

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

const telephone = defineModel("telephone", { type: String, required: true });

const prefixOptions: UserTelephonePrefixOption[] = [
  addCountryTitleToPrefix({ value: "+55", countryCode: "BR" }),
  addCountryTitleToPrefix({ value: "+1", countryCode: "US" }),
];
const prefix = defineModel("prefix", { type: Object as PropType<{ value: string; countryCode: string }>, required: true });

const selectedPrefix = computed({
  get() {
    return addCountryTitleToPrefix(prefix.value);
  },
  set(value) {
    prefix.value = {
      value: value.value,
      countryCode: value.countryCode,
    };
  },
});

defineProps<{
  errorMessage: string | undefined;
}>();

const mask = computed(() => UserTelephoneMask.new(prefix.value.countryCode, telephone.value || "").value());
</script>

<template>
  <BaseInputGroup
    v-model="telephone"
    class="items-center"
    :placeholder="$t('field.telephone')"
    inputmode="numeric"
    name="telephone"
    :mask="mask"
    :mask-behaviour-eager="true"
    :error-message="errorMessage"
  >
    <template #suffix>
      <BaseSelect
        v-model="selectedPrefix"
        :options="prefixOptions"
        :options-offset="{ right: -20 }"
        container-class="w-auto"
        class="pr-0 bg-subtle"
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
