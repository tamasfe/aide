<script setup lang="ts">
import type { InputProps } from "./Input.vue";

export type CurrencyProps = Omit<InputProps, "modelValue"> & {
  modelValue: number;
  locale: string;
  currency: string;
};

const props = defineProps<CurrencyProps>();
const emit = defineEmits(["update:modelValue"]);

const moneyMask = (value: string, locale: string) => {
  value = value.replace(".", "").replace(",", "").replace(/\D/g, "");
  if (!value)
    return {
      value: "",
      number: undefined,
    };
  const num = parseFloat(value) / 100;
  const result = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    // add currency symbol
  }).format(num);

  return {
    value: result,
    number: num,
  };
};

const modelValue = computed({
  get: () => {
    if (props.modelValue) {
      const number = props.modelValue;
      const actualNumber = roundToDecimalPlaces(number * 100, 2);
      const { value } = moneyMask(actualNumber.toString(), props.locale);
      return value;
    }
    return "";
  },
  set: (value) => {
    const { number } = moneyMask(value, props.locale);
    emit("update:modelValue", number);
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
