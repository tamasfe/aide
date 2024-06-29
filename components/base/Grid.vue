<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: any[];
    columns?: number;
  }>(),
  {
    columns: 6,
  },
);

const gridColumns = computed(() => {
  return {
    gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`,
  };
});
</script>

<template>
  <div
    class="grid gap-6"
    :style="gridColumns"
  >
    <div
      v-for="(datapoint, index) in data"
      :key="index"
    >
      <slot :data="datapoint" />
    </div>
  </div>
</template>
