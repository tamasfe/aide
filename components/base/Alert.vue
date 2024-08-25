<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "~/utils";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const alertVariants = cva(
  "flex items-center justify-center text-center rounded-md",
  {
    variants: {
      level: {
        success: "bg-alert-success text-alert-success",
        error: "bg-alert-error text-alert-error",
        warning: "bg-alert-warning text-alert-warning",
        info: "bg-alert-info text-alert-info",
      },
      size: {
        md: "h-12 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type AlertVariants = VariantProps<typeof alertVariants>;

const props = defineProps<{
  level: AlertVariants["level"];
  message: string;
  size?: AlertVariants["size"];
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    v-if="message"
    :class="cn(
      alertVariants({ level, size }),
      props.class,
    )"
  >
    <div>{{ message }}</div>
  </div>
</template>
