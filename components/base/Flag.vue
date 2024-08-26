<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { filename } from "pathe/utils";
import type { SupportedCountryCode } from "@/types/constants";

// DESIGN STATUS:       ✴️
//   * Design is completely broken because I have added cva but didnt migrate the css at the bottom of this file into the variants css. when we move it in we can pretty much destroy all this css and just make some very fukin simple widths just like using w-[2rem] and thats the end of it. all this other flim flamming is stupid and a waste of time
// ARCHITECTURE STATUS: ✴️
//   * refactor glob imports below into composable potentially... or just handle stupid multi images in a better way as this pattern will probably appear a lot
//   * https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434
// TRANSLATION STATUS:  ✅

const flagVariants = cva(
  "flag border-radius",
  {
    variants: {
      size: {
        md: "w-[0.9rem] h-auto",
        lg: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type FlagVariants = VariantProps<typeof flagVariants>;

const props = defineProps<{
  size?: FlagVariants["size"];
  countryCode: SupportedCountryCode;
  class?: HTMLAttributes["class"];
}>();

// @ts-ignore
const glob = import.meta.glob("~/assets/svg/flags/active/*.svg", {
  eager: true,
});

const images = Object.fromEntries(
  // @ts-ignore
  Object.entries(glob).map(([key, value]) => [filename(key), value.default]),
);

const imageUrl = computed(() => images[props.countryCode]);
</script>

<template>
  <div
    :class="cn(
      flagVariants({ size }),
      props.class,
    )"
  >
    <img :src="imageUrl">
  </div>
</template>
