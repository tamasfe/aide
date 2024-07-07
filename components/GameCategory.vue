<script setup lang="ts">
const { isMobile } = useDevice();
const data = ref<unknown[]>(Array.from({ length: 8 }, (_, i) => i + 1));
const loading = ref(false);

defineProps<{ title: string }>();
</script>

<template>
  <GridPage
    :data="data"
    :columns="6"
    :show-controls="!isMobile"
    :loading="loading"
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
        class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
      >
        <NuxtImg
          :src="`/assets/images/games/${index}.png`"
          alt=""
          class="absolute top-0 left-0 w-full object-cover rounded-default transition-transform transform hover:scale-105"
        />
      </div>
    </template>
  </GridPage>
</template>
