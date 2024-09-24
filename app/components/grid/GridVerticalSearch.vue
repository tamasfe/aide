<script setup lang="ts">
// STATUS:
// - Title will come from props
const generateFakeData = (max: number) => {
  return new Array(max).fill(0).map((d, i) => ({
    index: i,
    title: `Game ${i + 1}`,
    value: d,
  }));
};

// GameCategory related
const data = ref(generateFakeData(30));
const max = 60;

const loading = ref(true);

const onLoadMore = () => {
  const newData = generateFakeData(10);
  data.value = [...data.value, ...newData];
};

// temp utils
const getImageId = (idx: number) => {
  const index = idx;
  // 8 max images will not anyways be used in the final version
  return (index % 8) + 1;
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <GridHeader>
    <template #title>
      <div class="flex gap-4 items-center">
        <GridHeaderTitle title="32 Results" />
      </div>
    </template>

    <GridVertical
      :data="data"
      :max="max"
      aspect-ratio="3/4"
      pagination
      @trigger:load="onLoadMore"
    >
      <template #default="{ data: datapoint }">
        <NuxtLink
          :to="`/games/${datapoint.index}`"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <NuxtImg
            :src="`/assets/images/games/${getImageId(datapoint.index)}.png`"
            alt=""
            class="block w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
          />
        </NuxtLink>
      </template>
    </GridVertical>
  </GridHeader>
</template>
