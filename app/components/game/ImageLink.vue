<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  identifier: string;
  slug?: string;
  // altText?: string;
  animationOnHover?: "vertical-translate" | "zoom-in" | null;
  class?: HTMLAttributes["class"];
}>();

const animationClasses = computed(() => {
  switch (props.animationOnHover) {
    case "vertical-translate":
      return {
        link: "transition-transform transform lg:hover:-translate-y-1",
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
    :class="cn('block bg-subtle rounded w-full h-full overflow-hidden border border-muted/5', animationClasses.link, props.class)"
  >
    <GameImage
      :identifier="identifier"
      :class="cn('block w-full h-full object-cover cursor-pointer', animationClasses.img)"
    />
  </GamePageLink>
</template>
