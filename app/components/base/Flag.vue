<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅
//   * https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434

const flagVariants = cva(
  "flex-shrink-0 rounded-sm",
  {
    variants: {
      size: {
        sm: {
        },
        md: {
        },
        lg: {
        },
      },
    },
    defaultVariants: {
      size: "md",
    },
  });

type FlagVariants = VariantProps<typeof flagVariants>;

const flagSizes = {
  sm: 14,
  md: 16,
  lg: 24,
};

const props = defineProps({
  countryCode: {
    type: String,
    required: true,
  },
  size: {
    type: String as PropType<FlagVariants["size"]>,
    default: "md",
  },
  class: {
    type: String as PropType<HTMLAttributes["class"]>,
    required: false,
  },
});
</script>

<template>
  <BaseIcon
    class=""
    :class="cn(flagVariants({ size }), props.class)"
    :name="`girobet-flags:${countryCode.toLowerCase()}`"
    :size="size ? flagSizes[size] : 20"
  />
</template>
