<script setup lang="ts">
const { isMobile } = useDevice();

const itemsCount = 20;

const data = ref<unknown[]>(
  Array.from({ length: itemsCount }, (_, i) => i + 1),
);
const loading = ref(true);

defineProps<{
  title: string;
}>();

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

const getImageId = (idx: unknown) => {
  const index = idx as number;
  // 8 max images will not anyways be used in the final version
  return (index % 8) + 1;
};
</script>

<template>
  <GridPage
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :slides-to-scroll="3"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">{{ title }}</h2>
    </template>
    <template #options>
      <BaseButton class="bg-subtle text-subtle hover:bg-emphasis">
        See all
      </BaseButton>
    </template>
    <template #default="{ data: index }">
      <div
        class="basis-[calc((100%-2rem)/2.5)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <BaseSkeleton
            :loading="loading"
            class="absolute left-0 top-0 w-full h-full"
          >
            <NuxtImg
              :src="`/assets/images/games/${getImageId(index)}.png`"
              alt=""
              class="absolute top-0 left-0 w-full object-cover rounded-default transition-transform transform hover:scale-105 cursor-pointer"
            />
          </BaseSkeleton>
        </div>
      </div>
    </template>
  </GridPage>
</template>
