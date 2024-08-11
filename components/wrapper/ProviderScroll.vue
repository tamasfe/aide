<script setup lang="ts">
const { t } = useI18n();
const { isMobile } = useDevice();
const data = ref<unknown[]>(Array.from({ length: 4 }, (_, i) => i + 1));
const loading = ref(true);

defineProps<{ title: string }>();

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <GridScroll
    :data="data"
    :show-controls="!isMobile"
    :loading="loading"
    :slides-to-scroll="2"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">{{ title }}</h2>
    </template>
    <template #options>
      <BaseButton class="bg-subtle hover:bg-emphasis text-subtle">
        {{ t("see_all") }}
      </BaseButton>
    </template>
    <template #default="{ data: index }">
      <div
        class="basis-[calc((100%-2rem)/2.5)] sm:basis-[calc((100%-3rem)/3.5)] flex-shrink-0 w-full"
      >
        <div class="px-2 sm:px-8 space-y-4">
          <div class="relative rounded-[0.8rem] overflow-hidden pt-[59.52%]">
            <BaseSkeleton
              :loading="loading"
              class="absolute left-0 top-0 w-full h-full"
            >
              <!-- center image -->
              <NuxtImg
                :src="`/assets/images/providers/${index}.png`"
                alt=""
                class="absolute top-1/2 left-1/2 w-full object-cover rounded-[0.8rem] transform -translate-x-1/2 -translate-y-1/2"
              />
            </BaseSkeleton>
          </div>
          <div class="w-full flex justify-center">
            <p
              class="py-1 px-2 bg-button-primary text-transparent bg-clip-text"
            >
              32 {{ t("games").toLowerCase() }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </GridScroll>
</template>
