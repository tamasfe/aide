<script setup lang="ts">
defineOptions({ inheritAttrs: false });
const size = 10;
const items = ref(Array.from({ length: size }, (_, i) => ({ key: String(i) })));
</script>

<template>
  <GridHeader class="mb-2">
    <template #title>
      <div class="flex gap-6 items-center">
        <BaseSkeleton
          class="w-60 h-6"
          :loading="true"
        />
        <BaseSkeleton
          class="w-10 h-8"
          :loading="true"
        />
        <BaseSkeleton
          class="w-10 h-8"
          :loading="true"
        />
      </div>
    </template>
    <template #options>
      <BaseSkeleton
        class="w-20 h-8"
        :loading="true"
      />
    </template>
  </GridHeader>

  <BaseSlider
    v-bind="$attrs"
    ref="slider"
    :data="items"
    class="-mx-4"
  >
    <div class="pt-1">
      <BaseSkeleton loading class="border border-muted/5 w-full h-full aspect-[3/4]" />
    </div>
  </BaseSlider>
</template>
