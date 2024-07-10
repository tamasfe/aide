<script setup lang="ts">
import type { InputProps } from "./Input.vue";

export type CurrencyProps = InputProps & {
  locale: string;
  currency: string;
};

const props = defineProps<CurrencyProps>();
const emit = defineEmits(["update:modelValue"]);

const moneyMask = (value: string, locale: string) => {
  value = value.replace(".", "").replace(",", "").replace(/\D/g, "");
  if (!value) return "";
  const result = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    // add currency symbol
  }).format(parseFloat(value) / 100);

  return result;
};

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (value) {
      emit("update:modelValue", moneyMask(value, props.locale));
    }
    else {
      emit("update:modelValue", "");
    }
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
