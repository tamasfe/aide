<script setup lang="ts">
import type { InputProps } from "./base/Input.vue";
import type { NumberProps } from "./base/Number.vue";
import type { SelectProps } from "./base/Select.vue";
import type { PasswordProps } from "./base/Password.vue";
import type { CurrencyProps } from "./base/Currency.vue";
import { BaseCurrency, BaseInput, BaseSelect } from "#components";

defineOptions({
  inheritAttrs: false,
});

type FormControlProps = {
  type?:
    | "text"
    | "select"
    | "number"
    | "password"
    | "email"
    | "tel"
    | "search"
    | "currency";
  hint?: string;
  error?: string;
};

type TextControl = {
  type: "text";
} & InputProps;

type SelectControl = {
  type: "select";
} & SelectProps;

type NumberControl = {
  type: "number";
} & NumberProps;

type PasswordControl = {
  type: "password";
} & PasswordProps;

type CurrencyControl = {
  type: "currency";
} & CurrencyProps;

// vue doens't support auto type detecta :(
const props = withDefaults(defineProps<FormControlProps>(), {
  type: "text",
});

const { error } = toRefs(props);
// used to trigger jiggle animation on blur
const localError = ref(error.value);

const attrs = useAttrs();

const controlAttrs = computed(() => {
  const _attrs: typeof attrs = {};
  for (const key in attrs) {
    if (key !== "class" && key !== "style") {
      _attrs[key] = attrs[key];
    }
  }
  return _attrs;
});

const isInput = computed(() => {
  const inputs = {
    text: true,
    number: false,
    password: false,
    email: false,
    tel: false,
    search: true,
    select: false,
    currency: false,
  };
  return inputs[props.type];
});

const wrapper = ref<HTMLElement | null>(null);

const triggerJiggle = () => {
  const el = wrapper.value?.children[0];
  if (el && !el.classList.contains("giro__input-jiggle")) {
    el.classList.add("giro__input-jiggle");
  }
};

const removeJiggle = () => {
  const el = wrapper.value?.children[0];
  if (el && el.classList.contains("giro__input-jiggle")) {
    el.classList.remove("giro__input-jiggle");
  }
};

watch(localError, (value) => {
  if (value) {
    triggerJiggle();
  }
  else {
    removeJiggle();
  }
});

watch(error, (value) => {
  // if there's no longer error we don't
  // need to wait for the blur event
  if (!value) {
    localError.value = value;
  }
});
</script>

<template>
  <div
    ref="wrapper"
    :class="attrs.class"
  >
    <BaseInput
      v-if="isInput"
      v-bind="controlAttrs as TextControl"
      :type="type"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <template
        v-if="$slots.suffix"
        #suffix
      >
        <slot name="suffix" />
      </template>
    </BaseInput>
    <BaseInput
      v-else-if="props.type === 'email'"
      v-bind="controlAttrs as TextControl"
      type="text"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <template
        v-if="$slots.suffix"
        #suffix
      >
        <slot name="suffix" />
      </template>
    </BaseInput>
    <BaseSelect
      v-else-if="type === 'select'"
      v-bind="controlAttrs as SelectControl"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
    </BaseSelect>
    <BaseInput
      v-if="type === 'number'"
      v-bind="controlAttrs as TextControl"
      type="text"
      inputmode="numeric"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
      <template
        v-if="$slots.suffix"
        #suffix
      >
        <slot name="suffix" />
      </template>
    </BaseInput>
    <BaseNumber
      v-else-if="type === 'tel'"
      v-bind="controlAttrs as NumberControl"
      type="number"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.suffix"
        #suffix
      >
        <slot name="suffix" />
      </template>
    </BaseNumber>
    <BasePassword
      v-else-if="type === 'password'"
      v-bind="controlAttrs as PasswordControl"
      :error="localError"
      @blur="localError = error"
    >
      <template
        v-if="$slots.prefix"
        #prefix
      >
        <slot name="prefix" />
      </template>
    </BasePassword>
    <BaseCurrency
      v-else-if="type === 'currency'"
      v-bind="controlAttrs as CurrencyControl"
      :error="localError"
      @blur="localError = error"
    />
    <div
      v-if="localError"
      class="text-red-400"
    >
      {{ localError }}
    </div>
    <div
      v-if="hint"
      class="text-emphasis text-sm font-medium"
    >
      Info: {{ hint }}
    </div>
  </div>
</template>

<style scoped lang="postcss">
@keyframes jiggle {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-2px);
  }
  50% {
    transform: translateX(2px);
  }
  75% {
    transform: translateX(-2px);
  }
  100% {
    transform: translateX(0);
  }
}
.giro__input-jiggle {
  animation: jiggle 0.3s 1;
}
</style>
