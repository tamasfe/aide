<script setup lang="ts">
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
  <div class="pb-4 sm:py-8 md:px-48 flex flex-col md:space-y-6">
    <!-- h-[520px] -->
    <GameFrame v-if="!isMobile" />
    <GameFrameMobile v-else />
    <GameDescriptionCard class="bg-subtle" />
    <GridPage
      class="px-4"
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
      class="px-4"
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
</template>
