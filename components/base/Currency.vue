<script setup lang="ts">
import { type MaskInputOptions } from "maska";
import type { InputProps } from "./Input.vue";
import { getCurrencySymbol, formatNumber } from "~/utils/index"

export type CurrencyProps = Omit<InputProps, "modelValue"> & {
  modelValue?: number;
  locale: string;
  currency: string;
  error?: string;
};

const props = defineProps<CurrencyProps>();
const emit = defineEmits(["update:modelValue", "focus", "blur", "input"]);

const modelValue = computed<number | undefined>({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    if (!value) {
      emit("update:modelValue", undefined);
      return;
    }
    emit("update:modelValue", value);
  },
});

const inputValue = computed(() => {
  if (props.modelValue) {
    const number = props.modelValue;
    const formatted = Intl.NumberFormat(props.locale).format(number);
    return formatted;
  }
  return "";
});

const maskOptions = computed<MaskInputOptions>(() => {
  return {
    number: {
      locale: props.locale,
      fraction: 2,
      unsigned: true,
    },
  } as MaskInputOptions;
});

const onUpdateModelValue = (value: string) => {
  if (value !== "") {
    modelValue.value = parseFloat(value);
    return;
  }
  modelValue.value = undefined;
};
</script>

<template>
  <BaseInput
    ref="input"
    v-bind="props"
    :model-value="inputValue"
    type="text"
    inputmode="numeric"
    :error="error"
    :maska="maskOptions"
    :raw="true"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @input="emit('input', $event)"
    @update:model-value="onUpdateModelValue"
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
