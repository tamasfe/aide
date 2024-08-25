<script setup lang="ts">
import type { InputHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

const inputVariants = cva(
  "focus-visible:outline-none disabled:opacity-70",
  {
    variants: {
      variant: {
        primary: "bg-subtle placeholder:text-subtle",
        ghost: "",
      },
      size: {
        md: "h-10 px-4 rounded-default",
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
  disabled?: boolean;
  variant?: InputVariants["variant"];
  size?: InputVariants["size"];
  class?: HTMLAttributes["class"];
}>(), {
  disabled: false,
  type: "text",
});
</script>

<template>
  <input
    :type="type"
    :disabled="disabled"
    :class="cn(
      inputVariants({ variant, size }),
      props.class,
    )"
  >
</template>
