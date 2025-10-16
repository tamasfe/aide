<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✴️
//   * disabled/loading spinner/opacity should fade and not be instant
//   * loading spinner could look slightly better
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-medium select-none focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-button-primary md:hover:bg-button-primary-hover text-button-primary focus:ring-1 focus:ring-button-primary-hover",
        // We can only apply translations to elements that don't have any background image/gradient as those are not animatable
        secondary: "bg-button-secondary md:hover:bg-button-secondary-hover text-button-secondary transition-colors duration-[50ms]",
        emphasis: "bg-button-emphasis md:hover:bg-button-emphasis-hover text-button-emphasis",
        subtle: "bg-button-subtle md:hover:bg-button-subtle-hover text-button-subtle focus:ring-1 focus:ring-text-subtle transition-colors duration-[50ms]",
        danger: "bg-button-danger md:hover:bg-button-danger-hover text-button-danger transition-colors duration-[50ms]",
        ghost: "",
      },
      size: {
        sm: "h-8 px-3 text-sm font-semibold rounded",
        md: "h-10 px-4 text-base font-semibold rounded",
        lg: "",
        xl: "h-12 px-6 text-lg font-bold rounded",
        input: "h-[var(--giro-field-height)] px-4 text-base font-medium rounded",
        dashboard: "w-full h-10 px-3 sm:h-8 sm:text-sm font-medium rounded",
        ghost: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type BaseButtonProps = {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  loading?: boolean;
  disabled?: boolean;
  type?: ButtonHTMLAttributes["type"];
  class?: HTMLAttributes["class"];
};

const props = withDefaults(defineProps<BaseButtonProps>(), {
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
      { 'opacity-70': disabled },
      props.class,
    )"
  >
    <BaseSpinner
      v-if="loading"
      class="mr-2"
    />
    <slot />
  </button>
</template>
