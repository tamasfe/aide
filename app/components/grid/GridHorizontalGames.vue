<script setup lang="ts">
// STATUS:
// - Move loading into wrapper?
const generateFakeData = (length: number) => {
  return Array.from({ length }, (_, i) => (i % 10) + 1);
};

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

const data = ref<number[]>(generateFakeData(20));
const canLoadMore = computed(() => data.value.length < 100);
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

const onLoadData = async () => {
  // fake loading
  loading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  data.value?.push(...generateFakeData(20));
  loading.value = false;
};
</script>

<template>
  <GridHeaderHorizontal
    :data="data"
    :loading="loading"
    :can-load-more="canLoadMore"
    :slides-to-scroll="slidesToScroll"
    :columns="columns"
    aspect-ratio="3/4"
    @trigger:load="onLoadData"
  >
    <template #title>
      <GridHeaderTitle title="🔥 Top Trending" />
    </template>

    <template #options>
      <NuxtLink :to="`/categories/1`">
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ $t("button.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template>

    <template #default="{ item: n }">
      <NuxtLink
        :to="`/games/${n}`"
        class="block bg-subtle rounded-default w-full h-full overflow-hidden"
      >
        <NuxtImg
          :src="`/assets/images/games/${n}.png`"
          alt=""
          class="block w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
        />
      </NuxtLink>
    </template>
    <template
      v-if="canLoadMore"
      #loading
    >
      <div
        class="flex items-center justify-center w-full h-full bg-subtle rounded-default"
      >
        <BaseSpinner
          class="text-subtle"
          :size="34"
        />
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
