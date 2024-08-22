<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";

// DESIGN STATUS:        ✴️
//   * didnt do audit of css
// ARCHITECTURE STATUS:  ✴️
//   * infinite scroll logic should be handled WrapperInfiniteScroller and then ScrollerGame uses that. We will have many scrollers and pretty much every single one will be infinite scroll. we shouldnt be re-adding that logic multiple times
//   * ALSO loading in last position must be extracted to the wrapper as well
//   * any advanced logic in here should be moved to wrapper as well. if we are having ScrollerGame/ScrollerProvider the only thing it should do is provide some api call metadata and "counts (offsets/limits)" and nothing else
//   * SEO stuffbelow
// TRANSLATION STATUS:   ✴️

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

const onScroll = () => {
  console.log("scrolled");
};
</script>

<template>
  hello
  <GridScroller
    :data="data"
    :show-controls="!isMobile"
    :loading="!data.length"
    :slides-to-scroll="3"
    @scrolled="onScroll"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">Fortune Tiger</h2>
    </template>
    <template #options>
      <NuxtLink :to="`/categories/1`">
        <BaseButtonNew
          variant="ghost"
          size="ghost"
          class="bg-subtle text-sm text-subtle hover:bg-emphasis"
        >
          {{ t("button.see_all") }}
        </BaseButtonNew>
      </NuxtLink>
    </template>
    <template #default="{ item: game }">
      <div
        class="basis-[calc((100%-2rem)/2)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <div class="absolute left-0 top-0 w-full h-full">
            <NuxtLink
              v-if="game"
              :to="`/games/${game.id}`"
              class="block"
            >
              <span class="block">
                <NuxtImg
                  :src="`/assets/images/games/${index}.png`"
                  alt=""
                  class="block absolute top-0 left-0 w-full h-full object-cover transition-transform transform hover:scale-105 cursor-pointer"
                />
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
    <template
      v-if="true"
      #loading
    >
      <div
        class="basis-[calc((100%-2rem)/2)] sm:basis-[calc((100%-5rem)/6)] flex-shrink-0 w-full"
      >
        <div
          class="relative bg-subtle rounded-default overflow-hidden pt-[134.26%]"
        >
          <div
            class="absolute left-0 top-0 w-full h-full grid place-items-center"
          >
            <Icon
              name="lucide:loader-circle"
              class="animate-spin text-subtle"
              size="32"
            />
          </div>
        </div>
      </div>
    </template>
  </GridScroller>
</template>
