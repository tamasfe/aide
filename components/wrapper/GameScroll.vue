<script setup lang="ts">
import { PhCircleNotch } from "@phosphor-icons/vue";
</script>

<template>
  <GridScroll
    :data="data"
    :show-controls="!isMobile"
    :loading="!data.length"
    :slides-to-scroll="3"
    @scrolled="onScroll"
  >
    <template #title>
      <h2 class="text-xl sm:text-2xl">
        {{ t(getGameCategoryTranslationKey(identifier)) }}
      </h2>
    </template>
    <template #options>
      <NuxtLink :to="`/categories/${identifier}`">
        <BaseButton
          class="bg-subtle text-sm text-subtle hover:bg-emphasis"
          type="button"
        >
          {{ t("button.see_all") }}
        </BaseButton>
      </NuxtLink>
    </template>
    <template #default="{ data: game }">
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
                  :src="getGameImageUrl(game.id, 'large')"
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
      v-if="status === 'pending'"
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
            <PhCircleNotch
              class="animate-spin text-subtle"
              :size="32"
            />
          </div>
        </div>
      </div>
    </template>
  </GridScroll>
</template>
