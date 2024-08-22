<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { type VariantProps, cva } from "class-variance-authority";
import { filename } from "pathe/utils";
import { cn } from "~/utils";
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
        sm: "",
        md: "",
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

<style scoped>
.flag {
  display: inline-block;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
}
.flag.border-radius::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
  border-radius: 1px;
}
.flag img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* s */
.flag.size-s {
  width: 16px;
  height: 12px;
}
.flag.size-s.border-radius {
  border-radius: 1px;
}
/* m */
.flag.size-m {
  width: 20px;
  height: 15px;
}
.flag.size-m.border-radius {
  border-radius: 1.5px;
}
/* l */
.flag.size-l {
  width: 32px;
  height: 24px;
}
.flag.size-l.border-radius {
  border-radius: 2px;
}
</style>
