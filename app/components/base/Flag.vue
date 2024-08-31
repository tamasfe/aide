<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { filename } from "pathe/utils";
import type { SupportedCountryCode } from "@/types/constants";

// DESIGN STATUS:       ✅
// ARCHITECTURE STATUS: ✴️
//   * refactor glob imports below into composable potentially... or just handle stupid multi images in a better way as this pattern will probably appear a lot
// TRANSLATION STATUS:  ✅
//   * https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434

const flagVariants = cva(
  "flex-shrink-0",
  {
    variants: {
      size: {
        md: "w-[1.2rem] rounded-[3px]",
        lg: "w-[1.8rem] rounded-[3px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  });

type FlagVariants = VariantProps<typeof flagVariants>;

const props = defineProps<{
  countryCode: SupportedCountryCode;
  size?: FlagVariants["size"];
  class?: HTMLAttributes["class"];
}>();

// @ts-expect-error proper type isn't exported from nuxt
const glob = import.meta.glob("~/assets/svg/flags/active/*.svg", {
  eager: true,
});

const images = Object.fromEntries(
  // @ts-expect-error proper type isn't exported from nuxt
  Object.entries(glob).map(([key, value]) => [filename(key), value.default]),
);

const imageUrl = computed(() => images[props.countryCode]);
</script>

<template>
  <img
    :class="cn(flagVariants({ size }), props.class)"
    :src="imageUrl"
  >
</template>
