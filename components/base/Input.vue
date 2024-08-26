<script setup lang="ts">
import type { InputHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle text-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        md: "h-[var(--giro-input-height)] px-4 text-base font-medium rounded-default",
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
  type: InputHTMLAttributes["type"];
  placeholder?: InputHTMLAttributes["placeholder"];
  autocomplete?: InputHTMLAttributes["autocomplete"];
  autocorrect?: InputHTMLAttributes["autocorrect"];
  inputmode?: InputHTMLAttributes["inputmode"];
  disabled?: boolean;
  variant?: InputVariants["variant"];
  size?: InputVariants["size"];
  class?: HTMLAttributes["class"];
}>(), {
  type: "text",
  placeholder: undefined,
  autocomplete: "on",
  autocorrect: "off",
  inputmode: "text",
  disabled: false,
});
</script>

<template>
  <input
    :type="type"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :autocorrect="autocorrect"
    :inputmode="inputmode"
    :disabled="disabled"
    :class="cn(
      inputVariants({ variant, size }),
      props.class,
    )"
  >
</template>
