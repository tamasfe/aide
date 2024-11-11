<script setup lang="ts">
import type { HTMLAttributes } from "vue";

// DESIGN STATUS:       ✴️
//   * icons should be slightly bigger on mobile ONLY (gameframevotes should be refactored slightly to account for this)
//   * i think the look of the % / votes could look slightly better... maybe its font color?
// ARCHITECTURE STATUS: ✅
// TRANSLATION STATUS:  ✅

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    :class="cn(
      'flex flex-row gap-2 items-center',
      props.class,
    )"
  >
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
    >
      <BaseIcon
        name="lucide:thumbs-down"
        :size="24"
      />
    </BaseButton>
    <div class="flex flex-col gap-1 leading-none whitespace-nowrap items-center text-sm text-center justify-center">
      <div>75.2%</div>
      <div class="font-medium">2.425</div>
    </div>
    <BaseButton
      variant="ghost"
      size="ghost"
      class="flex flex-row gap-1 items-center hover:text-subtle-light"
    >
      <BaseIcon
        name="lucide:thumbs-up"
        :size="24"
      />
    </BaseButton>
  </div>
</template>
