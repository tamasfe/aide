<script setup lang="ts">
const size = 10;
const items = ref(Array.from({ length: size }, (_, i) => ({ key: String(i) })));
</script>

<template>
  <section class="w-full max-w-screen-xl mx-auto">
    <GridHeader class="px-4 mb-2">
      <template #title>
        <div class="flex gap-6 items-center">
          <BaseSkeleton
            class="w-60 h-6 rounded bg-subtle"
            :loading="true"
          />
          <BaseSkeleton
            class="w-10 h-8 rounded bg-subtle"
            :loading="true"
          />
          <BaseSkeleton
            class="w-10 h-8 rounded bg-subtle"
            :loading="true"
          />
        </div>
      </template>
      <template #options>
        <BaseSkeleton
          class="w-20 h-8 rounded bg-subtle"
          :loading="true"
        />
      </template>
    </GridHeader>

    <BaseSlider
      ref="slider"
      :data="items"
      class="w-full"
    >
      <div class="pt-1">
        <BaseSkeleton loading class="border border-muted/5 flex items-center justify-center w-full h-full bg-subtle rounded aspect-[3/4]" />
      </div>
    </BaseSlider>
  </section>
</template>
