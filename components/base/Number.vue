<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";
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

const onCloseAutoFocus = (e: Event) => {
  e.preventDefault();
  input.value?.focus();
};
</script>

<template>
  <BaseInput
    ref="input"
    v-model="modelValue"
    class="relative"
    type="number"
    :title="title"
    :wrapper-class="wrapperClass"
    :input-class="inputClass"
    :disabled="disabled"
    :placeholder="placeholder"
  >
    <template #prefix>
      <SelectRoot v-model="region">
        <SelectTrigger class="outline-none">
          <div
            v-if="selectedOption"
            class="flex items-center gap-2"
          >
            <BaseFlag
              :code="selectedOption.code"
              size="l"
            />
            <SelectValue
              class="text-[18px] font-bold"
              :class="[selectedOption ? 'text-default' : 'text-subtle']"
              :placeholder="placeholder"
            >
              {{ selectedOption?.dial_code }}
            </SelectValue>
          </div>
        </SelectTrigger>

        <SelectPortal>
          <transition name="giro__select-fade">
            <SelectContent
              class="bg-emphasis rounded-b-default max-h-52 giro__popover-content"
              position="popper"
              :side-offset="10.5"
              :align-offset="-17.5"
              align="start"
              side="bottom"
              @close-auto-focus="onCloseAutoFocus"
            >
              <SelectViewport class="pt-2">
                <SelectGroup class="flex flex-col text-[18px] font-medium">
                  <SelectItem
                    v-for="(option, index) in countryCodes"
                    :key="index"
                    class="cursor-pointer outline-none px-4 py-2 text-subtle hover:text-emphasis hover:bg-subtle focus:bg-subtle"
                    :value="getCountryCodeValue(option)"
                  >
                    <slot
                      name="option"
                      :option="option"
                    >
                      <div class="flex items-center gap-2">
                        <BaseFlag
                          :code="option.code"
                          size="l"
                        />
                        <SelectItemText>
                          {{ option.dial_code }}
                        </SelectItemText>
                      </div>
                    </slot>
                  </SelectItem>
                </SelectGroup>
              </SelectViewport>
            </SelectContent>
          </transition>
        </SelectPortal>
      </SelectRoot>
    </template>
  </BaseInput>
</template>
