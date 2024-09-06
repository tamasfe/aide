<script setup lang="ts">
const data = ref<unknown[]>(Array.from({ length: 4 }, (_, i) => i + 1));
const loading = ref(true);

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

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <GridHeaderHorizontal
    :data="data"
    :columns="columns"
    :slides-to-scroll="slidesToScroll"
    :loading="loading"
    :gap="2"
    aspect-ratio="16/9"
  >
    <template #title>
      <GridHeaderTitle title="🏆 Game Studios" />
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
        <div
          class="w-full flex justify-center font-medium bg-button-primary text-transparent bg-clip-text"
        >
          {{ $t("grid.game_count", { count: 69 }) }}
        </div>
      </div>
    </template>
  </GridHeaderHorizontal>
</template>
