<script setup lang="ts">
import { BaseInput } from "#components";
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

type SelectOption = {
  value: string;
  title: string;
};

export type NumberProps = {
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  disabled?: boolean;
  options?: SelectOption[];
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

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const region = computed({
  get: () => props.region,
  set: (value) => emit("update:region", value),
});

const selectedOption = computed(() => {
  return props.options?.find((option) => option.value === props.region);
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
    class="relative"
    type="number"
    :title="title"
    :wrapperClass="wrapperClass"
    :input-class="inputClass"
    :disabled="disabled"
    :placeholder="placeholder"
    v-model="modelValue"
  >
    <template #prefix>
      <SelectRoot v-model="region">
        <SelectTrigger class="outline-none">
          <SelectValue
            class="text-[18px] font-bold"
            :class="[selectedOption ? 'text-default' : 'text-subtle']"
            :placeholder="placeholder"
          >
            {{ selectedOption?.title }}
          </SelectValue>
        </SelectTrigger>

        <SelectPortal>
          <transition name="giro__select-fade">
            <SelectContent
              class="bg-emphasis rounded-b-default"
              position="popper"
              :side-offset="10.5"
              :align-offset="-18"
              align="start"
              side="bottom"
              @close-auto-focus="onCloseAutoFocus"
            >
              <SelectViewport class="pt-2">
                <SelectGroup class="flex flex-col text-[18px] font-medium">
                  <SelectItem
                    v-for="(option, index) in options"
                    :key="index"
                    class="cursor-pointer outline-none px-4 py-2 text-subtle hover:text-emphasis hover:bg-subtle focus:bg-subtle"
                    :value="option.value"
                  >
                    <slot name="option" :option="option">
                      <SelectItemText>
                        {{ option.title }}
                      </SelectItemText>
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
