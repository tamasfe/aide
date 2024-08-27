<script setup lang="ts">
const { isMobile } = useDevice();
const data = ref<unknown[]>(Array.from({ length: 4 }, (_, i) => i + 1));
const loading = ref(true);

// DESIGN STATUS:        ✴️
//   * follow all advice of ScrollerGame
// ARCHITECTURE STATUS:  ✴️
//   * follow all advice of ScrollerGame
//   * just like game... this will come from the API
// TRANSLATION STATUS:   ✅

// TODO: not final, should be configured
const scrollerOptions = {
  slidesToScroll: {
    sm: 1.5,
    md: 2.5,
    lg: 3,
    xl: 3,
  },
  columns: {
    sm: 1.7,
    md: 2.7,
    lg: 3.5,
    xl: 3.5,
  },
  aspectRatio: {
    sm: "4/1",
    md: "6/1",
    lg: "8/1",
    xl: "8/1",
  },
  gap: 3,
};

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <WrapperGridScrollerInfinite
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :columns="scrollerOptions.columns"
    :slides-to-scroll="scrollerOptions.slidesToScroll"
    :gap="scrollerOptions.gap"
    :aspect-ratio="scrollerOptions.aspectRatio"
    :can-load-more="false"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">🏆 {{ $t("grid.providers") }}</h2>
    </template>
    <template #options>
      <NuxtLink to="TODO">
        <BaseButton
          variant="subtle"
          size="sm"
        >
          {{ $t("button.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template>
    <template #default="{ item: index }">
      <div class="flex flex-col space-y-4 justify-between w-full h-full">
        <div class="flex-1 rounded-[0.7rem] overflow-hidden">
          <NuxtLink to="/TODO">
            <NuxtImg
              :src="`/assets/images/providers/${index}.png`"
              alt=""
              class="w-full h-full object-cover"
            />
          </NuxtLink>
        </div>
        <div class="w-full flex justify-center">
          <p class="py-1 px-2 bg-button-primary text-transparent bg-clip-text">
            {{ $t("grid.game_count", { count: 69 }) }}
          </p>
        </div>
      </div>
    </template>
  </WrapperGridScrollerInfinite>
</template>
