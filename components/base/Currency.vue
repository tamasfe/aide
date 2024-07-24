<script setup lang="ts">
import type { InputProps } from "./Input.vue";
import { toLocalMoney } from "@/utils";

export type CurrencyProps = Omit<InputProps, "modelValue"> & {
  modelValue: number;
  locale: string;
  currency: string;
};

const props = defineProps<CurrencyProps>();
const emit = defineEmits(["update:modelValue"]);

const modelValue = computed({
  get: () => {
    if (props.modelValue) {
      const number = props.modelValue;
      const { value } = toLocalMoney(String(number), props.locale);
      return value;
    }
    return "";
  },
  set: (value) => {
    const { number } = toLocalMoney(value, props.locale);
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
