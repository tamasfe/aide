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
    <div class="max-w-full sm:max-w-[1240px] mx-auto">
      <CarouselHome class="w-full" />
    </div>
    <div class="giro__container py-6">
      <div class="grid grid-cols-1 gap-6">
        <BaseSearch
          v-model="search"
          class="w-full"
        >
          <template #default>
            <GridPage
              :data="data"
              :columns="6"
              :show-controls="!isMobile"
              :loading="loading"
            >
              <template #title>
                <h2 class="text-xl sm:text-2xl">🔥 Top games</h2>
              </template>
              <template #options>
                <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
              </template>
              <template #default>
                <div
                  class="relative bg-subtle rounded-[0.8rem] overflow-hidden pt-[134.26%]"
                >
                  <NuxtImg
                    :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                    alt=""
                    class="absolute top-0 left-0 w-full h-full object-cover rounded-[0.8rem] transition-transform transform hover:scale-105"
                  />
                </div>
              </template>
            </GridPage>
          </template>
        </BaseSearch>
        <HomeWinningNow class="w-full" />
        <GridPage
          :data="data"
          :columns="6"
          :show-controls="!isMobile"
          :loading="loading"
        >
          <template #title>
            <h2 class="text-xl sm:text-2xl">🔥 Top games</h2>
          </template>
          <template #options>
            <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
          </template>
          <template #default>
            <div
              class="relative bg-subtle rounded-[0.8rem] overflow-hidden pt-[134.26%]"
            >
              <NuxtImg
                :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                alt=""
                class="absolute top-0 left-0 w-full h-full object-cover rounded-[0.8rem] transition-transform transform hover:scale-105"
              />
            </div>
          </template>
        </GridPage>
        <GridPage
          :data="data"
          :columns="6"
          :show-controls="!isMobile"
          :loading="loading"
        >
          <template #title>
            <h2 class="text-xl sm:text-2xl">👍 Popular Games</h2>
          </template>
          <template #options>
            <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
          </template>
          <template #default>
            <div
              class="relative bg-subtle rounded-[0.8rem] overflow-hidden pt-[134.26%]"
            >
              <NuxtImg
                :src="`https://picsum.photos/200/300?random=${random(0, 100)}`"
                alt=""
                class="absolute top-0 left-0 w-full h-full object-cover rounded-[0.8rem] transition-transform transform hover:scale-105"
              />
            </div>
          </template>
        </GridPage>
      </div>
    </div>
  </div>
</template>
