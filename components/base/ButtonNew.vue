<script lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-button-primary hover:bg-button-primary-hover text-button-primary",
        secondary: "bg-button-secondary hover:bg-button-secondary-hover text-button-secondary",
        emphasis: "bg-button-emphasis hover:bg-button-emphasis-hover text-button-emphasis",
        subtle: "bg-button-subtle hover:bg-button-subtle-hover text-button-subtle",
        ghost: "",
      },
      size: {
        sm: "h-8 px-3 text-sm font-semibold rounded-default",
        md: "h-10 px-4 text-base font-semibold rounded-default",
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
    :type="type"
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
