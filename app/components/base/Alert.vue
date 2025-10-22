<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const alertVariants = cva(
  "flex items-center justify-center text-center rounded",
  {
    variants: {
      level: {
        success: "px-1 py-2 bg-alert-success text-alert-success",
        error: "px-1 py-2 bg-alert-error text-alert-error",
        warning: "px-1 py-2 bg-alert-warning text-alert-warning",
        info: "px-1 py-2 bg-alert-info text-alert-info",
      },
      size: {
        md: "h-[var(--giro-field-height)] text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AlertVariants = VariantProps<typeof alertVariants>;

export type AlertProps = {
  level: AlertVariants["level"];
  message: string;
  size?: AlertVariants["size"];
  class?: HTMLAttributes["class"];
};

const props = defineProps<AlertProps>();
</script>

<template>
  <div
    v-if="message"
    :class="cn(
      alertVariants({ level, size }),
      props.class,
    )"
  >
    <div class="whitespace-pre-wrap">
      {{ message }}
    </div>
    <slot />
  </div>
</template>
