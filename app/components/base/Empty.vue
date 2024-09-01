<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    icon?: string;
  }>(), {
    title: "No Results",
    icon: "lucide:box-select",
  },
);
</script>

<template>
  <div class="min-h-[100px] flex flex-row gap-3 justify-center items-center">
    <Icon
      :name="icon"
      size="28"
      class="text-subtle"
    />
    <div class="text-subtle text-lg md:text-xl font-medium">{{ title }}</div>
  </div>
</template>
