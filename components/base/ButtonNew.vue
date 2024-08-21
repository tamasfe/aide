<script lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-base font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-button-primary hover:bg-button-primary-hover text-button-primary",
        secondary: "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary",
        emphasis: "bg-button-emphasis hover:bg-button-emphasis-hover text-button-emphasis",
        ghost: "",
      },
      size: {
        sm: "",
        md: "h-10 px-4 font-semibold rounded-default",
        lg: "",
        xl: "h-12 px-6 text-lg font-bold rounded-default",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  loading?: boolean;
  disabled?: boolean;
  class?: HTMLAttributes["class"];
  type?: ButtonHTMLAttributes["type"];
}>(), {
  loading: false,
  disabled: false,
  type: "button",
});
</script>

<template>
  <button
    :disabled="disabled || loading"
    :class="cn(
      buttonVariants({ variant, size }),
      { 'opacity-70': disabled || loading },
      props.class,
    )"
  >
    <slot />
  </button>
</template>
