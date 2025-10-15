<script setup lang="ts">
import type { HTMLAttributes } from "vue";

const props = defineProps<{
  identifier: string;
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
  <NuxtLinkLocale
    :to="{
      name: 'games-provider',
      params: { provider: identifier },
    }"
    :class="cn('block bg-subtle rounded w-full h-full overflow-hidden border border-muted/5 p-2', animationClasses.link, props.class)"
  >
    <ProviderImageLoader :provider-identifier="identifier" :class="cn('aspect-square', animationClasses.img)" />
  </NuxtLinkLocale>
</template>
