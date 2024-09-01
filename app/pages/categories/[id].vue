<script setup lang="ts">
// GameCategory related
const data = ref(
  new Array(30).fill(0).map((d, i) => ({
    index: i,
    title: `Game ${i + 1}`,
    value: d,
  })),
);
const provider = ref("provider1");
const providers = [
  { title: "All", value: "all" },
  { title: "Pragmatic Game", value: "provider1" },
  { title: "Provider 2", value: "provider2" },
  { title: "Provider 3123123123123123", value: "provider3" },
];

const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

// temp utils
const getImageId = (idx: number) => {
  const index = idx;
  // 8 max images will not anyways be used in the final version
  return (index % 8) + 1;
};
</script>

<template>
  <NuxtLayout name="carousel">
    <div class="giro__container giro__sections">
      <GridCategory
        :data="data"
        :max="60"
      >
        <template #title>
          <h3 class="text-[1.268rem] xl:text-[1.137rem] font-bold">
            🔥 Top Games
          </h3>
        </template>
        <template #options>
          <BaseSelect />
        </template>
        <template #default="{ data: datapoint }">
          <div
            class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
          >
            <BaseSkeleton
              :loading="loading"
              class="absolute left-0 top-0 w-full h-full"
            >
              <NuxtLink :to="`/games/${datapoint.index}`">
                <span class="block">
                  <NuxtImg
                    :src="`/assets/images/games/${getImageId(
                      datapoint.index,
                    )}.png`"
                    alt=""
                    class="absolute top-0 left-0 w-full object-cover rounded-default transition-transform transform hover:scale-105 cursor-pointer"
                  />
                </span>
              </NuxtLink>
            </BaseSkeleton>
          </div>
        </template>
      </GridCategory>
    </div>
  </NuxtLayout>
</template>
