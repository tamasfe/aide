<script setup lang="ts">
import { type VariantProps, cva } from "class-variance-authority";
import type { MaskInputOptions } from "maska";
import type { InputHTMLAttributes } from "vue";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle text-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-field-height)] text-base font-medium rounded",
        lg: "h-[var(--giro-field-height)] text-lg font-medium rounded",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type InputVariants = VariantProps<typeof inputVariants>;

// the vue-ignore is required as vue-sfc mistakenly thinks this prop is a complex object
// and throws an error due to the extend. https://github.com/vuejs/core/issues/8286
interface InputProps extends /** @vue-ignore */ InputHTMLAttributes {
  variant?: InputVariants["variant"];
  inputSize?: InputVariants["size"];
  mask?: string | MaskInputOptions;
  maskBehaviourEager?: boolean;
  // Explicitly extract class in the props, so it doesn't appear in the $attrs object,
  // which allows us to manually handle the class binding
  class?: string;
}

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  required: false,
  disabled: false,
  autocomplete: "on",
  autocorrect: "off",
  inputmode: "text",
});

const [value, modifiers] = defineModel<string | number>({
  set(value) {
    if (modifiers.number) {
      return Number(value);
    }
    return value;
  },
});
</script>

<template>
  <input
    v-model="value"
    v-maska="mask"
    :data-maska-eager="maskBehaviourEager ?? false"
    :class="cn(
      'text-lg',
      inputVariants({ variant, size: inputSize }),
      props.class,
    )"
  >
</template>

<style scoped>
  /* To remove the MacOS auto-fill styles */
  input:-webkit-autofill {
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: rgb(var(--giro-bg-text-emphasis)) !important;
    -webkit-text-stroke: unset;
  }
</style>
