<template>
  <div
    :class="[
      'flag',
      `size-${size}`,
      { 'border-radius': hasBorderRadius },
      { border: hasBorder },
      { 'drop-shadow': hasDropShadow },
      gradient,
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
  size: "m" | "s" | "l";
  code: CountryCode;
  hasDropShadow: boolean;
  hasBorder: boolean;
  hasBorderRadius: boolean;
  gradient?: "top-down" | "real-linear" | "real-circular";
  className?: string;
}>(), {
  size: "m",
  hasDropShadow: false,
  hasBorder: false,
  hasBorderRadius: true,
});

// maybe refactor this out to composable (maybe this linked solution,
// or another one in the thread)
// https://github.com/nuxt/nuxt/issues/14766/#issuecomment-1397365434
const glob = import.meta.glob("~/assets/svg/flags/*.svg", { eager: true });
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
.flag.size-s {
  width: 16px;
  height: 12px;
}
.flag.size-s.drop-shadow {
  box-shadow: 0 0 1px 0.5px rgba(0, 0, 0, 0.1);
}
.flag.size-s.border-radius {
  border-radius: 1px;
}
.flag.size-m {
  width: 20px;
  height: 15px;
}
.flag.size-m.drop-shadow {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.flag.size-m.border-radius {
  border-radius: 1.5px;
}
.flag.size-l {
  width: 32px;
  height: 24px;
}
.flag.size-l.drop-shadow {
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.1);
}
.flag.size-l.border-radius {
  border-radius: 2px;
}
.flag.border::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.5);
  mix-blend-mode: overlay;
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
.flag.top-down::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 2%, rgba(255, 255, 255, 0.7) 100%);
}
.flag.real-linear::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
  background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.2) 0%, rgba(39, 39, 39, 0.22) 11%, rgba(255, 255, 255, 0.3) 27%, rgba(0, 0, 0, 0.24) 41%, rgba(0, 0, 0, 0.55) 52%, rgba(255, 255, 255, 0.26) 63%, rgba(0, 0, 0, 0.27) 74%, rgba(255, 255, 255, 0.3) 100%);
}
.flag.real-circular::before {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  display: block;
  mix-blend-mode: overlay;
  box-sizing: border-box;
  background: radial-gradient(circle at center 50% 36%, rgba(255, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0.24) 11%, rgba(0, 0, 0, 0.55) 17%, rgba(255, 255, 255, 0.26) 22%, rgba(0, 0, 0, 0.17) 27%, rgba(255, 255, 255, 0.28) 31%, rgba(255, 255, 255, 0) 37%) calc(50% - 8px) / 600% 600%, radial-gradient(circle at center 50% 123%, rgba(255, 255, 255, 0.3) 25%, rgba(0, 0, 0, 0.24) 48%, rgba(0, 0, 0, 0.55) 61%, rgba(255, 255, 255, 0.26) 72%, rgba(0, 0, 0, 0.17) 80%, rgba(255, 255, 255, 0.28) 88%, rgba(255, 255, 255, 0.3) 100%) calc(50% - 8px) / 600% 600%;
}
.flag img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
