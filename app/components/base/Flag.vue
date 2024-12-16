<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
//   * https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434

const flagVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      size: {
        md: "w-[1.2rem] rounded-[3px]",
        lg: "w-[1.4rem] rounded-[3px]",
        xl: "w-[1.8rem] rounded-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  });

type FlagVariants = VariantProps<typeof flagVariants>;

const props = defineProps<{
  countryCode: string;
  size?: FlagVariants["size"];
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <BaseIcon
    :class="cn(flagVariants({ size }), props.class)"
    :name="`girobet-flags:${countryCode.toLowerCase()}`"
    :size="20"
  />
</template>
