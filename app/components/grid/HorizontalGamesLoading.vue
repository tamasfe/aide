<script setup lang="ts">
const size = 10;
const games = ref(Array.from({ length: size }, (_, i) => ({ key: String(i) })));
</script>

<template>
  <GridHeader class="w-full max-w-screen-xl mx-auto px-4 mb-2">
    <template #title>
      <div class="flex gap-6 items-center">
        <div class="flex items-center">
          <BaseSkeleton
            class="w-20 h-6"
            :loading="false"
          />
        </div>
      </div>
    </template>
  </GridHeader>

  <BaseSlider
    ref="slider"
    :data="games"
    :loading="true"
    class="w-full"
  >
    <div class="mt-2 flex items-center justify-center w-full h-full bg-subtle rounded">
      <BaseSkeleton
        :loading="true"
      />
    </div>
  </BaseSlider>
</template>
