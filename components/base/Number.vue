<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { BaseInput } from "#components";
import type { CountryCode } from "~/utils/types";

export type NumberProps = {
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  disabled?: boolean;
  region?: string;
  placeholder?: string;
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

const modelValue = computed({
  get: () => props.modelValue,
  set: value => emit("update:modelValue", value),
});

const region = computed({
  get: () => props.region,
  set: value => emit("update:region", value),
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
    class="relative"
    type="text"
    :title="title"
    :wrapper-class="wrapperClass"
    :input-class="inputClass"
    :disabled="disabled"
    :placeholder="placeholder"
    inputmode="numeric"
    autocomplete="tel"
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
              class="absolute giro__select-options max-h-60 w-40 overflow-auto rounded-b-default bg-subtle outline-none"
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
