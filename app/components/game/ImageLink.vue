<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  identifier: string;
  slug?: string;
  altText?: string;
  animationOnHover?: "vertical-translate" | "zoom-in" | null;
  class?: HTMLAttributes["class"];
  fallbackImageClass?: HTMLAttributes["class"];
}>();

const animationClasses = computed(() => {
  switch (props.animationOnHover) {
    case "vertical-translate":
      return {
        link: "mt-2 transition-transform transform lg:hover:-translate-y-2",
        img: "",
      };

    case null:
      return {
        link: "",
        img: "",
      };

    case "zoom-in":
    case undefined:
    default:
      return {
        link: "",
        img: "transition-transform transform hover:scale-105",
      };
  }
});
</script>

<template>
  <GamePageLink
    :identifier="identifier"
    :class="cn('block bg-subtle rounded w-full h-full overflow-hidden border border-emphasis/50', animationClasses.link, props.class)"
  >
    <GameImage
      :fallback-image-class="fallbackImageClass"
      :identifier="identifier"
      :alt="altText || ''"
      :class="cn('block w-full h-full object-cover cursor-pointer', animationClasses.img)"
    />
  </GamePageLink>
</template>
