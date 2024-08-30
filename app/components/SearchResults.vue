<script setup lang="ts">
// DESIGN STATUS: ✴️
//   * use skeleton loaders and loading spinner inside search bar

const data = ref(
  new Array(30).fill(0).map((d, i) => ({
    index: i,
    title: `Game ${i + 1}`,
    value: d,
  })),
);
</script>

<template>
  <GridCategory
    :data="data"
    :max="60"
  >
    <template #title>
      <h3 class="text-[1.268rem] xl:text-[1.137rem] font-bold">
        🔥 Top Games
      </h3>
    </template>
    <template #default="{ data: datapoint }">
      <div
        class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
      >
        <BaseSkeleton
          :loading="false"
          class="absolute left-0 top-0 w-full h-full"
        >
          <NuxtLink :to="`/games/${datapoint.index}`">
            <ImageRatio
              :src="`/assets/images/games/${(datapoint.index % 8) + 1}.png`"
              alt=""
              ratio="300/350"
              class="group-hover:opacity-90 rounded-default"
            />
          </NuxtLink>
        </BaseSkeleton>
      </div>
    </template>
  </GridCategory>
</template>
