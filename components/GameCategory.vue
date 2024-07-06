<script setup lang="ts">
import { PhPlay } from "@phosphor-icons/vue";

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
      <BaseButton class="bg-subtle text-subtle"> See all </BaseButton>
    </template>
    <template #default="{ data }">
      <div
        class="relative bg-subtle rounded-[0.8rem] overflow-hidden pt-[134.26%]"
      >
        <NuxtImg
          :src="`/assets/images/games/${data}.png`"
          alt=""
          class="absolute top-0 left-0 w-full object-cover rounded-[0.8rem] transition-transform transform hover:scale-105"
        />
      </div>
    </template>
  </GridPage>
</template>
