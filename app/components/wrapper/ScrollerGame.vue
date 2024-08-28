<script setup lang="ts">
// DESIGN STATUS:        ✴️
//   * didnt do audit of css
// ARCHITECTURE STATUS:  ✴️
//   * infinite scroll logic should be handled WrapperInfiniteScroller and then ScrollerGame uses that. We will have many scrollers and pretty much every single one will be infinite scroll. we shouldnt be re-adding that logic multiple times
//   * ALSO loading in last position must be extracted to the wrapper as well
//   * any advanced logic in here should be moved to wrapper as well. if we are having ScrollerGame/ScrollerProvider the only thing it should do is provide some api call metadata and "counts (offsets/limits)" and nothing else
//   * SEO stuffbelow
// TRANSLATION STATUS:   ✴️

const { isMobile } = useDevice();

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
  xl: 6,
});

const data = ref<number[]>(generateFakeData(20));
const canLoadMore = computed(() => data.value.length <= 100);
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
  <WrapperGridScrollerInfinite
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :can-load-more="canLoadMore"
    :slides-to-scroll="slidesToScroll"
    :columns="columns"
    aspect-ratio="3/4"
    @trigger:load="onLoadData"
  >
    <template #title>
      <h2 class="text-xl font-semibold sm:text-2xl">🔥 Top Trending</h2>
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
      <div class="bg-subtle rounded-default w-full h-full overflow-hidden">
        <NuxtLink :to="`/games/${n}`">
          <NuxtImg
            :src="`/assets/images/games/${n}.png`"
            alt=""
            class="block w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
          />
        </NuxtLink>
      </div>
    </template>
  </WrapperGridScrollerInfinite>
</template>
