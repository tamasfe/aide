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

const slidesToScroll = ref({
  sm: 2,
  md: 2,
  lg: 2,
  xl: 2,
});

const columns = ref({
  sm: 2.7,
  md: 2.7,
  lg: 2.7,
  xl: 2.7,
});

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <WrapperGridScrollerInfinite
    :title="`🏆 ${$t('grid.providers')}`"
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :columns="columns"
    :slides-to-scroll="slidesToScroll"
    :gap="2"
    aspect-ratio="16/9"
    :can-load-more="false"
  >
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
      <div class="group flex flex-col gap-2 justify-between w-full h-full">
        <div class="flex-1 rounded-[0.7rem] overflow-hidden">
          <NuxtLink to="/TODO">
            <NuxtImg
              :src="`/assets/images/providers/${index}.png`"
              alt=""
              class="group-hover:opacity-80 w-full h-full object-cover"
            />
          </NuxtLink>
        </div>
        <div class="w-full flex justify-center font-medium bg-button-primary text-transparent bg-clip-text">{{ $t("grid.game_count", { count: 69 }) }}</div>
      </div>
    </template>
  </WrapperGridScrollerInfinite>
</template>
