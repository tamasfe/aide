<script setup lang="ts">
import { BaseInput, BaseSelect } from "#components";
import type { InputProps } from "./base/Input.vue";
import type { SelectProps } from "./base/Select.vue";

defineOptions({
  inheritAttrs: false,
});

type FormControlProps = {
  type?: "text" | "select" | "number" | "password" | "email" | "tel" | "search";
  hint?: string;
  error?: string;
};

type TextControl = {
  type: "text";
} & InputProps;

type SelectControl = {
  type: "select";
} & SelectProps;

// vue doens't support auto type detecta :(
const props = withDefaults(defineProps<FormControlProps>(), {
  type: "text",
});

const attrs = useAttrs();

const controlAttrs = computed(() => {
  let _attrs: typeof attrs = {};
  for (let key in attrs) {
    if (key !== "class" && key !== "style") {
      _attrs[key] = attrs[key];
    }
  }
  return _attrs;
});

const isInput = computed(() => {
  const inputs = {
    text: true,
    number: true,
    password: true,
    email: true,
    tel: true,
    search: true,
    select: false,
  };
  return inputs[props.type];
});
</script>
<template>
  <div :class="attrs.class">
    <BaseInput v-if="isInput" v-bind="controlAttrs as TextControl" :type="type">
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </BaseInput>
    <BaseSelect
      v-else-if="type === 'select'"
      v-bind="controlAttrs as SelectControl"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
    </BaseSelect>
    <div v-if="error" class="text-red-400">{{ error }}</div>
    <div v-if="hint" class="text-emphasis text-sm font-medium">
      Info: {{ hint }}
    </div>
  </div>
</template>
