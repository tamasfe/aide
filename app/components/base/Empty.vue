<script setup lang="ts">
import type { HTMLAttributes } from "vue";

withDefaults(
  defineProps<{
    title?: string;
    icon?: string;
    size?: number;
    textClass?: HTMLAttributes["class"];
  }>(), {
    title: "No Results",
    icon: "lucide:box-select",
    size: 24,
    textClass: "",
  },
);
</script>

<template>
  <div class="min-h-[100px] flex flex-row gap-3 justify-center items-center">
    <BaseIcon
      :name="icon"
      :size="size"
      class="text-subtle"
    />
    <div
      :class="cn(
        'text-subtle text-lg font-medium',
        textClass,
      )"
    >
      {{ title }}
    </div>
  </div>
</template>
