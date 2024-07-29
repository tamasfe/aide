<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import {
  AsYouType,
  parseDigits,
  type CountryCode as LibCountryCode,
} from "libphonenumber-js";
import { BaseInput } from "#components";
import type { CountryCode } from "~/utils/types";

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
const countryCodes = getCountryCodes();

const region = computed({
  get: () => props.region,
  set: value => emit("update:region", value),
});

// replace template with number, (XXX) XXX-XXXX
// ex. 1234567890 -> (123) 456-7890
// const formatByTemplate = (value: string, template: string) => {
//  if (!value) {
//    return value;
//  }
//  for (const char of value) {
//    template = template.replace("x", char);
//  }
//  return template;
// };

const getNationalNumber = (modelValue: string) => {
  const parts = region.value.split("+");
  const locale = parts[0] as LibCountryCode;
  const asYouType = new AsYouType(locale);
  return asYouType.input(modelValue);
  // const template = asYouType.getTemplate();
  // return formatByTemplate(asYouType.getNationalNumber(), template);
  // return formatIncompletePhoneNumber(asYouType.getNationalNumber(), locale);
};

const modelValue = computed({
  get: () => {
    if (!props.modelValue) return "";
    const value = props.modelValue;
    const nationalNumber = getNationalNumber(value);
    return nationalNumber;
  },
  set: (value) => {
    if (!value) {
      emit("update:modelValue", "");
      return;
    }
    const clean = parseDigits(value);
    emit("update:modelValue", clean);
  },
});

const getCountryCodeValue = (option: CountryCode) => {
  return `${option.code}${option.dial_code}`;
};

const selectedOption = computed(() => {
  return countryCodes.find(
    option => getCountryCodeValue(option) === region.value,
  );
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
                v-for="option in countryCodes"
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
