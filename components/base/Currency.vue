<script setup lang="ts">
import type { InputProps } from "./Input.vue";
import { cleanValue, formatValue, getLocaleConfig } from "~/utils/mask";

export type CurrencyProps = Omit<InputProps, "modelValue"> & {
  modelValue: number;
  locale: string;
  currency: string;
};

const props = defineProps<CurrencyProps>();
const emit = defineEmits(["update:modelValue"]);

const localeConfig = computed(() =>
  getLocaleConfig({
    locale: props.locale,
  }),
);

const modelValue = computed({
  get: () => {
    if (props.modelValue) {
      const number = props.modelValue;
      const formattedValue = formatValue({
        value: String(number),
        intlConfig: {
          locale: props.locale,
        },
      });
      return formattedValue;
    }
    return "";
  },
  set: (value) => {
    if (!value) {
      emit("update:modelValue", undefined);
      return;
    }
    const stringValue = cleanValue({ value: value, ...localeConfig.value });
    const numberValue = parseFloat(
      stringValue.replace(localeConfig.value.decimalSeparator, "."),
    );
    emit("update:modelValue", numberValue);
  },
});
</script>

<template>
  <BaseInput
    ref="input"
    v-bind="props"
    v-model:model-value="modelValue"
    type="text"
    inputmode="numeric"
  >
    <template #prefix>
      <p
        class="bg-button-emphasis text-transparent bg-clip-text text-lg font-bold"
      >
        {{ getCurrencySymbol(currency) }}
      </p>
    </template>
  </BaseInput>
</template>
