<script setup lang="ts">
import type { InputHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle text-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-field-height)] px-4 text-base font-medium rounded-default",
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

const props = withDefaults(defineProps<{
  variant?: InputVariants["variant"];
  size?: InputVariants["size"];
  type?: "text" | "password"; // "text" with X inputmode is preferred as we do our own validation
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  autocomplete?: InputHTMLAttributes["autocomplete"];
  autocorrect?: "off";
  inputmode?: "text" | "decimal" | "numeric" | "tel" | "search" | "email";
  class?: HTMLAttributes["class"];
}>(), {
  type: "text",
  required: false,
  disabled: false,
  autocomplete: "on",
  autocorrect: "off",
  inputmode: "text",
});
</script>

<template>
  <input
    :type="type"
    :required="required"
    :disabled="disabled"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :autocorrect="autocorrect"
    :inputmode="inputmode"
    :class="cn(
      inputVariants({ variant, size }),
      props.class,
    )"
  >
</template>
