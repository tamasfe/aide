<script setup lang="ts">
// DESIGN STATUS:       ✴️
//   * show animation when copied (animate + fade out of the value?)

const props = defineProps<{
  value: string | number;
}>();

const onCopy = () => {
  const value = String(props.value);
  navigator.clipboard.writeText(value);
};
</script>

<template>
  <div
    class="flex flex-row items-center gap-1.5 cursor-pointer"
    @click="onCopy"
  >
    <Icon
      name="lucide:copy"
      size="14"
      class="text-subtle"
    />
    <div>{{ value }}</div>
  </div>
</template>
