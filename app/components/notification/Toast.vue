<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const toastVariants = cva(
  "pointer-events-auto w-full max-w-sm overflow-hidden rounded",
  {
    variants: {
      variant: {
        success: "bg-alert-success text-alert-success",
        error: "bg-alert-error text-alert-error",
        warning: "bg-alert-warning text-alert-warning",
        info: "bg-alert-info text-alert-info",
      },
    },
    defaultVariants: {
    },
  },
);

type ToastVariants = VariantProps<typeof toastVariants>;

const props = defineProps<{
  variant: ToastVariants["variant"];
  title: string;
  message: string;
  class?: HTMLAttributes["class"];
}>();

const emits = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div
    :class="cn(
      toastVariants({ variant }),
      props.class,
    )"
  >
    <div class="p-4">
      <div class="flex items-start gap-x-4">
        <div class="w-0 flex-1 pt-0.5">
          <p class="text-base">
            {{ title }}
          </p>
          <p class="mt-1 text-sm">
            {{ message }}
          </p>
        </div>
        <div class="flex shrink-0">
          <BaseButton
            variant="ghost"
            type="button"
            class="px-2 pt-1 pb-4 h-auto inline-flex"
            @click="emits('close')"
          >
            <span class="sr-only">Close</span>
            <BaseIcon name="lucide:x" :size="20" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
