<script setup lang="ts">
const slidesToScroll = ref({
  sm: 3,
  md: 3,
  lg: 3,
  xl: 3,
});

const columns = ref({
  sm: 2.7,
  md: 3.7,
  lg: 6,
  xl: 8,
});

const size = 10;
const slidesBeforeLoad = 4; // We aribitrarely set it to +1 the slides to scroll to give time for the loading one scroll ahead
const games = ref(Array.from({ length: size }, (_, i) => ({ key: String(i) })));
</script>

<template>
  <GridHeaderHorizontal
    class="gap-2"
    :data="games"
    :loading="true"
    :can-load-more="false"
    :slides-to-scroll="slidesToScroll"
    :columns="columns"
    :slides-before-load="slidesBeforeLoad"
    :manual-scroll="false"
    aspect-ratio="3/4"
  >
    <template #title>
      <div class="flex items-center">
        <BaseSkeleton
          class="w-20 h-6"
          :loading="false"
        />
      </div>
    </template>

    <template #options />

    <template #default>
      <div class="flex items-center justify-center w-full h-full bg-subtle rounded">
        <BaseSkeleton
          :loading="true"
        />
      </div>
    </template>

    <template
      #loading
    >
      <div class="flex items-center justify-center w-full h-full bg-subtle rounded">
        <BaseSkeleton
          :loading="true"
        />
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
