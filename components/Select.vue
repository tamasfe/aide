<script setup lang="ts">
import { InputWrapper } from "#components";
import {
  SelectContent,
  SelectGroup,
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

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  modelValue?: string;
  inputClass?: string;
  wrapperClass?: string;
  title?: string;
  error?: string;
  disabled?: boolean;
  options?: SelectOption[];
}>();

const emit = defineEmits(["update:modelValue", "change", "focus", "blur"]);

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const selectedOption = computed(() => {
  return props.options?.find((option) => option.value === modelValue.value);
});
</script>

<template>
  <SelectRoot v-model="modelValue" v-slot="{ open }">
    <SelectTrigger asChild>
      <InputWrapper
        class="cursor-pointer"
        v-bind="$attrs"
        :wrapper-class="props.wrapperClass"
        :title="props.title"
        :error="props.error"
        :disabled="props.disabled"
        :modelValue="modelValue"
        :aria-label="title"
      >
        <template #prefix>
          <slot name="prefix" />
        </template>
        <template #default>
          <SelectValue class="text-[18px] font-medium">
            {{ selectedOption?.title }}
          </SelectValue>
        </template>
        <template #suffix>
          <IconsCaretUp v-if="open" />
          <IconsCaretDown v-else />
        </template>
      </InputWrapper>
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
                class="cursor-pointer outline-none px-4 py-2 text-subtle hover:text-emphasis hover:bg-subtle"
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
<style>
.giro__select-content {
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
}

.giro__select-fade-enter-active,
.giro__select-fade-leave-active {
  transition: opacity 0.25s;
}

.giro__select-fade-enter-from,
.giro__select-fade-leave-to {
  opacity: 0;
}

.giro__select-fade-enter-to,
.giro__select-fade-leave-from {
  opacity: 1;
}
</style>
