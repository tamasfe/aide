<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  src: string;
  id: number;
  altText?: string;
  animationOnHover?: "vertical-translate" | "zoom-in" | null;
  class?: HTMLAttributes["class"];
}>();

const animationClasses = computed(() => {
  switch (props.animationOnHover) {
    case "vertical-translate":
      return {
        link: "mt-2 transition-transform transform hover:-translate-y-2",
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
  <BaseLink
    :to="{ name: 'games-id', params: { id: props.id } }"
    :class="cn('block bg-subtle rounded w-full h-full overflow-hidden border border-emphasis/50', animationClasses.link, props.class)"
  >
    <GameImage
      :src="src"
      :alt="altText || ''"
      :class="cn('block w-full h-full object-cover cursor-pointer', animationClasses.img)"
    />
  </BaseLink>
</template>
