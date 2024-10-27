<script setup lang="ts">
// STATUS:
// - Title will come from props
const generateFakeData = (max: number) => {
  return new Array(max).fill(0).map((_, i) => i);
};

// IMPORTANT REDO ALL OF THIS JAVASCRIPT CODE THIS IS THE OLD VERSION. MAKE
// SURE TO JUST COPY SIMILAR CODE + PROPS FROM VERTICALGAMES.VUE
// IMPORTANT REDO ALL OF THIS JAVASCRIPT CODE THIS IS THE OLD VERSION. MAKE
// SURE TO JUST COPY SIMILAR CODE + PROPS FROM VERTICALGAMES.VUE
// IMPORTANT REDO ALL OF THIS JAVASCRIPT CODE THIS IS THE OLD VERSION. MAKE
// SURE TO JUST COPY SIMILAR CODE + PROPS FROM VERTICALGAMES.VUE
// IMPORTANT REDO ALL OF THIS JAVASCRIPT CODE THIS IS THE OLD VERSION. MAKE
// SURE TO JUST COPY SIMILAR CODE + PROPS FROM VERTICALGAMES.VUE

// GameCategory related
const data = ref(generateFakeData(30));
const totalResultsOfSearch = ref(60);

const loading = ref(true);

const onLoadMore = () => {
  const newData = generateFakeData(10);
  data.value = [...data.value, ...newData];
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
      :total-count="totalResultsOfSearch"
      :columns="{ sm: 3, md: 4, lg: 6, xl: 8 }"
      aspect-ratio="3/4"
      pagination
      @trigger:load="onLoadMore"
    >
      <template #default="{ data: gameId }">
        <NuxtLink
          :to="`/games/${gameId}`"
          class="block bg-subtle rounded-default w-full h-full overflow-hidden"
        >
          <GamesImageLoader :game-id="gameId" />
        </NuxtLink>
      </template>
    </GridVertical>
  </GridHeader>
</template>
