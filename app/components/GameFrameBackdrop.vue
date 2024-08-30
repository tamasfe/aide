<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✅
//   * could look a little fancier...
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  authenticated: boolean;
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(
      'w-full relative bg-emphasis overflow-hidden',
      props.class,
    )"
  >
    <slot
      v-if="authenticated"
      name="authenticated"
    />
    <template v-else>
      <NuxtImg
        class="absolute top-0 left-0 w-full h-full object-cover"
        src="/assets/images/games/3.png"
        alt=""
      />
      <div
        class="bg-default/80 backdrop-blur absolute top-0 left-0 w-full h-full flex justify-center items-center"
      >
        <slot />
      </div>
    </template>
  </div>
</template>
