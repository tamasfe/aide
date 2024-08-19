<template>
  <div
    :class="[
      'flag',
      `size-${size}`,
      { 'border-radius': borderRadius },
      className,
    ]"
  >
    <img :src="imageUrl">
  </div>
</template>

<script setup lang="ts">
import { filename } from "pathe/utils";
import type { CountryCode } from "@/types/constants";

const props = withDefaults(defineProps<{
  size?: "m" | "s" | "l";
  code: CountryCode;
  borderRadius?: boolean;
  className?: string;
}>(), {
  size: "m",
  borderRadius: true,
});

// maybe refactor this out to composable (maybe this linked solution,
// or another one in the thread)
// https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434
const glob = import.meta.glob("~/assets/svg/flags/active/*.svg", { eager: true });
const images = Object.fromEntries(
  Object.entries(glob).map(([key, value]) => [filename(key), value.default]),
);
const imageUrl = computed(() => images[props.code]);
</script>

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
