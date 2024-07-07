<script setup lang="ts">
const { isMobile } = useDevice();
const data = ref<unknown[]>(Array.from({ length: 4 }, (_, i) => i + 1));
const loading = ref(false);

defineProps<{ title: string }>();
</script>

<template>
  <GridPage
    :data="data"
    :columns="4"
    :show-controls="!isMobile"
    :loading="loading"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">{{ title }}</h2>
    </template>
    <template #options>
      <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
    </template>
    <template #default="{ data: index }">
      <div class="px-2 sm:px-8 space-y-4">
        <div class="relative rounded-[0.8rem] overflow-hidden pt-[59.52%]">
          <NuxtImg
            :src="`/assets/images/providers/${index}.png`"
            alt=""
            class="absolute top-0 left-0 w-full object-cover rounded-[0.8rem]"
          />
        </div>
        <div class="w-full flex justify-center">
          <div class="bg-subtle rounded-lg">
            <p
              class="py-1 px-2 bg-button-primary text-transparent bg-clip-text"
            >
              32 games
            </p>
          </div>
        </div>
      </div>
    </template>
  </GridPage>
</template>
