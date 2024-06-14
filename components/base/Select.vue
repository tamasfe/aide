<script setup lang="ts">
import { BaseInputWrapper } from "#components";
import {
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "radix-vue";

type SelectOption = {
  value: string;
  title: string;
};

export type SelectProps = {
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  disabled?: boolean;
  options?: SelectOption[];
  autocomplete?: string;
  placeholder?: string;
};

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<SelectProps>();

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const selectedOption = computed(() => {
  return props.options?.find((option) => option.value === modelValue.value);
});

const placeholder = computed(() =>
  props.title ? undefined : props.placeholder || "Select",
);
</script>

<template>
  <SelectRoot
    v-model="modelValue"
    v-slot="{ open }"
    :autocomplete="autocomplete"
  >
    <SelectTrigger asChild>
      <BaseInputWrapper
        class="cursor-pointer focus:outline outline-focus outline-2"
        tabindex="0"
        v-bind="$attrs"
        :wrapper-class="wrapperClass"
        :title="title"
        :disabled="disabled"
        :model-value="modelValue"
        :aria-label="title"
        :aria-expanded="open"
      >
        <template #prefix>
          <slot name="prefix" />
        </template>
        <template #default>
          <SelectValue
            class="text-[18px] font-medium"
            :class="[selectedOption ? 'text-default' : 'text-subtle']"
            :placeholder="placeholder"
          >
            {{ selectedOption?.title }}
          </SelectValue>
        </template>
        <template #suffix>
          <slot name="suffix" :open="open">
            <SelectIcon>
              <IconsCaretUp v-if="open" />
              <IconsCaretDown v-else />
            </SelectIcon>
          </slot>
        </template>
      </BaseInputWrapper>
    </SelectTrigger>

    <SelectPortal>
      <transition name="giro__select-fade">
        <SelectContent
          class="bg-emphasis giro__select-content rounded-b-default"
          position="popper"
          :side-offset="-10"
          align="start"
          side="bottom"
        >
          <SelectScrollUpButton
            class="flex items-center justify-center h-[18px] bg-emphasis cursor-default font-bold"
          >
            ^
          </SelectScrollUpButton>
          <SelectViewport class="pt-2">
            <SelectGroup class="flex flex-col text-[18px] font-medium">
              <SelectItem
                v-for="(option, index) in options"
                :key="index"
                class="cursor-pointer outline-none px-4 py-2 text-subtle hover:text-emphasis hover:bg-subtle focus:bg-subtle"
                :value="option.value"
              >
                <slot name="option" :option="option">
                  <div class="flex items-center justify-between">
                    <SelectItemText>
                      {{ option.title }}
                    </SelectItemText>
                    <SelectItemIndicator> true </SelectItemIndicator>
                  </div>
                </slot>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
          <SelectScrollDownButton
            class="flex items-center justify-center h-[18px] bg-emphasis cursor-default font-bold"
          >
            v
          </SelectScrollDownButton>
        </SelectContent>
      </transition>
    </SelectPortal>
  </SelectRoot>
</template>
