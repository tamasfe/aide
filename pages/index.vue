<script setup lang="ts">
const search = ref("");
const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const { isMobile } = useDevice();

const data = ref<unknown[]>(Array.from({ length: 8 }, (_, i) => i + 1));
const loading = ref(true);

const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

onMounted(async () => {
  await waitFor(3000);
  loading.value = false;
  data.value = Array.from({ length: 10 }, (_, i) => i + 1);
});
</script>

<template>
  <div class="sm:py-8">
    <div class="sm:px-10 h-[200px] sm:h-[350px] lg:h-[450px]">
      <CarouselHome class="h-full w-full" />
    </div>
    <div class="px-4 sm:px-10 py-6">
      <!-- <ComponentsTest /> -->
      <div class="grid grid-cols-1 gap-6">
        <BaseSearch
          v-model="search"
          class="w-full"
        >
          <template #default>
            <GridPage
              :data="data"
              :columns="6"
              :loading="loading"
            >
              <template #title> ⭐ Popular </template>
              <template #options>
                <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
              </template>
              <template #default>
                <div
                  class="bg-subtle rounded-default h-[150px] md:h-[300px] overflow-hidden"
                  :class="isMobile ? 'w-24' : ''"
                >
                  <BaseSkeleton
                    class="w-full h-full"
                    :loading="loading"
                  >
                    <NuxtImg
                      :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                      alt=""
                      class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
                    />
                  </BaseSkeleton>
                </div>
              </template>
            </GridPage>
          </template>
        </BaseSearch>
        <HomeWinningNow
          v-if="!isMobile"
          class="w-full"
        />
        <GridPage
          :data="data"
          :columns="6"
          :show-controls="!isMobile"
          :loading="loading"
        >
          <template #title> ⭐ Popular </template>
          <template #options>
            <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
          </template>
          <template #default>
            <div
              class="bg-subtle rounded-default h-[150px] md:h-[300px] overflow-hidden"
              :class="isMobile ? 'w-24' : ''"
            >
              <BaseSkeleton
                class="w-full h-full"
                :loading="loading"
              >
                <NuxtImg
                  :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                  alt=""
                  class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
                />
              </BaseSkeleton>
            </div>
          </template>
        </GridPage>
        <GridPage
          :data="data"
          :columns="6"
          :show-controls="!isMobile"
          :loading="loading"
        >
          <template #title> 🔥 Hot games today </template>
          <template #options>
            <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
          </template>
          <template #default>
            <div
              class="bg-subtle rounded-default h-[150px] md:h-[300px] overflow-hidden"
              :class="isMobile ? 'w-24' : ''"
            >
              <BaseSkeleton
                class="w-full h-full"
                :loading="loading"
              >
                <NuxtImg
                  :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                  alt=""
                  class="w-full h-full object-cover rounded-default transition-transform transform hover:scale-105"
                />
              </BaseSkeleton>
            </div>
          </template>
        </GridPage>
      </div>
    </div>
  </div>
</template>
