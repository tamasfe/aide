<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";

import { PhCaretDown, PhCaretUp } from "@phosphor-icons/vue";
import { BaseInputWrapper } from "#components";

type SelectOption = {
  value: number | string | boolean;
  title: string;
};

export type SelectProps = {
  modelValue?: SelectOption["value"];
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
  set: value => emit("update:modelValue", value),
});

const placeholder = computed(() =>
  props.title ? undefined : props.placeholder || "Select",
);

const selectedOption = computed(() => {
  return props.options?.find(option => option.value === modelValue.value);
});
</script>

<template>
  <Listbox
    v-slot="{ open }"
    v-model="modelValue"
  >
    <div
      class="relative outline-none rounded-default h-max"
      :class="$attrs.class"
    >
      <ListboxButton
        class="outline-none"
        :class="$attrs.class"
      >
        <BaseInputWrapper
          class="cursor-pointer focus:outline outline-focus outline-2"
          :class="[open ? 'outline' : '']"
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
            <span
              class="font-medium flex items-start"
              :class="[inputClass, modelValue ? 'text-default' : 'text-subtle']"
            >
              {{ selectedOption?.title || placeholder }}
            </span>
          </template>
          <template #suffix>
            <slot
              name="suffix"
              :open="open"
            >
              <PhCaretUp
                v-if="open"
                :size="24"
              />
              <PhCaretDown
                v-else
                :size="24"
              />
            </slot>
          </template>
        </BaseInputWrapper>
      </ListboxButton>

      <transition name="giro__select-fade">
        <ListboxOptions
          class="absolute giro__select-options max-h-60 w-full overflow-auto rounded-b-default bg-emphasis outline-none"
        >
          <ListboxOption
            v-for="option in options"
            v-slot="{ selected, active }"
            :key="option.title"
            :value="option.value"
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
                  <span>
                    {{ option.title }}
                  </span>
                  <span v-if="selected"> true </span>
                </div>
              </slot>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<style scoped lang="postcss">
.giro__select-options {
  top: calc(100% - 5px);
  left: 0;
  z-index: 1;
}
</style>
