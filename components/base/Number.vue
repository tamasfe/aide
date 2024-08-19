<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import type { MaskInputOptions } from "maska";
import { BaseInput } from "#components";
import type { CountryCode, CountryMetadata } from "~/types/constants";
import { PHONE_MASKS, COUNTRY_METADATA } from "~/constants";

export type NumberProps = {
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  disabled?: boolean;
  region: string;
  placeholder?: string;
  error?: string;
};

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<NumberProps>();

const emit = defineEmits([
  "update:modelValue",
  "update:region",
  "change",
  "focus",
  "blur",
  "input",
]);

const input = ref<InstanceType<typeof BaseInput>>();

const getMaskOptions = (code: CountryCode) => {
  const maskOptions: MaskInputOptions = {
    mask: PHONE_MASKS[code],
    eager: true,
  };
  return maskOptions;
};

const region = computed({
  get: () => props.region,
  set: value => emit("update:region", value),
});

const modelValue = computed({
  get: () => {
    if (!props.modelValue) return "";
    return props.modelValue;
  },
  set: (value) => {
    if (!value) {
      emit("update:modelValue", "");
      return;
    }
    emit("update:modelValue", value);
  },
});

const getCountryCodeValue = (meta: CountryMetadata) => {
  return `${meta.code}${meta.dial_code}`;
};

const phoneMaskCountries = Object.entries(PHONE_MASKS).map(([code, _]) => (
  COUNTRY_METADATA.find(option => option.code === code) as CountryMetadata
));

const selectedOption = computed(() => {
  return COUNTRY_METADATA.find(option => getCountryCodeValue(option) === region.value) as CountryMetadata;
});

const placeholder = computed(() =>
  props.title ? undefined : props.placeholder || "Select",
);
</script>

<template>
  <BaseInput
    ref="input"
    v-model="modelValue"
    class="relative select-none"
    type="text"
    :title="title"
    :wrapper-class="wrapperClass"
    :input-class="inputClass"
    :disabled="disabled"
    :placeholder="placeholder"
    :error="error"
    :maska="getMaskOptions(selectedOption.code)"
    :raw="true"
    inputmode="numeric"
    autocomplete="tel"
    @focus="emit('focus', $event)"
    @blur="emit('blur', $event)"
    @input="emit('input', $event)"
  >
    <template #prefix>
      <Listbox v-model="region">
        <div
          class="relative outline-none inline-flex items-center"
          :class="$attrs.class"
        >
          <ListboxButton class="outline-none">
            <div
              v-if="selectedOption"
              class="flex items-center gap-2"
            >
              <BaseFlag
                :key="selectedOption.code"
                :code="selectedOption.code"
                size="m"
              />
              <span
                :class="[selectedOption ? 'text-default' : 'text-subtle']"
                :placeholder="placeholder"
              >
                {{ selectedOption?.dial_code }}
              </span>
            </div>
          </ListboxButton>

          <transition name="giro__select-fade">
            <ListboxOptions
              class="absolute giro__select-options max-h-40 w-40 overflow-auto rounded-b-default bg-subtle outline-none ml-[0.1rem]"
            >
              <ListboxOption
                v-for="option in phoneMaskCountries"
                v-slot="{ active }"
                :key="option.name"
                :value="getCountryCodeValue(option)"
                as="template"
              >
                <li
                  class="cursor-pointer outline-none px-3 py-2 text-subtle focus:bg-subtle"
                  :class="[active ? 'bg-subtle text-emphasis' : '']"
                >
                  <slot
                    name="option"
                    :option="option"
                  >
                    <div class="flex items-center justify-between">
                      <BaseFlag
                        :code="option.code"
                        size="m"
                      />
                      <span>
                        {{ option.dial_code }}
                      </span>
                    </div>
                  </slot>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
    </template>
  </BaseInput>
</template>

<style scoped lang="postcss">
.giro__select-options {
  top: calc(100% + 4px);
  left: -12px;
  z-index: 1;
}
</style>
