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
  <div class="'min-h-[200px] flex flex-row justify-center items-center'">
    <Icon
      :name="icon"
      size="30"
    />
    <div class="font-semibold">{{ title }}</div>
  </div>
</template>
